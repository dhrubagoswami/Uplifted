import type { DonorUser, AdminUser } from '../../types'

export const CURRENT_DONOR: DonorUser = {
  role: 'donor',
  id: 'dnr_current',
  name: 'Dhruba Goswami',
  email: 'dhruba.goswami@email.com',
}

export const CURRENT_ADMIN: AdminUser = {
  role: 'admin',
  id: 'adm_current',
  name: 'Vikram Menon',
  title: 'Program Director',
  org: 'Saathi Foundation',
}
