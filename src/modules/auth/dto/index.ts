type UserLogin = {
  email: string | undefined
  phone: string | undefined
  password: string
}
type UserRegister = UserLogin & {
  username: string
}

export { UserLogin, UserRegister }
