import request from '@/utils/request'

export const addReservationService = (bookNum: number) => {
  return request.post('/reservation/add', `bookNum=${bookNum}`, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  })
}

export const getMyReservationQueueService = () => {
  return request.get('/reservation/myQueue')
}

export const getBookReservationQueueService = (bookNum: number) => {
  return request.get('/reservation/bookQueue', { params: { bookNum } })
}

export const getAllReservationsService = () => {
  return request.get('/reservation/all')
}
