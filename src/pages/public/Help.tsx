import { Accordion } from '../../components/ui/Accordion'
import { Button } from '../../components/ui/Button'

const FAQS = [
  {
    q: 'Is my donation tax-deductible?',
    a: 'Yes — every donation to a verified organization comes with an 80G receipt, emailed instantly and available anytime from your account.',
  },
  {
    q: 'How do I know a campaign is legitimate?',
    a: "Look for the verified badge. It means the organization's registration, 80G status, and audit history have been checked and are reviewed again every quarter.",
  },
  {
    q: 'Can I get a refund?',
    a: 'Refund requests within 7 days of a one-time gift are processed in full; contact support with your transaction ID.',
  },
  {
    q: 'How do I cancel a monthly gift?',
    a: 'Go to Account → Recurring gifts and select Cancel. It takes effect immediately, no fees.',
  },
  {
    q: 'What payment methods are supported?',
    a: 'UPI, credit and debit cards, net banking, digital wallets, and PayPal.',
  },
  {
    q: 'Can I donate anonymously?',
    a: 'Yes, at checkout. Your name is hidden from the public ledger, but your receipt still comes to your email.',
  },
  {
    q: 'How is my payment information stored?',
    a: "We don't store card numbers — payment partners handle that under PCI-DSS Level 1 compliance.",
  },
  {
    q: 'How do I contact an organization directly?',
    a: 'Each organization profile lists a website; campaign updates and FAQs are the fastest way to get campaign-specific answers.',
  },
]

export default function Help() {
  return (
    <div className="mx-auto grid max-w-[1240px] grid-cols-1 gap-14 px-5 sm:px-8 lg:px-12 py-16 lg:grid-cols-[1.4fr_1fr]">
      <div>
        <h1 className="mb-8 font-display text-[36px] font-semibold tracking-[-0.02em] text-text">
          Help &amp; FAQ
        </h1>
        <Accordion items={FAQS} />
      </div>
      <div className="sticky top-24 h-fit rounded-[20px] border border-border bg-surface p-7">
        <div className="mb-2 font-sans text-base font-semibold text-text">Still need help?</div>
        <div className="mb-5 font-sans text-[13.5px] leading-relaxed text-text-2">
          Our support team replies within one business day.
        </div>
        <div className="flex flex-col gap-2.5">
          <div className="font-sans text-sm text-text">support@uplifted.in</div>
          <div className="font-sans text-sm text-text">+91 80 4712 6600</div>
        </div>
        <Button size="sm" className="mt-5 w-full">
          Contact support
        </Button>
      </div>
    </div>
  )
}
