export interface UserAchievement {
  id: number
  userId: number
  achievementCode: string
  achievementName: string
  achievementDesc: string
  achieveTime: string
}

export interface DashboardData {
  totalBorrowed: number
  currentlyBorrowing: number
  overdueCount: number
  last30Days: number
  prev30Days: number
  trend: 'UP' | 'DOWN'
  creditScore: number
  badges: UserAchievement[]
}

export interface LeaderboardEntry {
  userId: number
  username: string
  borrowCount: number
}
