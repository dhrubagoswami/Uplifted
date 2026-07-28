export interface Kiosk {
  id: string
  name: string
  online: boolean
  /** integer paise */
  todayTotal: number
  lastHeartbeat: string
  pairingCode: string
}
