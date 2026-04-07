import { DateTime } from 'luxon'
import { BaseModel, column, beforeSave, hasMany, HasMany } from '@ioc:Adonis/Lucid/Orm'
import Hash from '@ioc:Adonis/Core/Hash'
import LeaveRequest from 'App/Models/LeaveRequest'

export default class User extends BaseModel {
  @column({ isPrimary: true })
  public id!: number

  @column()
  public name!: string

  @column()
  public email!: string

  @column({ serializeAs: null })
  public password?: string

  @column()
  public role!: 'admin' | 'employee'

  @column({ columnName: 'leave_quota' })
  public leaveQuota!: number

  @column.dateTime({ autoCreate: true })
  public createdAt!: DateTime

  @column()
  public oauthProvider!: string | null

  @column()
  public oauthId!: string | null

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt!: DateTime

  @hasMany(() => LeaveRequest)
  public leaveRequests!: HasMany<typeof LeaveRequest>

  @beforeSave()
  public static async hashPassword(user: User) {
    if (user.$dirty.password && user.password) {
      user.password = await Hash.make(user.password)
    }
  }
}