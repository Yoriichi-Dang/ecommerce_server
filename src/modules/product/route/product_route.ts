import express from 'express'
import ProductController from '../controller/product_controller'

const productController = new ProductController()
const router = express.Router()
router.get('/:productId', productController.getProductDetail)
router.get('/', productController.getProductsByCategoryId)

export default router
