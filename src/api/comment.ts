import request from '@/utils/request'

export const addCommentService = (bookNum: number, rating: number, content: string) => {
  const params = new URLSearchParams()
  params.append('bookNum', String(bookNum))
  params.append('rating', String(rating))
  params.append('content', content)
  return request.post('/comment/add', params, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  })
}

export const getBookCommentsService = (bookNum: number) => {
  return request.get('/comment/book', { params: { bookNum } })
}

export const getBookRatingService = (bookNum: number) => {
  return request.get('/comment/rating', { params: { bookNum } })
}

export const getMyCommentsService = () => {
  return request.get('/comment/my')
}

export const getPendingCommentsService = () => {
  return request.get('/comment/pending')
}

export const reviewCommentService = (id: number, status: number) => {
  return request.put(`/comment/review?id=${id}&status=${status}`)
}
