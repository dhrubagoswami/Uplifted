import { createContext, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import type { PaymentMethod } from '../types'

export type DonationFrequency = 'once' | 'monthly'

export interface DonationFlowState {
  step: number
  frequency: DonationFrequency
  selectedChip: number
  customAmount: string
  coverFee: boolean
  donorName: string
  donorEmail: string
  donorPhone: string
  donorPan: string
  anonymous: boolean
  message: string
  method: PaymentMethod
  cardNumber: string
  agreed: boolean
}

export interface DonationFlowContextValue {
  state: DonationFlowState
  update: (patch: Partial<DonationFlowState>) => void
  next: () => void
  back: () => void
  reset: () => void
}

const initialState: DonationFlowState = {
  step: 1,
  frequency: 'once',
  selectedChip: 1,
  customAmount: '',
  coverFee: true,
  donorName: '',
  donorEmail: '',
  donorPhone: '',
  donorPan: '',
  anonymous: false,
  message: '',
  method: 'UPI',
  cardNumber: '',
  agreed: false,
}

export const DonationFlowContext = createContext<DonationFlowContextValue | null>(null)

export function DonationFlowProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<DonationFlowState>(initialState)

  const value = useMemo<DonationFlowContextValue>(
    () => ({
      state,
      update: (patch) => setState((s) => ({ ...s, ...patch })),
      next: () => setState((s) => ({ ...s, step: Math.min(4, s.step + 1) })),
      back: () => setState((s) => ({ ...s, step: Math.max(1, s.step - 1) })),
      reset: () => setState(initialState),
    }),
    [state],
  )

  return <DonationFlowContext.Provider value={value}>{children}</DonationFlowContext.Provider>
}
