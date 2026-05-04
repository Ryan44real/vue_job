export interface BookCategory {
  id: number
  categoryName: string
  categoryAlias: string
  createTime?: string
  updateTime?: string
}

export interface Book {
  id?: number
  title: string
  content: string
  coverImg: string
  state: string
  categoryId: number | string
  categoryName?: string
  isbn: string
  bookNum: string
  location: string
  publisher: string
  isbnPhoto?: string
  createTime?: string
  updateTime?: string
  tags?: string
}

export interface BookListParams {
  pageNum: number
  pageSize: number
  categoryId?: string | null
  title?: string | null
  state?: string | null
  username?: string | null
  bookName?: string | null
  tag?: string | null
  tags?: string | null
}

export interface PageResult<T> {
  items: T[]
  total: number
}
