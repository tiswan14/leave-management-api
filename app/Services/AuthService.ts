import User from 'App/Models/User'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class AuthService {
  // Proses registrasi konvensional
  public async register(data: any) {
    return await User.create(data)
  }

  // Proses login konvensional
  public async login({ auth }: HttpContextContract, payload: any) {
    const { email, password } = payload
    return await auth.use('api').attempt(email, password)
  }

  // Proses logout
  public async logout({ auth }: HttpContextContract) {
    await auth.use('api').revoke()
  }

  // Logika OAuth: Cari atau buat user baru
  public async findOrCreateUser(googleUser: any) {
    const user = await User.firstOrCreate(
      { email: googleUser.email },
      {
        name: googleUser.name,
        oauthProvider: 'google',
        oauthId: googleUser.id,
        role: 'employee',
        leaveQuota: 12,
      }
    )

    // Sync data jika user lama login via OAuth untuk pertama kali
    if (!user.oauthId) {
      user.oauthId = googleUser.id
      user.oauthProvider = 'google'
      await user.save()
    }

    return user
  }
}