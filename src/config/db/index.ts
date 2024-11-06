import dotenv from 'dotenv'
import { Pool } from 'pg'

dotenv.config()

class PostgreSQLConnect {
  private pool: Pool

  constructor() {
    this.pool = new Pool({
      user: process.env.DB_USER,
      host: process.env.DB_HOST,
      database: process.env.DB_NAME,
      password: process.env.DB_PASSWORD,
      port: parseInt(process.env.DB_PORT as string, 10),
      max: parseInt(process.env.DB_MAX_POOL_SIZE as string, 10) // Số kết nối tối đa trong pool
    })
    this.connect()
  }
  public getPool(): Pool {
    return this.pool
  }
  private connect(): void {
    this.pool.connect((err: Error | undefined, client, done) => {
      if (err) {
        return
      }
      done()
      return
    })
  }

  public async disconnect(): Promise<void> {
    await this.pool.end()
  }
}

const dbConnection = new PostgreSQLConnect()

export default dbConnection
