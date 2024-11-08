import dbConnection from '@/config/db'
import { Pool } from 'pg'
import { CategoryModel, ListCategoryModel } from '../model/category_model'

class CategoryRepository {
  private db: Pool
  constructor() {
    this.db = dbConnection.getPool()
  }
  async getCategoriesByLevel(level: number): Promise<ListCategoryModel> {
    const client = await this.db.connect()
    try {
      const query: string = `
        select * from categories where level=$1
      `
      const result = await client.query(query, [level])
      return result.rows.map((row: CategoryModel) => ({
        id: row.id,
        title: row.title,
        url_key: row.url_key,
        thumbnail_url: row.thumbnail_url
      })) as ListCategoryModel
    } finally {
      client.release()
    }
  }
  async getLevelByCategoryId(categoryId: number): Promise<number> {
    const client = await this.db.connect()
    try {
      const query: string = `
        select categories.level from categories where categories.id=$1
      `
      const result = await client.query(query, [categoryId])
      if (result.rows.length === 0) {
        throw new Error('Category not found')
      }
      return result.rows[0].level
    } finally {
      client.release()
    }
  }
  async getCategoryById(categoryId: number): Promise<CategoryModel> {
    const client = await this.db.connect()
    try {
      const query: string = `
        select * from categories where id=$1
      `
      const result = await client.query(query, [categoryId])
      if (result.rows.length === 0) {
        throw new Error('Category not found')
      }
      return result.rows[0] as CategoryModel
    } finally {
      client.release()
    }
  }
  async getSubCategoryById(categoryId: number): Promise<ListCategoryModel> {
    const categoryLevel = await this.getLevelByCategoryId(categoryId)
    if (categoryLevel === undefined) {
      throw new Error('Category level not found')
    }
    if (categoryLevel > 3) {
      return []
    }

    const client = await this.db.connect()
    try {
      let query: string = `
      select distinct categories.* from categories 
      join categories_depend on categories.id=categories_depend.level_${categoryLevel + 1}_id
      where categories_depend.level_${categoryLevel}_id=$1
      `
      if (categoryLevel === 3) {
        query = `
          select distinct categories.* from categories 
          join categories_depend on categories.id=categories_depend.category_id
          where categories_depend.level_${categoryLevel}_id=$1
        `
      }
      const result = await client.query(query, [categoryId])
      return result.rows.map((row: CategoryModel) => ({
        id: row.id,
        title: row.title,
        url_key: row.url_key,
        thumbnail_url: row.thumbnail_url
      })) as ListCategoryModel
    } finally {
      client.release()
    }
  }
  async updateCategory(categoryId: number, category: Omit<CategoryModel, 'id'>): Promise<boolean> {
    const client = await this.db.connect()
    try {
      const query: string = `
        update categories set title=$1, thumbnail_url=$2, url_key=$3 where id=$4
      `
      const oldCategory = await this.getCategoryById(categoryId)
      const values: (string | number | undefined)[] = [
        category.title || oldCategory.title,
        category.thumbnail_url || oldCategory.thumbnail_url,
        category.url_key || oldCategory.url_key,
        categoryId
      ]
      await client.query(query, values)
      return true
    } catch {
      throw new Error('Failed to update category')
    } finally {
      client.release()
    }
  }
}
export default CategoryRepository
