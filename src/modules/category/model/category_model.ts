type CategoryModel = {
  id: number
  title: string
  level?: number
  url_key: string | undefined
  thumbnail_url?: string | undefined
}
type ListCategoryModel = CategoryModel[]

export { CategoryModel, ListCategoryModel }
