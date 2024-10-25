import express from 'express'
import AuthController from '../controller/auth_controller'
const authController = new AuthController()
const router = express.Router()

router.post('/login', authController.login)
router.post('/register', authController.register)
router.post('/refresh-token', authController.refreshToken)
router.post('/forgot-password', authController.forgotPassword)
export default router
