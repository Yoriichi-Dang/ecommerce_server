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
        url_key: row.url_key
      })) as ListCategoryModel
    } finally {
      client.release()
    }
  }
}
export default CategoryRepository
