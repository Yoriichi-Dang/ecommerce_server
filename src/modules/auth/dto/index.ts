type UserLogin = {
  email: string
  password: string
}
type UserRegister = UserLogin & {
  phone: string
  username: string
}

export { UserLogin, UserRegister }
