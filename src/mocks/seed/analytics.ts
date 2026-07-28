import type { RevenuePoint } from '../../types'

export function generateRevenueSeries(): RevenuePoint[] {
  const out: RevenuePoint[] = []
  for (let i = 89; i >= 0; i--) {
    const d = new Date(Date.now() - i * 86_400_000)
    const dow = d.getDay()
    let base = 4_200_000 + Math.sin(i / 6) * 900_000 + (89 - i) * 18_000
    if (dow === 0 || dow === 6) base *= 0.55
    if (i === 14) base += 26_000_000
    out.push({ date: d.toISOString().slice(0, 10), amount: Math.max(800_000, Math.round(base)) })
  }
  return out
}
