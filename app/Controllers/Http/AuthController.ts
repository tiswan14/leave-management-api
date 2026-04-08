import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import AuthService from 'App/Services/AuthService'
import { registerSchema, loginSchema } from 'App/Validators/AuthValidator'

export default class AuthController {
  protected authService = new AuthService()

  public async register({ request, response }: HttpContextContract) {
    try {
      const payload = await request.validate({ schema: registerSchema })

      const user = await this.authService.register(payload)

      return response.status(201).send({
        status: 'success',
        message: 'User registered successfully',
        data: user,
      })
    } catch (error: any) {
      // HANDLE VALIDATION
      if (error.code === 'E_VALIDATION_FAILURE') {
        return response.status(400).send({
          status: 'error',
          message: 'Validation failed',
          errors: error.messages,
        })
      }

      // HANDLE OTHER ERROR
      return response.status(400).send({
        status: 'error',
        message: error.message || 'Registration failed',
      })
    }
  }

  public async login(ctx: HttpContextContract) {
    const { request, response } = ctx
    const payload = await request.validate({ schema: loginSchema })

    try {
      const token = await this.authService.login(ctx, payload)
      return response.status(200).send({
        status: 'success',
        message: 'Login successfully',
        data: token.toJSON(), // Token dan data user biasanya ada di sini
      })
    } catch {
      return response.status(401).send({
        status: 'error',
        message: 'Invalid email or password',
      })
    }
  }

  // app/Controllers/Http/AuthController.ts
  public async logout({ auth, response }: HttpContextContract) {
    try {
      await this.authService.logout(auth)

      return response.ok({
        status: 'success',
        message: 'Logged out successfully'
      })
    } catch (error: any) {
      return response.unauthorized({
        status: 'error',
        message: 'Invalid or missing token'
      })
    }
  }

  public async me({ auth, response }: HttpContextContract) {
    const data = await this.authService.me(auth.user!)

    return response.ok({
      status: 'success',
      data,
    })
  }
}