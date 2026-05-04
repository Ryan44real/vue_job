import request from '@/utils/request'

export const aiRecommendService = (query: string, model: string = 'ernie_speed') => {
  const params = new URLSearchParams()
  params.append('query', query)
  params.append('model', model)
  return request.post('/ai/chat/recommend', params, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  })
}

export const aiStatsService = () => {
  return request.get('/ai/stats')
}

export const allTagsService = () => {
  return request.get('/article/allTags')
}

export const AiContentWithModel = (bookName: string, isbn: string, model: string = 'ernie_speed') => {
  return request.get('/article/getBookContent', {
    params: { bookName, bookNum: isbn, model }
  })
}
