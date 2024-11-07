import dbConnection from '@/config/db'
import { Pool } from 'pg'
import { ProductAttr, ProductModel, ProductOption, ProductOptionsRecord, Seller } from '../model'

class ProductRepository {
  private db: Pool
  constructor() {
    this.db = dbConnection.getPool()
  }
  private async queryWithClient<T>(query: string, params: (string | number)[]): Promise<T[]> {
    const client = await this.db.connect()
    try {
      const result = await client.query(query, params)
      return result.rows as T[] // This assumes you expect multiple rows (array of T)
    } catch (error) {
      throw new Error(`Database query failed: ${error}`)
    } finally {
      client.release()
    }
  }

  async getProductImagesById(productId: number): Promise<string[] | null> {
    try {
      const query = `
      select product_images.image_url from product_images where product_images.id=$1
      `
      const result = await this.queryWithClient<Record<string, string>>(query, [productId])
      return result.map((item: Record<string, string>) => item.image_url)
    } catch {
      return null
    }
  }
  async getProductSoldById(productId: number): Promise<number> {
    try {
      const query = `
        SELECT COALESCE(COUNT(DISTINCT CASE
                                         WHEN s.status IN ('purchase', 'order') THEN od.id
                                         ELSE NULL
                                       END), 0) AS quantity_sell
        FROM product_infos AS pi
        LEFT JOIN order_details AS od ON pi.id = od.product_id
        LEFT JOIN shipments AS s ON od.id = s.order_detail_id
        WHERE pi.id = $1
        GROUP BY pi.id;
      `

      const result = await this.queryWithClient<{ quantity_sell: string }>(query, [productId])
      return parseInt(result[0]?.quantity_sell, 10) || 0
    } catch (error) {
      return 0
    }
  }

  async getProductSellersById(productId: number): Promise<Seller[] | null> {
    try {
      const query = `
      select sellers.* from sellers
      join product_seller as ps on sellers.id=ps.id
      where ps.product_id=$1
      `
      const result = await this.queryWithClient<Seller>(query, [productId])
      return result as Seller[]
    } catch {
      return null
    }
  }
  async getProductOptionsById(productId: number): Promise<ProductOptionsRecord | null> {
    let query = `
    select po.code,po.name,po.label from product_options as po
    where product_id=$1
    `
    try {
      const result = await this.queryWithClient<{ code: string; name: string; label: string }>(query, [productId])
      if (result.length == 0) return null
      const productOptions: ProductOptionsRecord = result.reduce((acc, item) => {
        if (!acc[item.code]) {
          acc[item.code] = []
        }
        const existingOption = acc[item.code].find((option: ProductOption) => option.name === item.name)

        if (existingOption) {
          existingOption.label.push(item.label)
        } else {
          acc[item.code].push({
            name: item.name,
            label: [item.label]
          })
        }
        return acc
      }, {} as ProductOptionsRecord)
      return productOptions
    } catch {
      return null
    }
  }
  async getProductAttrsById(productId: number): Promise<ProductAttr[] | null> {
    const query = `
      select pa.name,pa.value from product_specifications_attrs as pa 
      where pa.product_id=$1
    `
    try {
      const result = await this.queryWithClient<ProductAttr>(query, [productId])
      return result as ProductAttr[]
    } catch {
      return null
    }
  }
  async getProductHighlightsById(productId: number): Promise<string[] | null> {
    const query = `
    select ph.name from product_highlights as ph
    where ph.product_id=$1
    `
    try {
      const result = await this.queryWithClient<Record<string, string>>(query, [productId])
      return result.map((item: Record<string, string>) => item.name)
    } catch {
      return null
    }
  }
  async findProductById(productId: number): Promise<ProductModel | undefined> {
    try {
      const client = await this.db.connect()

      const query = `
      SELECT pi.*, pd.description, authors.name as author_name, product_inventory.quantity as inventory_quantity
      FROM product_infos AS pi
      LEFT JOIN product_authors AS pa ON pi.id = pa.product_id
      LEFT JOIN authors ON pa.id = authors.id
      JOIN product_descriptions AS pd ON pi.id = pd.id
      JOIN product_inventory ON pi.id = product_inventory.product_id
      WHERE pi.id = $1;
    `

      const result = await (await client.query(query, [productId])).rows[0]

      // Release the client after the query is done
      client.release()

      // If no result is found, return undefined
      if (!result) {
        return undefined
      }

      // Fetching all associated data asynchronously
      const [productAttrs, productHighlights, quantitySold, sellers, imagesUrl, productOptions] = await Promise.all([
        this.getProductAttrsById(productId),
        this.getProductHighlightsById(productId),
        this.getProductSoldById(productId),
        this.getProductSellersById(productId),
        this.getProductImagesById(productId),
        this.getProductOptionsById(productId)
      ])

      // Return the product model with all associated data
      return {
        id: result.id,
        name: result.name,
        url_key: result.url_key,
        short_url: result.short_url,
        short_description: result.short_description,
        original_price: result.original_price,
        thumbnail_url: result.thumbnail_url,
        discount_value: result.discount_value,
        description: result.description,
        author_name: result.author_name,
        inventory_quantiy: result.inventory_quantiy,
        product_attrs: productAttrs,
        product_highlights: productHighlights,
        quantity_sold: quantitySold,
        seller: sellers,
        images_url: imagesUrl,
        product_options: productOptions
      } as ProductModel
    } catch (error) {
      console.error('Error in findProductById:', error)
      return undefined // If there's an error, return undefined
    }
  }

  async getProductsByCategoryId(categoryId: number): Promise<Partial<ProductModel>[]> {
    try {
      const query = `
        SELECT pi.*,
        COALESCE(COUNT(DISTINCT CASE
                                  WHEN s.status IN ('purchase', 'order') THEN od.id
                                  ELSE NULL
                                END), 0) AS quantity_sell
        FROM product_categories AS pc
        JOIN product_infos AS pi ON pc.product_id = pi.id
        LEFT JOIN order_details AS od ON pi.id = od.product_id
        LEFT JOIN shipments AS s ON od.id = s.order_detail_id
        WHERE pc.category_id = $1
        GROUP BY pi.id;
    `
      const result = await this.queryWithClient<ProductModel>(query, [categoryId])
      return result.map((row: ProductModel) => ({
        id: row.id,
        name: row.name,
        url_key: row.url_key,
        short_url: row.short_url,
        short_description: row.short_description,
        original_price: row.original_price,
        thumbnail_url: row.thumbnail_url,
        discount_value: row.discount_value,
        quantity_sold: row.quantity_sold
      }))
    } catch {
      return []
    }
  }
}
export default ProductRepository
