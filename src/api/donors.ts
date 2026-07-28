import { db } from '../mocks/db'
import type { Donor, Paginated } from '../types'
import { ApiError, delay } from './client'

export interface ListDonorsParams {
  page?: number
  limit?: number
  q?: string
}

export async function listDonors(p: ListDonorsParams = {}): Promise<Paginated<Donor>> {
  await delay()
  const { page = 1, limit = 20, q } = p

  let results = db.donors.slice()
  if (q) {
    const needle = q.toLowerCase()
    results = results.filter(
      (d) => d.name.toLowerCase().includes(needle) || d.email.toLowerCase().includes(needle),
    )
  }

  const total = results.length
  const totalPages = Math.max(1, Math.ceil(total / limit))
  const start = (page - 1) * limit
  const data = results.slice(start, start + limit)

  return { data, page, limit, total, totalPages }
}

export async function getDonor(id: string): Promise<Donor> {
  await delay()
  const d = db.donors.find((x) => x.id === id)
  if (!d) throw new ApiError(404, 'Donor not found', 'DONOR_NOT_FOUND')
  return d
}

export interface DonorStats {
  lifetimeValue: number
  giftCount: number
  recurringCount: number
}

export async function getDonorStats(id: string): Promise<DonorStats> {
  await delay()
  const d = db.donors.find((x) => x.id === id)
  if (!d) throw new ApiError(404, 'Donor not found', 'DONOR_NOT_FOUND')
  const recurringCount = db.recurringGifts.filter((r) => r.donorId === id && r.status === 'active').length
  return { lifetimeValue: d.lifetimeValue, giftCount: d.giftCount, recurringCount }
}
