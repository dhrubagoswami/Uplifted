import { db } from '../mocks/db'
import type { Campaign, CampaignStatus, CampaignUpdate, Category, Paginated } from '../types'
import { ApiError, delay, generateId } from './client'

export interface ListCampaignsParams {
  page?: number
  limit?: number
  category?: Category[]
  sort?: 'trending' | 'newest' | 'ending' | 'closest' | 'funded'
  verifiedOnly?: boolean
  urgentOnly?: boolean
  q?: string
}

export async function listCampaigns(p: ListCampaignsParams = {}): Promise<Paginated<Campaign>> {
  await delay()
  const { page = 1, limit = 12, category, sort = 'trending', verifiedOnly, urgentOnly, q } = p

  let results = db.campaigns.slice()

  if (category && category.length > 0) {
    results = results.filter((c) => category.includes(c.category))
  }
  if (verifiedOnly) {
    results = results.filter((c) => c.verified)
  }
  if (urgentOnly) {
    results = results.filter((c) => c.urgent)
  }
  if (q) {
    const needle = q.toLowerCase()
    results = results.filter((c) => c.title.toLowerCase().includes(needle))
  }

  switch (sort) {
    case 'newest':
      results = results.slice().reverse()
      break
    case 'ending':
      results = results.slice().sort((a, b) => a.daysLeft - b.daysLeft)
      break
    case 'closest':
      results = results.slice().sort((a, b) => b.raised / b.goal - a.raised / a.goal)
      break
    case 'funded':
      results = results.slice().sort((a, b) => b.raised - a.raised)
      break
    case 'trending':
    default:
      results = results.slice().sort((a, b) => b.donorCount - a.donorCount)
      break
  }

  const total = results.length
  const totalPages = Math.max(1, Math.ceil(total / limit))
  const start = (page - 1) * limit
  const data = results.slice(start, start + limit)

  return { data, page, limit, total, totalPages }
}

export async function getCampaign(slug: string): Promise<Campaign> {
  await delay()
  const c = db.campaigns.find((x) => x.slug === slug)
  if (!c) throw new ApiError(404, 'Campaign not found', 'CAMPAIGN_NOT_FOUND')
  return c
}

export interface CreateCampaignParams {
  title: string
  orgId: string
  category: Category
  goal: number
  impactUnit: string
  unitCost: number
  daysLeft: number
  story?: string[]
  status?: CampaignStatus
}

export async function createCampaign(p: CreateCampaignParams): Promise<Campaign> {
  await delay()
  const slug = p.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')

  const campaign: Campaign = {
    id: generateId('cmp'),
    slug,
    title: p.title,
    orgId: p.orgId,
    category: p.category,
    goal: p.goal,
    raised: 0,
    donorCount: 0,
    daysLeft: p.daysLeft,
    verified: false,
    urgent: false,
    status: p.status ?? 'draft',
    impactUnit: p.impactUnit,
    unitCost: p.unitCost,
    story: p.story ?? [],
    updates: [],
    faqs: [],
  }
  db.campaigns.push(campaign)
  return campaign
}

export async function updateCampaign(id: string, patch: Partial<Campaign>): Promise<Campaign> {
  await delay()
  const idx = db.campaigns.findIndex((c) => c.id === id)
  if (idx === -1) throw new ApiError(404, 'Campaign not found', 'CAMPAIGN_NOT_FOUND')
  db.campaigns[idx] = { ...db.campaigns[idx], ...patch }
  return db.campaigns[idx]
}

export async function updateCampaignStatus(id: string, status: CampaignStatus): Promise<Campaign> {
  return updateCampaign(id, { status })
}

export async function listCampaignUpdates(id: string): Promise<CampaignUpdate[]> {
  await delay()
  const c = db.campaigns.find((x) => x.id === id)
  if (!c) throw new ApiError(404, 'Campaign not found', 'CAMPAIGN_NOT_FOUND')
  return c.updates
}

export async function addCampaignUpdate(id: string, update: CampaignUpdate): Promise<CampaignUpdate> {
  await delay()
  const c = db.campaigns.find((x) => x.id === id)
  if (!c) throw new ApiError(404, 'Campaign not found', 'CAMPAIGN_NOT_FOUND')
  c.updates = [update, ...c.updates]
  return update
}
