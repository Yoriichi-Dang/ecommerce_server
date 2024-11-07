import dbConnection from '@/config/db'
import { Pool } from 'pg'
import { ProductAttr, ProductModel, ProductOption, ProductOptionsRecord, Seller } from '../model'

class ProductRepository {
  private db: Pool
  constructor() {
    this.db = dbConnection.getPool()
  }
  async getProductImagesById(productId: number): Promise<string[] | null> {
    const client = await this.db.connect()
    try {
      const query = `
      select product_images.image_url from product_images where product_images.id=$1
      `
      const result = await client.query(query, [productId])
      return result.rows.map((item: Record<string, string>) => item.image_url)
    } catch {
      client.release()
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
                               LEFT JOIN order_details AS od ON pi.id = od.product_id
                               LEFT JOIN shipments AS s ON od.id = s.order_detail_id
                               WHERE pi.id = $1
                               GROUP BY pi.id;
                               FROM product_infos AS pi
    `
      const client = await this.db.connect()
      const result = (await client.query(query, [productId])).rows[0]
      return result
    } catch {
      return 0
    }
  }
  async getProductSellersById(productId: number): Promise<Seller[] | null> {
    const client = await this.db.connect()
    try {
      const query = `
      select sellers.* from sellers
      join product_seller as ps on sellers.id=ps.id
      where ps.product_id=$1
      `
      const result = await client.query(query, [productId])
      return result.rows as Seller[]
    } catch {
      client.release()
      return null
    }
  }
  async getProductOptionsById(productId: number): Promise<ProductOptionsRecord | null> {
    const client = await this.db.connect()
    let query = `
    select po.code,po.name,po.label from product_options as po
    where product_id=$1
    `
    try {
      const result_1 = (await client.query(query, [productId])).rows
      if (result_1.length === 0) return null
      const productOptions: ProductOptionsRecord = result_1.reduce((acc, item) => {
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
      const client = this.db.connect()
      const result = (await (await client).query(query, [productId])).rows
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
      const client = await this.db.connect()
      const result = (await client.query(query, [productId])).rows
      return result.map((item: Record<string, string>) => item.name)
    } catch {
      return null
    }
  }
  async findProductById(productId: number): Promise<ProductModel | undefined> {
    try {
      const client = await this.db.connect()

      const query = `
         SELECT pi.*,pd.description, authors.name as author_name, product_inventory.quantity as inventory_quantiy
        FROM product_infos AS pi
        LEFT JOIN product_authors AS pa ON pi.id = pa.product_id
        LEFT JOIN authors ON pa.id = authors.id
        JOIN product_descriptions as pd on pi.id=pd.id
		    JOIN product_inventory on pi.id=product_inventory.product_id
        WHERE pi.id = $1;
      `
      const result = await (await client.query(query, [productId])).rows[0]
      client.release()
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
        product_options: await this.getProductOptionsById(productId),
        product_attrs: await this.getProductAttrsById(productId),
        product_highlights: await this.getProductHighlightsById(productId),
        quantity_sold: await this.getProductSoldById(productId),
        seller: await this.getProductSellersById(productId),
        images_url: await this.getProductImagesById(productId)
      } as ProductModel
    } catch {
      return undefined
    }
  }
  async getProductsByCategoryId(categoryId: number): Promise<Partial<ProductModel>[]> {
    const client = await this.db.connect()
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
      const result = await client.query(query, [categoryId])
      client.release()
      return result.rows.map((row: ProductModel) => ({
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
      client.release()
      return []
    }
  }
}
export default ProductRepository
