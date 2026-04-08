import User from 'App/Models/User'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class AuthService {
  // Proses registrasi konvensional
  public async register(data: any) {
    // 1. Check if email already exists
    const existingUser = await User.findBy('email', data.email)

    if (existingUser) {
      throw new Error('Email already registered. Please use another email or login.')
    }

    // 2. If not exists, create the user
    return await User.create(data)
  }

  // Proses login konvensional
  public async login({ auth }: HttpContextContract, payload: any) {
    const { email, password } = payload
    return await auth.use('api').attempt(email, password)
  }

  // Proses logout
  public async logout(auth: any) {
    // Revoke token yang sedang aktif
    return await auth.use('api').revoke()
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

  public async me(user: User) {
    if (!user) {
      throw new Error('Unauthorized')
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      leaveQuota: user.leaveQuota,
      createdAt: user.createdAt,
    }
  }
}