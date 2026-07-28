import { db } from '../mocks/db'
import { CURRENT_DONOR } from '../mocks/seed/session'
import type { Campaign, DonorUser, RecurringGift } from '../types'
import { ApiError, delay } from './client'

export async function getProfile(): Promise<DonorUser> {
  await delay()
  return CURRENT_DONOR
}

export async function updateProfile(patch: Partial<DonorUser>): Promise<DonorUser> {
  await delay()
  Object.assign(CURRENT_DONOR, patch)
  return CURRENT_DONOR
}

export async function listRecurring(): Promise<RecurringGift[]> {
  await delay()
  return db.recurringGifts.filter((r) => r.donorId === CURRENT_DONOR.id)
}

export async function pauseRecurring(id: string): Promise<RecurringGift> {
  await delay()
  const r = db.recurringGifts.find((x) => x.id === id)
  if (!r) throw new ApiError(404, 'Recurring gift not found', 'RECURRING_NOT_FOUND')
  r.status = 'paused'
  return r
}

export async function cancelRecurring(id: string): Promise<RecurringGift> {
  await delay()
  const r = db.recurringGifts.find((x) => x.id === id)
  if (!r) throw new ApiError(404, 'Recurring gift not found', 'RECURRING_NOT_FOUND')
  r.status = 'cancelled'
  return r
}

export async function listSaved(): Promise<Campaign[]> {
  await delay()
  const campaignIds = db.savedCampaigns
    .filter((s) => s.donorId === CURRENT_DONOR.id)
    .map((s) => s.campaignId)
  return db.campaigns.filter((c) => campaignIds.includes(c.id))
}

export async function toggleSaved(campaignId: string): Promise<{ saved: boolean }> {
  await delay()
  const idx = db.savedCampaigns.findIndex(
    (s) => s.donorId === CURRENT_DONOR.id && s.campaignId === campaignId,
  )
  if (idx >= 0) {
    db.savedCampaigns.splice(idx, 1)
    return { saved: false }
  }
  db.savedCampaigns.push({ donorId: CURRENT_DONOR.id, campaignId, savedAt: new Date().toISOString() })
  return { saved: true }
}
