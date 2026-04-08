import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import LeaveService from 'App/Services/LeaveService'
import LeaveRequestValidator from 'App/Validators/LeaveRequestValidator'
import Application from '@ioc:Adonis/Core/Application'
import { randomUUID } from 'crypto'

export default class LeaveController {
  private leaveService: LeaveService

  constructor() {
    this.leaveService = new LeaveService()
  }

  /**
   * EMPLOYEE: Get personal leave history
   */
  public async index({ auth, response }: HttpContextContract) {
    const history = await this.leaveService.getEmployeeHistory(auth.user!.id)
    return response.ok({
      status: 'success',
      message: history.length > 0 ? 'Data retrieved' : 'No history found',
      data: history
    })
  }

  /**
   * EMPLOYEE: Submit new leave request
   */
  public async store({ auth, request, response }: HttpContextContract) {
    // 1. Jalankan validator (otomatis cek startDate, endDate, reason, & attachment)
    const payload = await request.validate(LeaveRequestValidator)

    let fileName: string | null = null

    // 2. Proses file jika ada (payload.attachment sudah tervalidasi oleh validator)
    if (payload.attachment) {
      fileName = `${randomUUID()}.${payload.attachment.extname}`

      // Ganti tmpPath ke publicPath
      await payload.attachment.move(Application.publicPath('uploads'), {
        name: fileName
      })
    }

    try {
      // 3. Gabungkan data text dengan nama file yang sudah dipindah
      const dataToSave = {
        ...payload,
        attachment: fileName
      }

      const leave = await this.leaveService.create(auth.user!.id, dataToSave)

      return response.created({
        status: 'success',
        data: leave
      })
    } catch (error: any) {
      // Cek jika error berasal dari database (kolom null)
      let customMessage = error.message

      if (error.code === 'ER_BAD_NULL_ERROR') {
        customMessage = 'Attachment or other fields cannot be empty'
      }

      return response.badRequest({
        status: 'error',
        message: customMessage // Hanya kirim pesan pendek, bukan query SQL
      })
    }
  }

  /**
   * ADMIN: Get all leave requests from all employees
   */
  public async adminIndex({ auth, response }: HttpContextContract) {
    if (auth.user!.role !== 'admin') {
      return response.forbidden({ status: 'error', message: 'Access denied' })
    }

    const requests = await this.leaveService.getAllRequests()
    return response.ok({ status: 'success', data: requests })
  }

  /**
   * ADMIN: Approve or Reject a request
   */
  public async updateStatus({ auth, params, request, response }: HttpContextContract) {
    if (auth.user!.role !== 'admin') {
      return response.forbidden({ status: 'error', message: 'Access denied' })
    }

    try {
      const result = await this.leaveService.updateStatus(
        params.id,
        auth.user!.id,
        request.only(['status', 'rejectReason'])
      )
      return response.ok({ status: 'success', data: result })
    } catch (error) {
      const message = error instanceof Error ? error.message : 'An unknown error occurred'
      return response.badRequest({ status: 'error', message })
    }
  }
}