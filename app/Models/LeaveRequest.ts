import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, BelongsTo } from '@ioc:Adonis/Lucid/Orm'
import User from 'App/Models/User'

export default class LeaveRequest extends BaseModel {
  @column({ isPrimary: true })
  public id!: number

  @column()
  public userId!: number

  @column.date()
  public startDate!: DateTime

  @column.date()
  public endDate!: DateTime

  @column()
  public reason!: string

  @column()
  public attachment!: string // Menyimpan path/nama file

  @column()
  public status!: 'pending' | 'approved' | 'rejected'

  // Admin yang melakukan eksekusi (Bisa null kalau belum diproses)
  @column()
  public actionBy!: number | null

  @column()
  public rejectReason!: string | null

  @column.dateTime({ autoCreate: true })
  public createdAt!: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt!: DateTime

  /**
   * RELASI
   */

  // Relasi ke User yang mengajukan cuti (Employee)
  @belongsTo(() => User, {
    foreignKey: 'userId',
  })
  public user!: BelongsTo<typeof User>

  // Relasi ke Admin yang memproses (Opsional)
  @belongsTo(() => User, {
    foreignKey: 'actionBy',
  })
  public admin!: BelongsTo<typeof User>
}