import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

type Store = {
  [key: string]: {
    count: number
    resetTime: number
  }
}

const store: Store = {}

export default class RateLimiter {
  public async handle(
    { request, response }: HttpContextContract,
    next: () => Promise<void>,
    [max = 5, duration = 60]: [number?, number?],
  ) {
    const key = request.ip()
    const now = Date.now()

    if (!store[key] || now > store[key].resetTime) {
      store[key] = {
        count: 1,
        resetTime: now + duration * 1000,
      }
    } else {
      store[key].count++
    }

    if (store[key].count > max) {
      return response.status(429).send({
        status: 'error',
        message: 'Too many requests',
      })
    }

    await next()
  }
}