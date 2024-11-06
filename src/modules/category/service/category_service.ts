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
      title: category.title,
      thumbnail_url: category.thumbnail_url
    }))
  }
  async updateCategory(categoryId: number, payload: Omit<CategoryDto, 'id'>): Promise<CategoryDto> {
    const categoryModel: Omit<CategoryModel, 'id'> = {
      title: payload.title,
      thumbnail_url: payload.thumbnail_url,
      url_key: payload.url_key,
      level: payload.level
    }
    const isSucess = await this.category_repository.updateCategory(categoryId, categoryModel)
    if (!isSucess) {
      throw new Error('Update category failed')
    }
    const category: CategoryModel = await this.category_repository.getCategoryById(categoryId)
    return {
      id: category.id,
      title: category.title,
      thumbnail_url: category.thumbnail_url
    }
  }
}

export default CategoryService
