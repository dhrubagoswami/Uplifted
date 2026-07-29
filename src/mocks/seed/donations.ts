import type { Donation, PaymentMethod } from '../../types'
import { campaigns } from './campaigns'
import { donors } from './donors'

const PAYMENT_METHODS: PaymentMethod[] = ['UPI', 'Card', 'Net Banking', 'Wallet', 'PayPal']

function daysAgoIso(days: number, hours = 0): string {
  return new Date(Date.now() - days * 86_400_000 - hours * 3_600_000).toISOString()
}

// Indices in `donors` reserved for Ananya Rao (CURRENT_DONOR), so a handful of
// donations are attributed to the one logged-in demo donor for /account screens.
const ANANYA_DONATION_INDICES = new Set([0, 4, 9, 15, 22])

export const donations: Donation[] = Array.from({ length: 40 }).map((_, i) => {
  const anon = i % 6 === 0 && !ANANYA_DONATION_INDICES.has(i)
  const campaign = campaigns[i % campaigns.length]
  const donor = ANANYA_DONATION_INDICES.has(i) ? donors[0] : donors[1 + (i % (donors.length - 1))]
  const amount = [50000, 100000, 200000, 280000, 500000, 1000000, 2400000][i % 7]
  const units = Math.max(1, Math.round(amount / campaign.unitCost))

  return {
    id: 'don_' + (9000 + i),
    donorId: anon ? null : donor.id,
    donorName: anon ? null : donor.name,
    amount,
    feeAmount: Math.round(amount * 0.021),
    frequency: 'once',
    campaignId: campaign.id,
    campaignTitle: campaign.title,
    unitLabel: units + ' ' + campaign.impactUnit + (units > 1 ? 's' : ''),
    method: PAYMENT_METHODS[i % PAYMENT_METHODS.length],
    anonymous: anon,
    message: null,
    receiptNumber: 'IF-2026-' + (4800 + i).toString().padStart(6, '0'),
    timestamp: daysAgoIso(Math.floor(i / 3), (i * 7) % 24),
    status: i % 17 === 0 ? 'Refunded' : i % 11 === 0 ? 'Pending' : 'Completed',
  }
})
