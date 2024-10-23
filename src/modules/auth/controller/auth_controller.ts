import { createToken } from '~/utils/auth/jwt'
import { UserLogin, UserRegister } from '../dto'
import UserModel from '../model/user_model'
import AuthService from '../service/auth_service'

class AuthController {
  private auth_service: AuthService
  constructor() {
    this.auth_service = new AuthService()
  }
  login = async (req: any, res: any): Promise<void> => {
    const expire_access_token: string = `${process.env.EXPIRE_ACCESS_TOKEN}m`
    const expire_refresh_token: string = `${process.env.EXPIRE_REFRESH_TOKEN}d`
    const user_login: UserLogin = req.body
    try {
      const result = await this.auth_service.login(user_login)
      const data = {
        username: result.username,
        email: result.email
      }
      const access_token: string = createToken(data, expire_access_token)
      const refresh_token: string = createToken(data, expire_refresh_token)
      res.cookie('refresh_token', refresh_token, {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * Number(process.env.EXPIRE_REFRESH_TOKEN) // 60 ngày
      })

      res.cookie('access_token', access_token, {
        httpOnly: true,
        maxAge: 1000 * 60 * Number(process.env.EXPIRE_ACCESS_TOKEN) // 5 phút
      })
      res.status(202).send({
        access_token: access_token,
        refresh_token: refresh_token
      })
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).send({ message: error.message })
      } else {
        res.status(400).send({ message: 'An unknown error occurred' })
      }
    }
  }
  register = async (req: any, res: any): Promise<void> => {
    const user_register: UserRegister = req.body
    try {
      await this.auth_service.createAccount(user_register)
      res.status(200).send({ message: 'Account created successfully' })
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).send({ message: error.message })
      } else {
        res.status(400).send({ message: 'An unknown error occurred' })
      }
    }
  }
}

export default AuthController
