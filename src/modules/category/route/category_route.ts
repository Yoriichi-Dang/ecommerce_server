import CategoryController from '../controller/category_controller'
import express from 'express'

const categoryController = new CategoryController()
const router = express.Router()
router.get('/:level', categoryController.getCategoriesByLevel)
export default router
