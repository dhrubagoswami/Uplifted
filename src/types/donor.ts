export interface Donor {
  id: string
  name: string
  email: string
  /** integer paise */
  lifetimeValue: number
  giftCount: number
  firstGift: string
  lastGift: string
  recurring: boolean
}

export interface SavedCampaign {
  donorId: string
  campaignId: string
  savedAt: string
}

export type RecurringStatus = 'active' | 'paused' | 'cancelled'

export interface RecurringGift {
  id: string
  donorId: string
  campaignId: string
  campaignTitle: string
  /** integer paise */
  amount: number
  status: RecurringStatus
  nextChargeDate: string
  createdAt: string
}
