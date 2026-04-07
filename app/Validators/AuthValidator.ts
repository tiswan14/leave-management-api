import { schema, rules } from '@ioc:Adonis/Core/Validator'

export const registerSchema = schema.create({
  name: schema.string({}, [
    rules.minLength(3),
  ]),
  email: schema.string({}, [
    rules.email(),
  ]),
  password: schema.string({}, [
    rules.minLength(6),
  ]),
})

export const loginSchema = schema.create({
  email: schema.string({}, [
    rules.email(),
  ]),
  password: schema.string(),
})