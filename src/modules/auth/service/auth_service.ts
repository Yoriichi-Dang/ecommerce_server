import { verifyPassword } from '~/utils/auth/password'
import AuthRepository from '../repository/auth_repository'

class AuthService {
  private auth_repository: AuthRepository
  constructor() {
    this.auth_repository = new AuthRepository()
  }
  async login(email: string | undefined, phone: string | undefined, password: string): Promise<string> {
    const user = await this.findUser(email, phone)
    if (!user) {
      throw new Error('User not found')
    }
    if (!verifyPassword(password, user.password_hash)) {
      throw new Error('Password is incorrect')
    }
    return 'Login successful'
  }
  async createAccount(user_model: any): Promise<string> {
    if (await this.checkUserExists(user_model.email, user_model.phone)) {
      throw new Error('Email or phone number already exists')
    }
    return await this.auth_repository.createAccount(user_model)
  }
  async findUser(email: string | undefined, phone: string | undefined): Promise<any> {
    if (email) {
      return await this.auth_repository.findUserByEmail(email)
    }
    if (phone) {
      return await this.auth_repository.findUserByPhone(phone)
    }
  }
  async checkUserExists(email: string | undefined, phone: string | undefined) {
    return await this.auth_repository.checkUserExists(email, phone)
  }
}
export default AuthService
