import AuthRepository from '../repository/auth_repository'
import UserModel from '../model/user_model'
import { UserLogin, UserRegister } from '../dto'
import { hashPassword, verifyPassword } from '@/utils/auth/password'

class AuthService {
  private auth_repository: AuthRepository
  constructor() {
    this.auth_repository = new AuthRepository()
  }
  async login(user_login: UserLogin): Promise<UserModel | null> {
    const user = await this.findUser(user_login.email, user_login.phone)
    if (!user) {
      throw new Error('User not found')
    }
    if (!(await verifyPassword(user_login.password, user.password_hash))) {
      return null
    }
    return user
  }
  async createAccount(user_register: UserRegister): Promise<string | undefined> {
    if (await this.checkUserExists(user_register.email, user_register.phone)) {
      throw new Error('Email or phone number already exists')
    }
    const password_hash = await hashPassword(user_register.password)
    if (!user_register.email || !user_register.phone) {
      throw new Error('Email and phone are required')
    }
    const user_model: UserModel = {
      email: user_register.email,
      password_hash: password_hash,
      phone: user_register.phone,
      username: user_register.username
    }
    return await this.auth_repository.createAccount(user_model)
  }
  async findUser(email: string | undefined, phone: string | undefined): Promise<UserModel | undefined> {
    if (email) {
      return await this.auth_repository.findUserByEmail(email)
    }
    if (phone) {
      return await this.auth_repository.findUserByPhone(phone)
    }
    return undefined
  }
  async checkUserExists(email: string | undefined, phone: string | undefined): Promise<boolean> {
    return await this.auth_repository.checkUserExists(email, phone)
  }
  async resetPassword(email: string, password: string): Promise<boolean> {
    const password_hash = await hashPassword(password)
    return await this.auth_repository.updateUserPassword(email, password_hash)
  }
}
export default AuthService
