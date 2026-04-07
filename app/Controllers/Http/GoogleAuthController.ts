import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import AuthService from 'App/Services/AuthService'

export default class GoogleAuthController {
  protected authService = new AuthService()

  public async redirect({ ally }: HttpContextContract) {
    return ally.use('google').redirect()
  }

  public async callback(ctx: HttpContextContract) {
    const { ally, auth, response } = ctx
    const google = ally.use('google')

    if (google.hasError()) {
      return response.badRequest({ status: 'error', message: 'Google auth failed' })
    }

    const googleUser = await google.user()
    const user = await this.authService.findOrCreateUser(googleUser)

    const token = await auth.use('api').generate(user)

    return response.ok({
      status: 'success',
      message: 'Login successful',
      data: { token, user }
    })
  }
}