import { Pool } from 'pg'
import UserModel from '../model/user_model'
import dbConnection from '~/config/db'

class AuthRepository {
  private db: Pool
  constructor() {
    this.db = dbConnection.getPool()
  }
  async createAccount(user_model: UserModel): Promise<string> {
    const client = await this.db.connect()
    try {
      await client.query('BEGIN')

      let query: string = `
                INSERT INTO users_login (email, password_hash, phone)
                VALUES ($1, $2, $3)
                RETURNING id
        `
      const values: string[] = [user_model.email, user_model.password_hash, user_model.phone]
      const result = await client.query(query, values)
      user_model.id = result.rows[0].id

      query = `
                INSERT INTO users_data (id, username, full_name, address, district, province, gender, day_of_birth, avatar_url)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        `
      const data_values: any[] = [
        user_model.id,
        user_model.username,
        user_model.full_name,
        user_model.address,
        user_model.district,
        user_model.province,
        user_model.gender,
        user_model.day_of_birth,
        user_model.avatar_url
      ]
      await client.query(query, data_values)

      await client.query('COMMIT')
      return user_model.id
    } catch (error) {
      await client.query('ROLLBACK')
      throw error
    } finally {
      client.release()
    }
  }
  async checkUserExists(email: string | undefined, phone: string | undefined): Promise<boolean> {
    let query: string = `SELECT * FROM users_login WHERE`
    const values: string[] = []
    if (email) {
      query += ` email = $1`
      values.push(email)
    }
    if (phone) {
      if (email) query += ` OR`
      query += ` phone = $${values.length + 1}`
      values.push(phone)
    }
    if (values.length === 0) {
      throw new Error('At least one of email or phone must be provided')
    }
    const result = await this.db.query(query, values)
    return result.rows[0]
  }
  async findUserByPhone(phone: string): Promise<UserModel> {
    const query: string = `
        SELECT ul.*, ud.*
        FROM users_login ul
        JOIN users_data ud ON ul.id = ud.id
        WHERE ul.phone = $1
    `
    const values: string[] = [phone]
    const result = await this.db.query(query, values)
    return result.rows[0]
  }
  async findUserByEmail(email: string): Promise<UserModel> {
    const query: string = `
        SELECT ul.*, ud.*
        FROM users_login ul
        JOIN users_data ud ON ul.id = ud.id
        WHERE ul.email = $1
    `
    const values: string[] = [email]
    const result = await this.db.query(query, values)
    return result.rows[0]
  }
}

export default AuthRepository
