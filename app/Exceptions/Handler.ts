import Logger from '@ioc:Adonis/Core/Logger'
import HttpExceptionHandler from '@ioc:Adonis/Core/HttpExceptionHandler'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class ExceptionHandler extends HttpExceptionHandler {
  constructor() {
    super(Logger)
  }

  public async handle(error: any, ctx: HttpContextContract) {
    if (error.code === 'E_VALIDATION_FAILURE') {
      return ctx.response.status(422).send({
        status: 'error',
        message: 'Validation failed',
        errors: error.messages,
      })
    }

    if (error.code === 'E_INVALID_AUTH_PASSWORD' || error.code === 'E_INVALID_AUTH_UID') {
      return ctx.response.status(401).send({
        status: 'error',
        message: 'Invalid credentials',
      })
    }

    if (error.status === 404) {
      return ctx.response.status(404).send({
        status: 'error',
        message: 'Resource not found',
      })
    }

    return ctx.response.status(error.status || 500).send({
      status: 'error',
      message: 'Internal server error',
      error: error.message
    })
  }
}