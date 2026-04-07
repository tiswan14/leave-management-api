import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import User from 'App/Models/User'

export default class extends BaseSeeder {
  public async run() {
    // updateOrCreateMany: Mencegah duplikat data berdasarkan 'email'
    await User.updateOrCreateMany('email', [
      {
        name: 'Super Admin',
        email: 'admin@cuti.com',
        password: 'password123',
        role: 'admin',
        leaveQuota: 12,
      },
      {
        name: 'Tiswan',
        email: 'tiswan@example.com',
        password: 'password123',
        role: 'employee',
        leaveQuota: 12,
      },
    ])
  }
}