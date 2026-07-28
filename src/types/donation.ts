import type { PaymentMethod } from './common'

export type DonationStatus = 'Completed' | 'Pending' | 'Refunded'
export type DonationFrequency = 'once' | 'monthly'

export interface Donation {
  id: string
  donorId: string | null
  donorName: string | null
  /** integer paise */
  amount: number
  /** integer paise, transaction fee if covered */
  feeAmount: number
  frequency: DonationFrequency
  campaignId: string
  campaignTitle: string
  unitLabel: string
  method: PaymentMethod
  anonymous: boolean
  message: string | null
  receiptNumber: string
  timestamp: string
  status: DonationStatus
}
