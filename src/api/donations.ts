import { db } from '../mocks/db'
import type { Donation, DonationFrequency, DonationStatus, Paginated, PaymentMethod } from '../types'
import { ApiError, delay, generateId, generateReceiptNumber } from './client'

export interface ListDonationsParams {
  page?: number
  limit?: number
  campaignId?: string
  donorId?: string
  status?: DonationStatus
  q?: string
}

export async function listDonations(p: ListDonationsParams = {}): Promise<Paginated<Donation>> {
  await delay()
  const { page = 1, limit = 20, campaignId, donorId, status, q } = p

  let results = db.donations.slice().sort((a, b) => b.timestamp.localeCompare(a.timestamp))
  if (campaignId) results = results.filter((d) => d.campaignId === campaignId)
  if (donorId) results = results.filter((d) => d.donorId === donorId)
  if (status) results = results.filter((d) => d.status === status)
  if (q) {
    const needle = q.toLowerCase()
    results = results.filter(
      (d) =>
        d.campaignTitle.toLowerCase().includes(needle) ||
        (d.donorName ?? '').toLowerCase().includes(needle) ||
        d.receiptNumber.toLowerCase().includes(needle),
    )
  }

  const total = results.length
  const totalPages = Math.max(1, Math.ceil(total / limit))
  const start = (page - 1) * limit
  const data = results.slice(start, start + limit)

  return { data, page, limit, total, totalPages }
}

export async function getDonation(id: string): Promise<Donation> {
  await delay()
  const d = db.donations.find((x) => x.id === id)
  if (!d) throw new ApiError(404, 'Donation not found', 'DONATION_NOT_FOUND')
  return d
}

export interface CreateDonationParams {
  campaignId: string
  amount: number
  feeAmount: number
  frequency: DonationFrequency
  method: PaymentMethod
  anonymous: boolean
  donorId?: string | null
  donorName?: string | null
  message?: string | null
}

export async function createDonation(p: CreateDonationParams): Promise<Donation> {
  await delay()
  const campaign = db.campaigns.find((c) => c.id === p.campaignId)
  if (!campaign) throw new ApiError(404, 'Campaign not found', 'CAMPAIGN_NOT_FOUND')

  const units = Math.max(1, Math.round(p.amount / campaign.unitCost))
  const donation: Donation = {
    id: generateId('don'),
    donorId: p.anonymous ? null : (p.donorId ?? null),
    donorName: p.anonymous ? null : (p.donorName ?? null),
    amount: p.amount,
    feeAmount: p.feeAmount,
    frequency: p.frequency,
    campaignId: campaign.id,
    campaignTitle: campaign.title,
    unitLabel: units + ' ' + campaign.impactUnit + (units > 1 ? 's' : ''),
    method: p.method,
    anonymous: p.anonymous,
    message: p.message ?? null,
    receiptNumber: generateReceiptNumber(),
    timestamp: new Date().toISOString(),
    status: 'Completed',
  }

  db.donations.unshift(donation)
  campaign.raised += p.amount
  campaign.donorCount += 1

  return donation
}

export async function refundDonation(id: string): Promise<Donation> {
  await delay()
  const donation = db.donations.find((d) => d.id === id)
  if (!donation) throw new ApiError(404, 'Donation not found', 'DONATION_NOT_FOUND')
  donation.status = 'Refunded'
  return donation
}

export async function listDonationsByCampaign(campaignId: string): Promise<Donation[]> {
  await delay()
  return db.donations.filter((d) => d.campaignId === campaignId)
}

export async function listDonationsByDonor(donorId: string): Promise<Donation[]> {
  await delay()
  return db.donations.filter((d) => d.donorId === donorId)
}

export async function getRecentDonations(n = 10): Promise<Donation[]> {
  await delay()
  return db.donations.slice().sort((a, b) => b.timestamp.localeCompare(a.timestamp)).slice(0, n)
}
