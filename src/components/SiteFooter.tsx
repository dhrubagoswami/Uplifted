import { Link } from 'react-router-dom'
import { Input } from './ui/Input'
import { Button } from './ui/Button'
import { Logo } from './ui/Logo'

const GIVE_LINKS = [
  { label: 'Browse campaigns', href: '/campaigns' },
  { label: 'How it works', href: '/how-it-works' },
  { label: 'Organizations', href: '/organizations/saathi-foundation' },
]

const COMPANY_LINKS = [
  { label: 'About', href: '/about' },
  { label: 'Help & FAQ', href: '/help' },
  { label: 'Search', href: '/search' },
]

const LEGAL_LINKS = [
  { label: 'Privacy policy', href: '/help' },
  { label: 'Terms of use', href: '/help' },
  { label: 'Refund policy', href: '/help' },
]

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-footer-bg">
      <div className="mx-auto flex max-w-[1240px] flex-wrap items-center justify-between gap-6 border-b border-border px-5 sm:px-8 lg:px-12 pb-10 pt-14">
        <div className="flex flex-wrap items-center gap-7">
          <span className="font-sans text-[13px] text-text-2">256-bit SSL secured</span>
          <span className="font-sans text-[13px] text-text-2">PCI-DSS Level 1</span>
          <span className="font-sans text-[13px] text-text-2">80G tax receipts</span>
          <span className="font-sans text-[13px] text-text-2">
            UPI · Cards · Net Banking · Wallets · PayPal
          </span>
        </div>
      </div>

      <div className="mx-auto grid max-w-[1240px] grid-cols-1 gap-8 px-5 sm:px-8 lg:px-12 pt-10 sm:grid-cols-2 md:grid-cols-5">
        <div className="flex flex-col gap-3.5">
          <div className="flex items-center gap-2.5">
            <Logo size={26} />
            <span className="font-display text-base font-bold text-text">Uplifted</span>
          </div>
          <p className="max-w-[220px] font-sans text-[13.5px] leading-relaxed text-text-2">
            Verified giving, transparent to the rupee.
          </p>
        </div>

        <FooterColumn heading="Give" links={GIVE_LINKS} />
        <FooterColumn heading="Company" links={COMPANY_LINKS} />
        <FooterColumn heading="Legal" links={LEGAL_LINKS} />

        <div className="flex flex-col gap-3">
          <div className="font-sans text-xs font-semibold uppercase tracking-[0.08em] text-text-2">
            Stay updated
          </div>
          <div className="flex gap-2">
            <Input type="email" placeholder="Email address" className="min-w-0 flex-1 py-2.5" />
            <Button size="sm" className="flex-shrink-0">
              Join
            </Button>
          </div>
        </div>
      </div>

      <div className="mx-auto flex max-w-[1240px] flex-wrap items-center justify-between gap-3 px-5 sm:px-8 lg:px-12 pb-8 pt-10">
        <div className="font-sans text-[12.5px] text-text-2">© 2026 Uplifted. All rights reserved.</div>
        <div className="font-sans text-[12.5px] text-text-2">Made for verified causes across India.</div>
      </div>
    </footer>
  )
}

function FooterColumn({ heading, links }: { heading: string; links: { label: string; href: string }[] }) {
  return (
    <div className="flex flex-col gap-3">
      <div className="font-sans text-xs font-semibold uppercase tracking-[0.08em] text-text-2">
        {heading}
      </div>
      {links.map((link) => (
        <Link
          key={link.label}
          to={link.href}
          className="font-sans text-[13.5px] text-text-2 no-underline hover:text-text"
        >
          {link.label}
        </Link>
      ))}
    </div>
  )
}
