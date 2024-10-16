import { expressMiddleware } from '@apollo/server/express4'
import express, { Application } from 'express'
import { readFileSync } from 'fs'
import { resolvers } from './graphql/auth/resolvers'
import cors from 'cors'
import bodyParser from 'body-parser'
import { ApolloServer } from '@apollo/server'
import path from 'path'

async function startServer() {
  const app: Application = express()
  const typeDefs = readFileSync(path.join(__dirname, 'graphql/auth/typedefs/index.graphql'), 'utf8')

  const server = new ApolloServer({
    typeDefs,
    resolvers
  })

  await server.start()

  // Middleware
  app.use('/graphql', cors(), bodyParser.json(), expressMiddleware(server))

  const PORT = 3000
  app.listen(PORT, () => {
    console.log(`🚀 Server ready at http://localhost:${PORT}/graphql`)
  })
}

startServer().catch((err) => {
  console.error('Failed to start server:', err)
})
