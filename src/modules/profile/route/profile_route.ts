import express from 'express'
import ProfileController from '../controller/profile_controller'
import AuthMiddleware from '@/middlewares/auth_middleware'
const authMiddleware = new AuthMiddleware()
const profileController = new ProfileController()
const router = express.Router()
router.get('/', authMiddleware.verifyToken, profileController.getProfile)
router.put('/', authMiddleware.verifyToken, profileController.updateProfile)
router.patch('/change-password', authMiddleware.verifyToken, profileController.updatePassword)
router.patch('/change-avatar', authMiddleware.verifyToken, profileController.updateAvatar)
export default router
