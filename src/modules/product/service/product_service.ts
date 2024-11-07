import { ProductModel } from '../model'
import ProductRepository from '../repository/product_repository'

class ProductService {
  private product_repository: ProductRepository
  constructor() {
    this.product_repository = new ProductRepository()
  }
  async getProductById(productId: number): Promise<ProductModel | null> {
    const result = await this.product_repository.findProductById(productId)
    if (result) {
      return result
    }
    return null
  }
  async getProductsByCategoryId(categoryId: number): Promise<Partial<ProductModel>[]> {
    return await this.product_repository.getProductsByCategoryId(categoryId)
  }
}
export default ProductService
