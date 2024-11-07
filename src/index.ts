import express, { Application } from 'express'
import bodyParser from 'body-parser'
import authRoute from './modules/auth/route/auth_route'
import profileRoute from './modules/profile/route/profile_route'
import categoryRoute from './modules/category/route/category_route'
import productRoute from './modules/product/route/product_route'
async function startServer(): Promise<void> {
  const app: Application = express()

  const PORT = 3000
  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({ extended: true }))
  app.route('/').get((req, res) => {
    res.send('Hello, world!')
  })
  app.use('/', authRoute)
  app.use('/profile', profileRoute)
  app.use('/categories', categoryRoute)
  app.use('/products', productRoute)
  app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`🚀 Server ready at http://localhost:${PORT}`)
  })
}

startServer().catch((err) => {
  // eslint-disable-next-line no-console
  console.error('Failed to start server:', err)
})
