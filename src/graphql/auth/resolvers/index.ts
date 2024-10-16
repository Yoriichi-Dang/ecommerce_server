// src/resolvers/index.ts
let users = [
  { id: '1', username: 'user1', email: 'user1@example.com' },
  { id: '2', username: 'user2', email: 'user2@example.com' }
]

export const resolvers = {
  Query: {
    hello: () => 'Hello nguyen!',
    user: (_: any, args: { id: string }) => users.find((user) => user.id === args.id),
    users: () => users
  },
  Mutation: {
    createUser: (_: any, args: { username: string; email: string }) => {
      const newUser = { id: String(users.length + 1), ...args }
      users.push(newUser)
      return newUser
    }
  }
}
