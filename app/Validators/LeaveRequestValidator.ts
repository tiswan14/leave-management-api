import { schema, CustomMessages, rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class LeaveRequestValidator {
  constructor(protected ctx: HttpContextContract) { }

  public schema = schema.create({
    startDate: schema.date({ format: 'yyyy-MM-dd' }, [
      rules.after('today'), // Tidak boleh ambil cuti untuk hari kemarin
    ]),
    endDate: schema.date({ format: 'yyyy-MM-dd' }, [
      rules.afterField('startDate'), // Tanggal selesai harus setelah tanggal mulai
    ]),
    reason: schema.string({ trim: true }, [
      rules.minLength(10), // Biar alasannya jelas
    ]),
    attachment: schema.file.optional({
      size: '2mb',
      extnames: ['jpg', 'png', 'pdf'],
    }),
  })

  public messages: CustomMessages = {
    'startDate.required': 'Start date is required',
    'startDate.after': 'Start date must be from tomorrow onwards',
    'endDate.afterField': 'End date must be after start date',
    'reason.minLength': 'Reason must be at least 10 characters long',
    'attachment.size': 'File size must be under 2MB',
    'attachment.extnames': 'Only JPG, PNG, and PDF are allowed',
  }
}