import { useState } from 'react'
import { Check } from 'lucide-react'
import { Tabs } from '../../components/ui/Tabs'
import { Input } from '../../components/ui/Input'
import { Switch } from '../../components/ui/Switch'
import { Button } from '../../components/ui/Button'

const TABS = [
  { value: 'org', label: 'Organization' },
  { value: 'team', label: 'Team' },
  { value: 'payments', label: 'Payments' },
  { value: 'security', label: 'Security' },
  { value: 'notifications', label: 'Notifications' },
]

const TEAM = [
  { name: 'Vikram Menon', email: 'vikram@saathifoundation.org', role: 'Admin' },
  { name: 'Lakshmi Rao', email: 'lakshmi@saathifoundation.org', role: 'Finance' },
  { name: 'Suresh Nair', email: 'suresh@saathifoundation.org', role: 'Editor' },
]

// TODO(design): organization profile, team roster, settlement account, and
// security settings aren't backed by real endpoints (not in CLAUDE.md
// §5.3's API surface), so this tab's content is static demo data.
export default function AdminSettings() {
  const [tab, setTab] = useState('org')
  const [twoFa, setTwoFa] = useState(true)

  return (
    <div className="max-w-[760px]">
      <Tabs items={TABS} value={tab} onChange={setTab} className="mb-6" />

      {tab === 'org' && (
        <div className="flex flex-col gap-5">
          <div className="flex items-center justify-between rounded-[14px] border border-success/25 bg-success-soft p-4.5">
            <div>
              <div className="font-sans text-sm font-semibold text-text">Verified organization</div>
              <div className="mt-0.5 font-sans text-xs text-text-2">Next re-verification due Oct 2026</div>
            </div>
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-success text-white">
              <Check size={16} strokeWidth={2.5} />
            </span>
          </div>
          <div className="flex flex-col gap-3 rounded-[14px] border border-border bg-surface p-4.5">
            <Input defaultValue="Saathi Foundation" aria-label="Organization name" />
            <Input defaultValue="KA/2012/0043821" className="font-mono" aria-label="Registration number" />
          </div>
          <div>
            <div className="mb-2.5 font-sans text-xs font-semibold uppercase tracking-[0.06em] text-text-2">
              Documents
            </div>
            <div className="flex flex-col divide-y divide-border rounded-xl border border-border">
              <div className="flex justify-between px-4 py-3">
                <span className="font-sans text-[13.5px] text-text">Registration certificate</span>
                <span className="font-sans text-xs font-semibold text-success">Verified</span>
              </div>
              <div className="flex justify-between px-4 py-3">
                <span className="font-sans text-[13.5px] text-text">80G certificate</span>
                <span className="font-sans text-xs font-semibold text-success">Verified</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {tab === 'team' && (
        <div>
          <div className="mb-3.5 flex justify-end">
            <Button size="sm">+ Invite member</Button>
          </div>
          <div className="flex flex-col divide-y divide-border overflow-hidden rounded-[14px] border border-border">
            {TEAM.map((m) => (
              <div key={m.email} className="flex items-center justify-between bg-surface px-4 py-3.5">
                <div>
                  <div className="font-sans text-[13.5px] font-semibold text-text">{m.name}</div>
                  <div className="font-sans text-xs text-text-2">{m.email}</div>
                </div>
                <span className="rounded-lg border border-border bg-surface px-2.5 py-1.5 font-sans text-xs text-text">
                  {m.role}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'payments' && (
        <div className="rounded-[14px] border border-border bg-surface p-4.5">
          <div className="mb-2 font-sans text-sm font-semibold text-text">Settlement account</div>
          <div className="font-mono text-sm text-text">HDFC Bank •••• 6172</div>
        </div>
      )}

      {tab === 'security' && (
        <div className="flex flex-col gap-4">
          <label className="flex cursor-pointer items-center justify-between rounded-xl border border-border bg-surface p-4">
            <span className="font-sans text-sm text-text">Two-factor authentication</span>
            <Switch checked={twoFa} onChange={(e) => setTwoFa(e.target.checked)} />
          </label>
          <div>
            <div className="mb-2.5 font-sans text-xs font-semibold uppercase tracking-[0.06em] text-text-2">
              Active sessions
            </div>
            <div className="flex flex-col divide-y divide-border rounded-xl border border-border">
              <div className="flex justify-between px-4 py-3">
                <span className="font-sans text-[13.5px] text-text">Chrome · Bengaluru</span>
                <span className="font-sans text-xs text-text-2">This device</span>
              </div>
              <div className="flex justify-between px-4 py-3">
                <span className="font-sans text-[13.5px] text-text">Safari · Mumbai</span>
                <button
                  type="button"
                  className="cursor-pointer border-none bg-transparent p-0 font-sans text-xs text-danger"
                >
                  Revoke
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {tab === 'notifications' && (
        <div className="flex flex-col divide-y divide-border rounded-xl border border-border">
          <label className="flex cursor-pointer items-center justify-between bg-surface px-4 py-3.5">
            <span className="font-sans text-sm text-text">New donation alerts</span>
            <Switch defaultChecked />
          </label>
          <label className="flex cursor-pointer items-center justify-between bg-surface px-4 py-3.5">
            <span className="font-sans text-sm text-text">Weekly summary email</span>
            <Switch defaultChecked />
          </label>
        </div>
      )}
    </div>
  )
}
