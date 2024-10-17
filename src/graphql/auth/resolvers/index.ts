import { Token, UserLogin, UserRegister } from '../types'

export const resolvers = {
  Query: {
    login: (_: any, { input }: { input: UserLogin }): Token => {
      console.log(input)
      const token: Token = { access_token: 'dummy_token' }
      return token // Replace with actual token generation logic
    }
  },
  Mutation: {
    register: (_: any, { input }: { input: UserRegister }): Token => {
      console.log(input)
      return { access_token: 'dummy_token' }
    }
  }
}
