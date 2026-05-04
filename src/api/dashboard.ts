import request from '@/utils/request'

export const getMyDashboardService = () => {
  return request.get('/dashboard/my')
}

export const getMyBadgesService = () => {
  return request.get('/dashboard/badges')
}

export const getLeaderboardService = () => {
  return request.get('/dashboard/leaderboard')
}
