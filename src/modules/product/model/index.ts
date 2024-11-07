type ProductOption = {
  name: string
  label: string[]
}
type Seller = {
  id: number
  name: string
}
type ProductAttr = {
  name: string
  value: string
}
type ProductOptionsRecord = Record<string, ProductOption[]>

type ProductModel = {
  id: number
  name: string
  url_key?: string
  short_url?: string
  short_description: string
  original_price: number
  thumbnail_url: string
  discount_value: number
  quantity_sold: number
  images_url: string[]
  inventory_quantiy: number
  description: string
  product_highlights: string[]
  product_options: ProductOptionsRecord
  seller: Seller[]
  author_name: string
  product_attrs: ProductAttr[]
}

export { ProductModel, ProductOption, Seller, ProductAttr, ProductOptionsRecord }
