import CategoryController from '../controller/category_controller'
import express from 'express'

const categoryController = new CategoryController()
const router = express.Router()
router.get('/', categoryController.getCategoriesByLevel)
router.get('/:categoryId', categoryController.getSubCategoryById)

export default router
