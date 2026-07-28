import { db } from '../mocks/db'
import type { Kiosk } from '../types'
import { ApiError, delay } from './client'

export async function listKiosks(): Promise<Kiosk[]> {
  await delay()
  return db.kiosks
}

export async function getKiosk(id: string): Promise<Kiosk> {
  await delay()
  const k = db.kiosks.find((x) => x.id === id)
  if (!k) throw new ApiError(404, 'Kiosk not found', 'KIOSK_NOT_FOUND')
  return k
}

export async function pairKiosk(code: string): Promise<Kiosk> {
  await delay()
  const k = db.kiosks.find((x) => x.pairingCode === code)
  if (!k) throw new ApiError(404, 'Invalid pairing code', 'INVALID_PAIRING_CODE')
  k.online = true
  k.lastHeartbeat = 'just now'
  return k
}

export async function heartbeat(id: string): Promise<Kiosk> {
  await delay(150)
  const k = db.kiosks.find((x) => x.id === id)
  if (!k) throw new ApiError(404, 'Kiosk not found', 'KIOSK_NOT_FOUND')
  k.online = true
  k.lastHeartbeat = 'just now'
  return k
}
