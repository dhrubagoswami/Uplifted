import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useProfile } from '../../hooks/useAccount'
import * as accountApi from '../../api/account'
import { Input } from '../../components/ui/Input'
import { Switch } from '../../components/ui/Switch'
import { Skeleton } from '../../components/ui/Skeleton'
import { ErrorState } from '../../components/ui/ErrorState'
import { Button } from '../../components/ui/Button'
import type { DonorUser } from '../../types'

// TODO(design): payment methods, giving preferences, and notification prefs
// aren't part of the DonorUser/Donor domain types (they're not real API
// resources), so they're kept as local UI state to match the design faithfully.
export default function AccountSettings() {
  const profileQuery = useProfile()

  if (profileQuery.isPending) {
    return (
      <div className="max-w-[640px]">
        <Skeleton className="mb-7 h-9 w-40" />
        <Skeleton className="h-96 w-full" />
      </div>
    )
  }

  if (profileQuery.isError || !profileQuery.data) {
    return (
      <div className="max-w-[640px]">
        <ErrorState title="Couldn't load your settings" onRetry={() => profileQuery.refetch()} />
      </div>
    )
  }

  return <AccountSettingsForm profile={profileQuery.data} />
}

function AccountSettingsForm({ profile }: { profile: DonorUser }) {
  const queryClient = useQueryClient()
  const [name, setName] = useState(profile.name)
  const [email, setEmail] = useState(profile.email)
  const [anonDefault, setAnonDefault] = useState(false)
  const [feeDefault, setFeeDefault] = useState(true)

  const updateMutation = useMutation({
    mutationFn: () => accountApi.updateProfile({ name, email }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['account', 'profile'] }),
  })

  return (
    <div className="max-w-[640px]">
      <h1 className="mb-7 font-display text-[28px] font-semibold text-text">Settings</h1>

      <div className="flex flex-col gap-7">
        <section>
          <div className="mb-3 font-sans text-xs font-semibold uppercase tracking-[0.06em] text-text-2">
            Profile
          </div>
          <div className="flex flex-col gap-3 rounded-[14px] border border-border bg-surface p-4.5">
            <Input value={name} onChange={(e) => setName(e.target.value)} aria-label="Full name" />
            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              aria-label="Email"
            />
            <Button
              size="sm"
              className="self-start"
              disabled={updateMutation.isPending}
              onClick={() => updateMutation.mutate()}
            >
              {updateMutation.isPending ? 'Saving…' : updateMutation.isSuccess ? 'Saved' : 'Save changes'}
            </Button>
          </div>
        </section>

        <section>
          <div className="mb-3 font-sans text-xs font-semibold uppercase tracking-[0.06em] text-text-2">
            Payment methods
          </div>
          <div className="flex flex-col divide-y divide-border rounded-[14px] border border-border bg-surface">
            <div className="flex items-center justify-between px-4.5 py-3.5">
              <span className="font-mono text-[13.5px] text-text">UPI · dhruba@okhdfc</span>
              <span className="font-sans text-xs text-text-2">Default</span>
            </div>
            <div className="flex items-center justify-between px-4.5 py-3.5">
              <span className="font-mono text-[13.5px] text-text">•••• •••• •••• 4821</span>
              <button
                type="button"
                className="cursor-pointer border-none bg-transparent p-0 font-sans text-xs text-primary"
              >
                Remove
              </button>
            </div>
          </div>
        </section>

        <section>
          <div className="mb-3 font-sans text-xs font-semibold uppercase tracking-[0.06em] text-text-2">
            Giving preferences
          </div>
          <div className="flex flex-col divide-y divide-border rounded-[14px] border border-border bg-surface">
            <label className="flex cursor-pointer items-center justify-between px-4.5 py-3.5">
              <span className="font-sans text-sm text-text">Give anonymously by default</span>
              <Switch checked={anonDefault} onChange={(e) => setAnonDefault(e.target.checked)} />
            </label>
            <label className="flex cursor-pointer items-center justify-between px-4.5 py-3.5">
              <span className="font-sans text-sm text-text">Cover transaction fee by default</span>
              <Switch checked={feeDefault} onChange={(e) => setFeeDefault(e.target.checked)} />
            </label>
          </div>
        </section>

        <section>
          <div className="mb-3 font-sans text-xs font-semibold uppercase tracking-[0.06em] text-text-2">
            Notifications
          </div>
          <div className="rounded-[14px] border border-border bg-surface">
            <label className="flex cursor-pointer items-center justify-between px-4.5 py-3.5">
              <span className="font-sans text-sm text-text">Campaign updates by email</span>
              <Switch defaultChecked />
            </label>
          </div>
        </section>

        <section>
          <div className="mb-3 font-sans text-xs font-semibold uppercase tracking-[0.06em] text-danger">
            Danger zone
          </div>
          <div className="flex items-center justify-between rounded-[14px] border border-danger/25 bg-danger/5 p-4.5">
            <span className="font-sans text-sm text-text">Delete my account</span>
            <Button variant="danger" size="sm">
              Delete
            </Button>
          </div>
        </section>
      </div>
    </div>
  )
}
