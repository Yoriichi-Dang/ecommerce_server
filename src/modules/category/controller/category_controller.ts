import CategoryService from '../service/category_service'
import { Request, Response } from 'express'
class CategoryController {
  private category_service: CategoryService
  constructor() {
    this.category_service = new CategoryService()
  }
  getCategoriesByLevel = async (req: Request, res: Response): Promise<void> => {
    try {
      const level: number = parseInt(req.params.level)
      const result = await this.category_service.getCategoriesByLevel(level)
      res.status(200).json(result)
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ message: error.message })
      } else {
        res.status(500).json({ message: 'An unknown error occurred' })
      }
    }
  }
}
export default CategoryController
