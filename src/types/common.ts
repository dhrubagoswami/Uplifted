export interface Paginated<T> {
  data: T[]
  page: number
  limit: number
  total: number
  totalPages: number
}

export interface ApiResponse<T> {
  data: T
}

export type Category =
  | 'Education'
  | 'Health'
  | 'Water'
  | 'Hunger'
  | 'Disaster'
  | 'Animals'
  | 'Environment'
  | 'Women & Child'

export type Currency = 'INR' | 'USD'

export type PaymentMethod = 'UPI' | 'Card' | 'Net Banking' | 'Wallet' | 'PayPal'
