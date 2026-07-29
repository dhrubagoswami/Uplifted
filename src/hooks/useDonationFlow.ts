import { useContext } from 'react'
import { DonationFlowContext, type DonationFlowContextValue } from '../contexts/DonationFlowContext'

export function useDonationFlow(): DonationFlowContextValue {
  const ctx = useContext(DonationFlowContext)
  if (!ctx) throw new Error('useDonationFlow must be used within a DonationFlowProvider')
  return ctx
}
