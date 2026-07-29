import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Enter a valid email'),
  password: z.string().min(1, 'Password is required'),
})
export type LoginFormValues = z.infer<typeof loginSchema>

export const signupSchema = z.object({
  name: z.string().min(1, 'Full name is required'),
  email: z.string().min(1, 'Email is required').email('Enter a valid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})
export type SignupFormValues = z.infer<typeof signupSchema>

export const donorDetailsSchema = z.object({
  donorName: z.string(),
  donorEmail: z.string().min(1, 'Email is required').email('Enter a valid email'),
  donorPhone: z
    .string()
    .min(1, 'Phone number is required')
    .regex(/^\d{10}$/, 'Enter a 10-digit phone number'),
  donorPan: z
    .string()
    .regex(/^([A-Z]{5}\d{4}[A-Z])?$/, 'Enter a valid PAN (e.g. ABCDE1234F)')
    .optional()
    .or(z.literal('')),
  anonymous: z.boolean(),
})
export type DonorDetailsValues = z.infer<typeof donorDetailsSchema>

export const cardPaymentSchema = z.object({
  cardNumber: z
    .string()
    .min(1, 'Card number is required')
    .regex(/^\d{13,19}$/, 'Enter a valid card number'),
})
export type CardPaymentValues = z.infer<typeof cardPaymentSchema>
