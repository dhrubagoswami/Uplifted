import { CURRENT_ADMIN, CURRENT_DONOR } from '../mocks/seed/session'
import type { Role, SessionUser } from '../types'
import { delay } from './client'

export interface LoginParams {
  email: string
  password: string
  role: Role
}

let session: SessionUser | null = null

export async function login(p: LoginParams): Promise<SessionUser> {
  await delay()
  session = p.role === 'admin' ? CURRENT_ADMIN : CURRENT_DONOR
  return session
}

export async function logout(): Promise<void> {
  await delay(150)
  session = null
}

export async function getSession(): Promise<SessionUser | null> {
  await delay(100)
  return session
}
