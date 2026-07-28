/** Formats integer paise as an INR string with Indian digit grouping, e.g. 43000000 -> "₹4,30,000.00". */
export function formatINR(paise: number): string {
  const rupees = paise / 100
  const n = Math.round(rupees * 100) / 100
  const [intPart, decPart = '00'] = Math.abs(n).toFixed(2).split('.')
  let last3 = intPart.substring(intPart.length - 3)
  const rest = intPart.substring(0, intPart.length - 3)
  if (rest !== '') last3 = ',' + last3
  const formatted = rest.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + last3
  return (n < 0 ? '-' : '') + '₹' + formatted + '.' + decPart
}

const USD_PER_INR = 1 / 83

/** Formats integer paise as a USD string using an 83:1 INR-to-USD rate. */
export function formatUSD(paise: number): string {
  const usd = (paise / 100) * USD_PER_INR
  return '$' + usd.toLocaleString('en-US', { maximumFractionDigits: usd >= 1000 ? 0 : 2 })
}

export function timeAgo(iso: string): string {
  const secs = Math.max(1, Math.floor((Date.now() - new Date(iso).getTime()) / 1000))
  if (secs < 60) return secs + 's ago'
  const mins = Math.floor(secs / 60)
  if (mins < 60) return mins + 'm ago'
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return hrs + 'h ago'
  const days = Math.floor(hrs / 24)
  return days + 'd ago'
}
