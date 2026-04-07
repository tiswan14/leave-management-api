import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'leave_requests'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()

      // Relasi ke pemohon (Employee)
      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE')

      table.date('start_date').notNullable()
      table.date('end_date').notNullable()
      table.text('reason').notNullable()
      table.string('attachment').notNullable()

      // Status Workflow
      table.enum('status', ['pending', 'approved', 'rejected']).defaultTo('pending').notNullable()

      // Audit trail: siapa yang approve/reject
      // Saran: Pakai SET NULL biar history cuti ga ilang kalau admin dihapus
      table.integer('action_by').unsigned().references('id').inTable('users').onDelete('SET NULL').nullable()

      table.text('reject_reason').nullable()

      table.timestamp('created_at', { useTz: true }).notNullable().defaultTo(this.now())
      table.timestamp('updated_at', { useTz: true }).notNullable().defaultTo(this.now())
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}