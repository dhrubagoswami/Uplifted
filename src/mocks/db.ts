import type { RecurringGift, SavedCampaign } from '../types'
import { organizations } from './seed/organizations'
import { campaigns } from './seed/campaigns'
import { donors } from './seed/donors'
import { donations } from './seed/donations'
import { kiosks } from './seed/kiosks'
import { CURRENT_DONOR } from './seed/session'

const recurringGifts: RecurringGift[] = [
  {
    id: 'rec_1001',
    donorId: CURRENT_DONOR.id,
    campaignId: 'cmp_x7k2m',
    campaignTitle: 'Clean water for 120 villages in Vidarbha',
    amount: 200_000,
    status: 'active',
    nextChargeDate: '2026-08-12',
    createdAt: '2026-02-12T00:00:00.000Z',
  },
  {
    id: 'rec_1002',
    donorId: CURRENT_DONOR.id,
    campaignId: 'cmp_9d4p1',
    campaignTitle: 'School meals for 400 children',
    amount: 120_000,
    status: 'active',
    nextChargeDate: '2026-08-03',
    createdAt: '2026-03-03T00:00:00.000Z',
  },
]

const savedCampaigns: SavedCampaign[] = [
  { donorId: CURRENT_DONOR.id, campaignId: 'cmp_wy4nd', savedAt: '2026-07-16T00:00:00.000Z' },
  { donorId: CURRENT_DONOR.id, campaignId: 'cmp_s50gr', savedAt: '2026-06-20T00:00:00.000Z' },
]

export const db = {
  organizations: [...organizations],
  campaigns: [...campaigns],
  donors: [...donors],
  donations: [...donations],
  kiosks: [...kiosks],
  recurringGifts,
  savedCampaigns,
}
