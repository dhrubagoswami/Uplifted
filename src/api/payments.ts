import { SIMULATE_FAILURE } from '../lib/constants'
import type { PaymentMethod } from '../types'
import { ApiError, delay, generateId } from './client'

export interface PaymentIntent {
  id: string
  /** integer paise */
  amount: number
  method: PaymentMethod
  status: 'requires_confirmation' | 'succeeded' | 'failed'
}

export async function createIntent(amount: number, method: PaymentMethod): Promise<PaymentIntent> {
  await delay()
  return { id: generateId('pi'), amount, method, status: 'requires_confirmation' }
}

export async function confirmPayment(intentId: string): Promise<PaymentIntent> {
  await delay(1500)
  if (SIMULATE_FAILURE) {
    throw new ApiError(402, 'Payment declined by issuer', 'PAYMENT_FAILED')
  }
  return { id: intentId, amount: 0, method: 'UPI', status: 'succeeded' }
}
