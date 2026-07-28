import type { Kiosk } from '../../types'

export const kiosks: Kiosk[] = [
  { id: 'kiosk_1', name: 'Phoenix Mall — Whitefield', online: true, todayTotal: 8_450_000, lastHeartbeat: 'just now', pairingCode: '482913' },
  { id: 'kiosk_2', name: 'Cubbon Park Gate 3', online: true, todayTotal: 3_120_000, lastHeartbeat: '2 min ago', pairingCode: '119482' },
  { id: 'kiosk_3', name: 'Saathi HQ Lobby', online: true, todayTotal: 1_280_000, lastHeartbeat: '1 min ago', pairingCode: '750214' },
  { id: 'kiosk_4', name: 'Indiranagar Metro', online: false, todayTotal: 0, lastHeartbeat: '4h ago', pairingCode: '308871' },
  { id: 'kiosk_5', name: 'Event — TechFest Booth 12', online: true, todayTotal: 15_630_000, lastHeartbeat: 'just now', pairingCode: '625049' },
]
