import { Request, Response } from 'express'
import ProductService from '../service/product_service'

class ProductController {
  private product_service: ProductService
  constructor() {
    this.product_service = new ProductService()
  }
  getProductDetail = async (req: Request, res: Response): Promise<void> => {
    try {
      const productId = req.params['productId'] as string
      const result = await this.product_service.getProductById(parseInt(productId))
      res.status(200).json(result)
    } catch (err) {
      res.status(500).json(err)
    }
  }
  getProductsByCategoryId = async (req: Request, res: Response): Promise<void> => {
    try {
      const categoryId = req.query['categoryId'] as string
      const result = await this.product_service.getProductsByCategoryId(parseInt(categoryId))
      res.status(200).json(result)
    } catch (err) {
      res.status(500).json(err)
    }
  }
}
export default ProductController
