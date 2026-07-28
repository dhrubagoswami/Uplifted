import type { Category } from './common'

export interface CampaignUpdate {
  date: string
  title: string
  body: string
}

export interface CampaignFaq {
  q: string
  a: string
}

export type CampaignStatus = 'draft' | 'active' | 'completed'

export interface Campaign {
  id: string
  slug: string
  title: string
  orgId: string
  category: Category
  /** integer paise */
  goal: number
  /** integer paise */
  raised: number
  donorCount: number
  daysLeft: number
  verified: boolean
  urgent: boolean
  completed?: boolean
  status: CampaignStatus
  impactUnit: string
  /** integer paise */
  unitCost: number
  story: string[]
  updates: CampaignUpdate[]
  faqs: CampaignFaq[]
}
