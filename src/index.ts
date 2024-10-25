import express, { Application } from 'express'
import bodyParser from 'body-parser'
import authRoute from './modules/auth/route/auth_route'
import profileRoute from './modules/profile/route/profile_route'
async function startServer() {
  const app: Application = express()

  const PORT = 3000
  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({ extended: true }))
  app.route('/').get((req, res) => {
    res.send('Hello, world!')
  })
  app.use('/', authRoute)
  app.use('/profile', profileRoute)
  app.listen(PORT, () => {
    console.log(`🚀 Server ready at http://localhost:${PORT}`)
  })
}

startServer().catch((err) => {
  console.error('Failed to start server:', err)
})
