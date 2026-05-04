export interface ApiResponse<T = unknown> {
  code: number
  message?: string
  msg?: string
  data: T
}
