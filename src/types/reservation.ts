export interface ReservationRecord {
  id: number
  userId: number
  username: string
  bookNum: number
  bookName: string
  coverImg: string
  reservationTime: string
  notifyTime: string | null
  status: number        // 1=排队中, 2=已通知, 3=已失效, 4=已取消
  queuePosition: number
}

export interface CreditLog {
  id: number
  userId: number
  changeAmount: number
  reason: string
  createTime: string
  relatedId: number
}

export type CreditTier = '资深读者' | '普通读者' | '受限读者' | '封禁名单'

export interface CreditInfo {
  score: number
  tier: CreditTier
  borrowLimit: number
  canReserve: boolean
}

export function getCreditInfo(score: number): CreditInfo {
  if (score > 120) return { score, tier: '资深读者', borrowLimit: 10, canReserve: true }
  if (score >= 80) return { score, tier: '普通读者', borrowLimit: 6, canReserve: true }
  if (score >= 60) return { score, tier: '受限读者', borrowLimit: 2, canReserve: false }
  return { score, tier: '封禁名单', borrowLimit: 0, canReserve: false }
}
