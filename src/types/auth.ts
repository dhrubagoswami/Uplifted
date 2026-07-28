export type Role = 'donor' | 'admin'

export interface DonorUser {
  role: 'donor'
  id: string
  name: string
  email: string
}

export interface AdminUser {
  role: 'admin'
  id: string
  name: string
  title: string
  org: string
}

export type SessionUser = DonorUser | AdminUser
