import { ListCategoryModel } from '../model/category_model'
import CategoryRepository from '../repository/category_repository'

class CategoryService {
  private category_repository: CategoryRepository
  constructor() {
    this.category_repository = new CategoryRepository()
  }
  async getCategoriesByLevel(level: number): Promise<ListCategoryModel> {
    return this.category_repository.getCategoriesByLevel(level)
  }
}

export default CategoryService
