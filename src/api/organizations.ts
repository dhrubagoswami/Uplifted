import { db } from '../mocks/db'
import type { Campaign, Organization, Paginated } from '../types'
import { ApiError, delay } from './client'

export interface ListOrganizationsParams {
  page?: number
  limit?: number
  verifiedOnly?: boolean
}

export async function listOrganizations(p: ListOrganizationsParams = {}): Promise<Paginated<Organization>> {
  await delay()
  const { page = 1, limit = 20, verifiedOnly } = p

  let results = db.organizations.slice()
  if (verifiedOnly) {
    results = results.filter((o) => o.verified)
  }

  const total = results.length
  const totalPages = Math.max(1, Math.ceil(total / limit))
  const start = (page - 1) * limit
  const data = results.slice(start, start + limit)

  return { data, page, limit, total, totalPages }
}

export async function getOrganization(slug: string): Promise<Organization> {
  await delay()
  const o = db.organizations.find((x) => x.slug === slug)
  if (!o) throw new ApiError(404, 'Organization not found', 'ORG_NOT_FOUND')
  return o
}

export async function getOrganizationCampaigns(orgId: string): Promise<Campaign[]> {
  await delay()
  return db.campaigns.filter((c) => c.orgId === orgId)
}
