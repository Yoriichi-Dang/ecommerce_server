import AuthService from '../service/auth_service'

class AuthController {
  private auth_service: AuthService
  constructor() {
    this.auth_service = new AuthService()
  }
  login = async (req: any, res: any): Promise<void> => {
    const { email, password, phone } = req.body
    try {
      const result = await this.auth_service.login(email, phone, password)
      res.status(200).send(result)
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).send({ message: error.message })
      } else {
        res.status(400).send({ message: 'An unknown error occurred' })
      }
    }
  }
  register = async (req: any, res: any): Promise<void> => {
    const { email, password, phone } = req.body
    try {
      await this.auth_service.createAccount({ email, password, phone })
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
