import Schema from '@ioc:Adonis/Lucid/Schema'

export default class ApiTokens extends Schema {
  protected tableName = 'api_tokens'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()

      table
        .integer('user_id')
        .unsigned()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')

      table.string('name').notNullable()
      table.string('type').notNullable()
      table.string('token', 64).notNullable().unique()

      table.timestamp('expires_at', { useTz: true }).nullable()

      /**
       * Ganti baris created_at jadi seperti di bawah ini.
       * Kita pakai .defaultTo(this.now()) supaya MySQL otomatis ngisi waktu sekarang.
       */
      table.timestamp('created_at', { useTz: true })
        .notNullable()
        .defaultTo(this.now())
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}