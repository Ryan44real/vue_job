export interface BorrowRecord {
  id: number
  bookName: string
  bookNum: string
  userName?: string
  userId?: number
  borrowState: number  // 1=borrowing, 2=returned, 3=overdue
  borrowDate: string
  deadline: string
  lastDay: number
  imageName?: string
  State?: string       // display text
}

export interface BorrowDetail {
  bookNum: string
  day: string
  bookName: string
  bookId?: string
}

export interface RenewalApply {
  id?: number
  title?: string
  bookName: string
  bookNum: string
  borrowRecordId: string
  dayNum?: string
  day: string
  username?: string
  userId?: number
  applyState?: number  // 1=pending, 2=approved, 3=rejected
  deadline?: string
  coverImg?: string
  borrowDate?: string
}

export interface RenewalListParams {
  pageNum: number
  pageSize: number
  bookName?: string | null
  username?: string | null
  state?: string | null
}
