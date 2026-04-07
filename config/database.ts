import Env from '@ioc:Adonis/Core/Env'
import Application from '@ioc:Adonis/Core/Application'
import type { DatabaseConfig } from '@ioc:Adonis/Lucid/Database'

const databaseConfig: DatabaseConfig = {
  // Ambil dari .env (pastikan isinya mysql)
  connection: Env.get('DB_CONNECTION'),

  connections: {
    /* | Konfigurasi MySQL Baru
    */
    mysql: {
      client: 'mysql2',
      connection: {
        host: Env.get('MYSQL_HOST', '127.0.0.1'),
        port: Env.get('MYSQL_PORT', 3306),
        user: Env.get('MYSQL_USER', 'root'),
        password: Env.get('MYSQL_PASSWORD', ''),
        database: Env.get('MYSQL_DB_NAME', 'leave_api_db'),
      },
      migrations: {
        naturalSort: true,
      },
      healthCheck: true,
      debug: Env.get('NODE_ENV') === 'development',
    },

    /*
    | SQLite (Biarin aja kalau mau buat cadangan)
    */
    sqlite: {
      client: 'sqlite',
      connection: {
        filename: Application.tmpPath('db.sqlite3'),
      },
      pool: {
        afterCreate: (conn, cb) => {
          conn.run('PRAGMA foreign_keys=true', cb)
        },
      },
      migrations: {
        naturalSort: true,
      },
      useNullAsDefault: true,
      healthCheck: false,
      debug: false,
    },
  },
}

export default databaseConfig