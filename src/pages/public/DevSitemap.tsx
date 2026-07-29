import { Link } from 'react-router-dom'

interface RouteZone {
  label: string
  phase: string
  done: boolean
  links: { label: string; href: string }[]
}

const ZONES: RouteZone[] = [
  {
    label: 'Public',
    phase: 'P4',
    done: true,
    links: [
      { label: 'Home', href: '/' },
      { label: 'Browse campaigns', href: '/campaigns' },
      { label: 'Campaign detail', href: '/campaigns/clean-water-vidarbha' },
      { label: 'Donation flow', href: '/campaigns/clean-water-vidarbha/donate' },
      { label: 'Donation success', href: '/donation/success/don_9000' },
      { label: 'Organization profile', href: '/organizations/saathi-foundation' },
      { label: 'How it works', href: '/how-it-works' },
      { label: 'About', href: '/about' },
      { label: 'Search', href: '/search' },
      { label: 'Help / FAQ', href: '/help' },
      { label: 'Donor login', href: '/login' },
      { label: 'Donor signup', href: '/signup' },
      { label: '404', href: '/this-route-does-not-exist' },
    ],
  },
  {
    label: 'Donor account',
    phase: 'P6',
    done: true,
    links: [
      { label: 'Overview', href: '/account' },
      { label: 'Donations', href: '/account/donations' },
      { label: 'Recurring', href: '/account/recurring' },
      { label: 'Saved', href: '/account/saved' },
      { label: 'Settings', href: '/account/settings' },
    ],
  },
  {
    label: 'Admin',
    phase: 'P7',
    done: true,
    links: [
      { label: 'Org login', href: '/admin/login' },
      { label: 'Dashboard', href: '/admin' },
      { label: 'Campaigns', href: '/admin/campaigns' },
      { label: 'Create campaign', href: '/admin/campaigns/new' },
      { label: 'Campaign analytics', href: '/admin/campaigns/cmp_x7k2m' },
      { label: 'Edit campaign', href: '/admin/campaigns/cmp_x7k2m/edit' },
      { label: 'Donations', href: '/admin/donations' },
      { label: 'Donors', href: '/admin/donors' },
      { label: 'Analytics', href: '/admin/analytics' },
      { label: 'Payouts', href: '/admin/payouts' },
      { label: 'Kiosks', href: '/admin/kiosks' },
      { label: 'Settings', href: '/admin/settings' },
    ],
  },
  {
    label: 'Kiosk',
    phase: 'P8',
    done: true,
    links: [
      { label: 'Attract', href: '/kiosk' },
      { label: 'Browse', href: '/kiosk/browse' },
      { label: 'Campaign detail', href: '/kiosk/campaign/clean-water-vidarbha' },
      { label: 'Give', href: '/kiosk/give/clean-water-vidarbha' },
      { label: 'Thanks', href: '/kiosk/thanks/don_9000' },
    ],
  },
]

export default function DevSitemap() {
  return (
    <div className="mx-auto max-w-[1240px] px-5 sm:px-8 lg:px-12 py-16">
      <h1 className="font-display text-[28px] font-semibold text-text">Uplifted — sitemap</h1>
      <p className="mt-2 mb-8 font-sans text-sm text-text-2">
        Every route in the app, for demo navigation. Zones not yet built show a placeholder
        screen.
      </p>
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {ZONES.map((zone) => (
          <div key={zone.label}>
            <div className="mb-3 flex items-center gap-2">
              <span className="font-sans text-xs font-bold uppercase tracking-[0.08em] text-primary">
                {zone.label}
              </span>
              <span className="rounded-full bg-surface-2 px-2 py-0.5 font-sans text-[10px] font-semibold text-text-2">
                {zone.done ? 'built' : `pending — ${zone.phase}`}
              </span>
            </div>
            <div className="flex flex-col gap-2">
              {zone.links.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className="rounded-lg border border-border bg-surface px-2.5 py-2 font-sans text-[13.5px] text-text no-underline hover:bg-surface-2"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
