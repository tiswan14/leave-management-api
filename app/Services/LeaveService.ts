import LeaveRequest from 'App/Models/LeaveRequest'
import User from 'App/Models/User'
import { DateTime } from 'luxon'

export default class LeaveService {
  private calculateDuration(start: DateTime, end: DateTime): number {
    return Math.floor(end.diff(start, 'days').as('days')) + 1
  }

  /**
   * EMPLOYEE METHODS
   */
  public async getEmployeeHistory(userId: number) {
    return await LeaveRequest.query()
      .where('userId', userId)
      .preload('user', (query) => {
        query.select(['id', 'name', 'email', 'leave_quota'])
      })
      .orderBy('createdAt', 'desc')
  }

  public async create(userId: number, payload: any) {
    const user = await User.findOrFail(userId)

    // Authorization
    if (user.role === 'admin') {
      throw new Error('Admin is not allowed to create leave requests')
    }

    // Parse date
    const start =
      payload.startDate instanceof DateTime
        ? payload.startDate
        : DateTime.fromISO(payload.startDate)

    const end =
      payload.endDate instanceof DateTime
        ? payload.endDate
        : DateTime.fromISO(payload.endDate)

    const today = DateTime.now().startOf('day')

    // Validate date
    if (!start.isValid || !end.isValid) {
      throw new Error('Invalid date format')
    }

    if (start < today) {
      throw new Error('Start date cannot be in the past')
    }

    const duration = this.calculateDuration(start, end)

    if (duration <= 0) {
      throw new Error('Invalid date range: end date must be after start date')
    }

    // Check pending request
    const hasPendingRequest = await LeaveRequest.query()
      .where('user_id', userId)
      .where('status', 'pending')
      .first()

    if (hasPendingRequest) {
      throw new Error('You still have a pending leave request. Please wait until it is processed')
    }

    // =========================
    // DYNAMIC QUOTA PER YEAR
    // =========================
    const currentYear = DateTime.now().year

    const approvedLeaves = await LeaveRequest.query()
      .where('user_id', userId)
      .where('status', 'approved')
      .whereRaw('YEAR(start_date) = ?', [currentYear])

    const usedDays = approvedLeaves.reduce((total, leave) => {
      return total + this.calculateDuration(leave.startDate, leave.endDate)
    }, 0)

    const remainingQuota = 12 - usedDays

    if (remainingQuota < duration) {
      throw new Error(
        `Insufficient leave quota. Available: ${remainingQuota}, Required: ${duration}`,
      )
    }

    // =========================
    // OVERLAP CHECK
    // =========================
    const overlappingRequest = await LeaveRequest.query()
      .where('user_id', userId)
      .whereIn('status', ['pending', 'approved'])
      .where((query) => {
        query.where((q) =>
          q
            .where('start_date', '<=', end.toSQLDate())
            .andWhere('end_date', '>=', start.toSQLDate()),
        )
      })
      .first()

    if (overlappingRequest) {
      throw new Error(
        `You already have a ${overlappingRequest.status} leave request within this date range`,
      )
    }

    // Create
    return await LeaveRequest.create({
      userId: user.id,
      startDate: start,
      endDate: end,
      reason: payload.reason,
      attachment: payload.attachment ?? null,
      status: 'pending',
    })
  }

  /**
   * ADMIN METHODS
   */
  public async getAllRequests() {
    return await LeaveRequest.query()
      .preload('user', (query) => query.select('id', 'name', 'email', 'leave_quota'))
      .orderBy('status', 'asc')
      .orderBy('createdAt', 'desc')
  }

  public async updateStatus(
    id: number,
    adminId: number,
    payload: { status: 'approved' | 'rejected', rejectReason?: string },
  ) {
    const leave = await LeaveRequest.findOrFail(id)
    // Ambil data user-nya juga
    const user = await User.findOrFail(leave.userId)

    if (leave.status !== 'pending') {
      throw new Error('Action denied: Request already processed')
    }

    if (payload.status === 'approved') {
      const duration = this.calculateDuration(leave.startDate, leave.endDate)

      // Cek langsung ke kolom leaveQuota milik user
      if (user.leaveQuota < duration) {
        throw new Error('Process failed: User has insufficient leave quota')
      }

      // --- TAMBAHKAN LOGIC INI ---
      // Kurangi kuota user secara permanen
      user.leaveQuota = user.leaveQuota - duration
      await user.save()
      // ---------------------------
    }

    // Update status pengajuan
    leave.merge({
      status: payload.status,
      actionBy: adminId,
      rejectReason: payload.rejectReason || null,
    })

    return await leave.save()
  }
}