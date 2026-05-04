export interface Comment {
  id: number
  userId: number
  username: string
  userPic: string
  bookNum: number
  bookName: string
  rating: number
  content: string
  status: number       // 0=pending, 1=approved, 2=rejected
  createTime: string
}

export interface RatingInfo {
  avgRating: number
  commentCount: number
}
