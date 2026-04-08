import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class AdminOnly {
  public async handle({ auth, response }: HttpContextContract, next: () => Promise<void>) {
    // Cek apakah user yang login punya role 'admin'
    if (auth.user?.role !== 'admin') {
      return response.forbidden({
        status: 'error',
        message: 'Access denied: Admin privileges required'
      })
    }

    await next()
  }
}