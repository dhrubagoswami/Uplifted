import type { DonorUser, AdminUser } from '../../types'

export const CURRENT_DONOR: DonorUser = {
  role: 'donor',
  id: 'dnr_current',
  name: 'Ananya Rao',
  email: 'ananya.rao@email.com',
}

export const CURRENT_ADMIN: AdminUser = {
  role: 'admin',
  id: 'adm_current',
  name: 'Vikram Menon',
  title: 'Program Director',
  org: 'Saathi Foundation',
}
