import dbConnection from '@/config/db'
import { Pool } from 'pg'
import UserModel from '../model/user_model'

class ProfileRepository {
  private db: Pool
  constructor() {
    this.db = dbConnection.getPool()
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
  async updateUserPassword(email: string, password_hash: string): Promise<boolean> {
    const query: string = `
      UPDATE users_login SET password_hash = $1
      WHERE email = $2
    `
    const values: string[] = [password_hash, email]
    try {
      await this.db.query(query, values)
      return true
    } catch (error) {
      console.error('Error updating user password:', error)
      return false
    }
  }
  async updateAvatarByEmail(email: string, avatar_url: string): Promise<boolean> {
    try {
      const query: string = `
    UPDATE users_data SET avatar_url = $1
    FROM users_login
    WHERE users_login.id = users_data.id
    AND users_login.email = $2
  `
      const values: string[] = [avatar_url, email]
      await this.db.query(query, values)
      return true
    } catch (error) {
      console.error('Error updating avatar:', error)
      return false
    }
  }
  async updateUserByEmail(email: string, payload: any): Promise<UserModel | undefined> {
    try {
      const oldUser = await this.findUserByEmail(email)
      if (!oldUser) {
        return undefined
      }
      let query: string
      if (payload.email) {
        if (await this.findUserByEmail(payload.email)) {
          throw new Error('Email already exists')
        }
        query = `
          UPDATE users_login SET email = $1
          WHERE email = $2
          `
        const values = [payload.email, email]
        await this.db.query(query, values)
      }
      if (payload.phone) {
        if (await this.findUserByPhone(payload.phone)) {
          throw new Error('Phone already exists')
        }
        query = `
          UPDATE users_login SET phone = $1
          WHERE email = $2
          `
        const values = [payload.phone || oldUser.phone, email]
        await this.db.query(query, values)
      }
      query = `
        UPDATE users_data SET
        username = $1,
        full_name = $2,
        address = $3,
        district = $4,
        province= $5,
        gender = $6,
        day_of_birth = $7
        FROM users_login
        WHERE users_login.id = users_data.id
        AND users_login.email = $8
        `
      const values = [
        payload.username || oldUser.username,
        payload.full_name || oldUser.full_name,
        payload.address || oldUser.address,
        payload.district || oldUser.district,
        payload.province || oldUser.province,
        payload.gender || oldUser.gender,
        payload.day_of_birth || oldUser.day_of_birth,
        email
      ]
      await this.db.query(query, values)
      return await this.findUserByEmail(payload.email || email)
    } catch (error) {
      console.error('Error updating user:', error)
      return undefined
    }
  }
}
export default ProfileRepository
