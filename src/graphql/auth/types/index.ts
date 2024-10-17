type UserLogin = {
  email: string
  password: string
}

type UserRegister = UserLogin & {
  phone: string
}

type User = UserRegister & {
  id: string
  username: string
  full_name: string
  avatar_url: string
  address: string
  district: string
  province: string
  gender: string
  day_of_birth: Date
}
type Token = {
  access_token: string
  refresh_token?: string
}
export { UserLogin, UserRegister, User, Token }
