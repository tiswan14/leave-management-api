import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import AuthService from 'App/Services/AuthService'
import { registerSchema, loginSchema } from 'App/Validators/AuthValidator'

export default class AuthController {
  protected authService = new AuthService()

  public async register({ request, response }: HttpContextContract) {
    const payload = await request.validate({ schema: registerSchema })
    const user = await this.authService.register(payload)

    return response.status(201).send({
      status: 'success',
      message: 'User registered successfully',
      data: user
    })
  }

  public async login(ctx: HttpContextContract) {
    const { request, response } = ctx
    const payload = await request.validate({ schema: loginSchema })

    try {
      const token = await this.authService.login(ctx, payload)
      return response.status(200).send({
        status: 'success',
        message: 'Login successful',
        data: token.toJSON(), // Token dan data user biasanya ada di sini
      })
    } catch {
      return response.status(401).send({
        status: 'error',
        message: 'Invalid credentials'
      })
    }
  }

  public async logout(ctx: HttpContextContract) {
    await this.authService.logout(ctx)
    return ctx.response.status(200).send({
      status: 'success',
      message: 'Logged out successfully'
    })
  }
}