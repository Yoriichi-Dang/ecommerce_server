import type CategoryDto from '../dto/category_dto'
import { CategoryModel, ListCategoryModel } from '../model/category_model'
import CategoryRepository from '../repository/category_repository'

class CategoryService {
  private category_repository: CategoryRepository
  constructor() {
    this.category_repository = new CategoryRepository()
  }
  async getCategoriesByLevel(level: number): Promise<ListCategoryModel> {
    return await this.category_repository.getCategoriesByLevel(level)
  }
  async getSubCategoryById(categoryId: number): Promise<CategoryDto[]> {
    const subCategories: ListCategoryModel = await this.category_repository.getSubCategoryById(categoryId)
    return subCategories.map((category: CategoryModel) => ({
      id: category.id,
      title: category.title
    }))
  }
}

export default CategoryService
