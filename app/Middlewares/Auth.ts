import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class AuthMiddleware {
  protected redirectTo = '/login'

  public async handle(
    { auth, response }: HttpContextContract,
    next: () => Promise<void>,
    guards: any[],
  ) {
    try {
      const guard = guards.length ? guards[0] : 'api'

      await auth.use(guard).authenticate()

      await next()
    } catch (error: any) {
      console.log('AUTH ERROR:', {
        code: error.code,
        message: error.message,
      })

      // ⛔ SKIP kalau validation error
      if (error.code === 'E_VALIDATION_FAILURE') {
        throw error
      }

      let message = 'Unauthorized'

      if (error.code === 'E_TOKEN_EXPIRED') {
        message = 'Token has expired'
      } else if (error.code === 'E_INVALID_API_TOKEN') {
        message = 'Invalid token'
      } else {
        message = 'Invalid or missing token'
      }

      return response.unauthorized({
        status: 'error',
        message,
      })
    }
  }
}