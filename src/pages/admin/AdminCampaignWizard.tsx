import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useCampaignById } from '../../hooks/useCampaignById'
import { useCreateCampaign, useUpdateCampaign } from '../../hooks/useAdminCampaigns'
import { useCurrency } from '../../hooks/useCurrency'
import { CampaignCard } from '../../components/campaign/CampaignCard'
import { Input } from '../../components/ui/Input'
import { Textarea } from '../../components/ui/Textarea'
import { Select } from '../../components/ui/Select'
import { Switch } from '../../components/ui/Switch'
import { Skeleton } from '../../components/ui/Skeleton'
import { cn } from '../../lib/cn'
import type { Category, Campaign } from '../../types'

const STEP_LABELS = ['Basics', 'Goal & units', 'Story & media', 'Settings', 'Review']
const CATEGORIES: Category[] = [
  'Water',
  'Hunger',
  'Health',
  'Education',
  'Disaster',
  'Animals',
  'Environment',
  'Women & Child',
]

const CURRENT_ORG_ID = 'org_saathi'

interface WizardState {
  title: string
  category: Category
  description: string
  goal: string
  unitLabel: string
  unitCost: string
  story: string
  anonAllowed: boolean
  recurringAllowed: boolean
  kioskVisible: boolean
  feeHandling: boolean
}

const INITIAL_STATE: WizardState = {
  title: 'New water access campaign',
  category: 'Water',
  description: '',
  goal: '500000',
  unitLabel: 'water filter',
  unitCost: '5000',
  story: '',
  anonAllowed: true,
  recurringAllowed: true,
  kioskVisible: true,
  feeHandling: true,
}

function fromCampaign(c: Campaign): WizardState {
  return {
    title: c.title,
    category: c.category,
    description: c.story[0] ?? '',
    goal: String(Math.round(c.goal / 100)),
    unitLabel: c.impactUnit,
    unitCost: String(Math.round(c.unitCost / 100)),
    story: c.story.join('\n\n'),
    anonAllowed: true,
    recurringAllowed: true,
    kioskVisible: true,
    feeHandling: true,
  }
}

export default function AdminCampaignWizard() {
  const { id } = useParams<{ id: string }>()
  const isEdit = !!id
  const campaignQuery = useCampaignById(id)

  if (isEdit && campaignQuery.isPending) {
    return (
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.4fr_1fr]">
        <Skeleton className="h-[460px] w-full" />
        <Skeleton className="h-[380px] w-full" />
      </div>
    )
  }

  return (
    <CampaignWizardForm
      editingCampaign={isEdit ? campaignQuery.data : undefined}
      editingId={id}
    />
  )
}

function CampaignWizardForm({
  editingCampaign,
  editingId,
}: {
  editingCampaign?: Campaign
  editingId?: string
}) {
  const navigate = useNavigate()
  const { format } = useCurrency()
  const createMutation = useCreateCampaign()
  const updateMutation = useUpdateCampaign(editingId ?? '')

  const [step, setStep] = useState(1)
  const [state, setState] = useState<WizardState>(
    editingCampaign ? fromCampaign(editingCampaign) : INITIAL_STATE,
  )

  function update(patch: Partial<WizardState>) {
    setState((s) => ({ ...s, ...patch }))
  }

  const goalNum = (parseInt(state.goal, 10) || 0) * 100
  const unitCostNum = (parseInt(state.unitCost, 10) || 1) * 100
  const unitsCount = Math.round(goalNum / unitCostNum)

  function toParams() {
    return {
      title: state.title,
      orgId: editingCampaign?.orgId ?? CURRENT_ORG_ID,
      category: state.category,
      goal: goalNum,
      impactUnit: state.unitLabel,
      unitCost: unitCostNum,
      daysLeft: editingCampaign?.daysLeft ?? 60,
      story: state.story ? state.story.split('\n\n').filter(Boolean) : [],
    }
  }

  async function saveDraft() {
    if (editingId) {
      await updateMutation.mutateAsync({ ...toParams(), status: 'draft' })
    } else {
      await createMutation.mutateAsync({ ...toParams(), status: 'draft' })
    }
    navigate('/admin/campaigns')
  }

  async function handleNext() {
    if (step < 5) {
      setStep((s) => s + 1)
      return
    }
    if (editingId) {
      await updateMutation.mutateAsync({ ...toParams(), status: 'active' })
    } else {
      await createMutation.mutateAsync({ ...toParams(), status: 'active' })
    }
    navigate('/admin/campaigns')
  }

  const isSaving = createMutation.isPending || updateMutation.isPending

  const previewCampaign: Campaign = {
    id: editingCampaign?.id ?? 'preview',
    slug: editingCampaign?.slug ?? 'new-campaign-preview',
    title: state.title || 'Untitled campaign',
    orgId: editingCampaign?.orgId ?? CURRENT_ORG_ID,
    category: state.category,
    goal: goalNum || 1,
    raised: editingCampaign?.raised ?? Math.round((goalNum || 1) * 0.18),
    donorCount: editingCampaign?.donorCount ?? 12,
    daysLeft: editingCampaign?.daysLeft ?? 60,
    verified: editingCampaign?.verified ?? true,
    urgent: editingCampaign?.urgent ?? false,
    status: editingCampaign?.status ?? 'draft',
    impactUnit: state.unitLabel || 'unit',
    unitCost: unitCostNum,
    story: [],
    updates: [],
    faqs: [],
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.4fr_1fr]">
      <div>
        <div className="mb-6 flex items-center">
          {STEP_LABELS.map((label, i) => {
            const n = i + 1
            const active = n === step
            const done = n < step
            return (
              <div key={label} className={cn('flex items-center', n < 5 && 'flex-1')}>
                <div className="flex flex-col items-center gap-1.5">
                  <div
                    className={cn(
                      'flex h-[26px] w-[26px] items-center justify-center rounded-full font-sans text-[11.5px] font-semibold',
                      done || active ? 'bg-primary text-white' : 'bg-surface-2 text-text-2',
                    )}
                  >
                    {done ? '✓' : n}
                  </div>
                  <div
                    className={cn(
                      'whitespace-nowrap font-sans text-[11px] font-medium',
                      active ? 'text-text' : 'text-text-2',
                    )}
                  >
                    {label}
                  </div>
                </div>
                {n < 5 && (
                  <div className={cn('mx-2 mb-[18px] h-0.5 flex-1', done ? 'bg-primary' : 'bg-border')} />
                )}
              </div>
            )
          })}
        </div>

        <div className="min-h-[400px] rounded-2xl border border-border bg-surface p-7">
          {step === 1 && (
            <div className="flex flex-col gap-4">
              <div>
                <label htmlFor="wizard-title" className="mb-1.5 block font-sans text-[13px] text-text-2">
                  Campaign title
                </label>
                <Input id="wizard-title" value={state.title} onChange={(e) => update({ title: e.target.value })} />
              </div>
              <div>
                <label htmlFor="wizard-category" className="mb-1.5 block font-sans text-[13px] text-text-2">
                  Category
                </label>
                <Select
                  id="wizard-category"
                  value={state.category}
                  onChange={(e) => update({ category: e.target.value as Category })}
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </Select>
              </div>
              <div>
                <label htmlFor="wizard-description" className="mb-1.5 block font-sans text-[13px] text-text-2">
                  Short description
                </label>
                <Textarea
                  id="wizard-description"
                  rows={3}
                  value={state.description}
                  onChange={(e) => update({ description: e.target.value })}
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="flex flex-col gap-4">
              <div>
                <label htmlFor="wizard-goal" className="mb-1.5 block font-sans text-[13px] text-text-2">
                  Funding goal (₹)
                </label>
                <Input
                  id="wizard-goal"
                  value={state.goal}
                  onChange={(e) => update({ goal: e.target.value.replace(/[^0-9]/g, '') })}
                  inputMode="numeric"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="wizard-unit-label" className="mb-1.5 block font-sans text-[13px] text-text-2">
                    Impact unit name
                  </label>
                  <Input
                    id="wizard-unit-label"
                    value={state.unitLabel}
                    onChange={(e) => update({ unitLabel: e.target.value })}
                  />
                </div>
                <div>
                  <label htmlFor="wizard-unit-cost" className="mb-1.5 block font-sans text-[13px] text-text-2">
                    Cost per unit (₹)
                  </label>
                  <Input
                    id="wizard-unit-cost"
                    value={state.unitCost}
                    onChange={(e) => update({ unitCost: e.target.value.replace(/[^0-9]/g, '') })}
                    inputMode="numeric"
                  />
                </div>
              </div>
              <div className="font-sans text-[12.5px] text-primary">
                This goal funds {unitsCount} {state.unitLabel}
                {unitsCount === 1 ? '' : 's'}.
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="flex flex-col gap-4">
              <div className="rounded-xl border-2 border-dashed border-border p-8 text-center font-sans text-[13.5px] text-text-2">
                Drop cover image here
              </div>
              <Textarea
                rows={6}
                placeholder="Full campaign story"
                value={state.story}
                onChange={(e) => update({ story: e.target.value })}
              />
            </div>
          )}

          {step === 4 && (
            <div className="flex flex-col divide-y divide-border">
              <label className="flex cursor-pointer items-center justify-between py-3.5">
                <span className="font-sans text-sm text-text">Allow anonymous gifts</span>
                <Switch checked={state.anonAllowed} onChange={(e) => update({ anonAllowed: e.target.checked })} />
              </label>
              <label className="flex cursor-pointer items-center justify-between py-3.5">
                <span className="font-sans text-sm text-text">Allow recurring gifts</span>
                <Switch
                  checked={state.recurringAllowed}
                  onChange={(e) => update({ recurringAllowed: e.target.checked })}
                />
              </label>
              <label className="flex cursor-pointer items-center justify-between py-3.5">
                <span className="font-sans text-sm text-text">Visible on kiosks</span>
                <Switch checked={state.kioskVisible} onChange={(e) => update({ kioskVisible: e.target.checked })} />
              </label>
              <label className="flex cursor-pointer items-center justify-between py-3.5">
                <span className="font-sans text-sm text-text">Donor covers transaction fee by default</span>
                <Switch checked={state.feeHandling} onChange={(e) => update({ feeHandling: e.target.checked })} />
              </label>
            </div>
          )}

          {step === 5 && (
            <div className="flex flex-col overflow-hidden rounded-xl border border-border">
              {[
                { label: 'Title', value: state.title },
                { label: 'Category', value: state.category },
                { label: 'Goal', value: format(goalNum) },
              ].map((row) => (
                <div
                  key={row.label}
                  className="flex justify-between border-b border-border bg-surface-2 px-4 py-3.5 last:border-b-0"
                >
                  <span className="font-sans text-[13px] text-text-2">{row.label}</span>
                  <span className="font-sans text-[13.5px] font-semibold text-text">{row.value}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-5 flex justify-between">
          <button
            type="button"
            onClick={() => void saveDraft()}
            disabled={isSaving}
            className="rounded-[9px] border border-border px-4.5 py-2.5 font-sans text-[13.5px] font-semibold text-text disabled:opacity-50"
          >
            Save as draft
          </button>
          <div className="flex gap-2.5">
            {step > 1 && (
              <button
                type="button"
                onClick={() => setStep((s) => s - 1)}
                className="rounded-[9px] border border-border px-4.5 py-2.5 font-sans text-[13.5px] font-semibold text-text"
              >
                Back
              </button>
            )}
            <button
              type="button"
              onClick={() => void handleNext()}
              disabled={isSaving}
              className="rounded-[9px] bg-primary px-5 py-2.5 font-sans text-[13.5px] font-semibold text-white disabled:opacity-50"
            >
              {isSaving ? 'Saving…' : step === 5 ? 'Publish campaign' : 'Continue'}
            </button>
          </div>
        </div>
      </div>

      <div>
        <div className="mb-3 font-sans text-xs font-semibold uppercase tracking-[0.06em] text-text-2">
          Live preview
        </div>
        <CampaignCard campaign={previewCampaign} orgName="Saathi Foundation" />
      </div>
    </div>
  )
}
