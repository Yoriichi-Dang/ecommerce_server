import CategoryService from '../service/category_service'
import { Request, Response } from 'express'
class CategoryController {
  private category_service: CategoryService
  constructor() {
    this.category_service = new CategoryService()
  }
  getCategoriesByLevel = async (req: Request, res: Response): Promise<void> => {
    try {
      const levelQuery = req.query.level
      if (typeof levelQuery === 'string') {
        const level: number = parseInt(levelQuery)
        const result = await this.category_service.getCategoriesByLevel(level)
        res.status(200).json(result)
      } else {
        res.status(400).json({ message: 'Invalid level query parameter' })
      }
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ message: error.message })
      } else {
        res.status(500).json({ message: 'An unknown error occurred' })
      }
    }
  }
  getSubCategoryById = async (req: Request, res: Response): Promise<void> => {
    try {
      const categoryId: number = parseInt(req.params.categoryId)
      const result = await this.category_service.getSubCategoryById(categoryId)
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
