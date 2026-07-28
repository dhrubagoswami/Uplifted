export class ApiError extends Error {
  status: number
  code?: string

  constructor(status: number, message: string, code?: string) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.code = code
  }
}

export const delay = (ms = 300 + Math.random() * 400) => new Promise((r) => setTimeout(r, ms))

let idCounter = 0
export function generateId(prefix: string): string {
  idCounter += 1
  return `${prefix}_${Date.now().toString(36)}${idCounter.toString(36)}`
}

export function generateReceiptNumber(): string {
  const year = new Date().getFullYear()
  const suffix = Math.floor(1000 + Math.random() * 9000)
  return `IF-${year}-${(400000 + idCounter * 7 + suffix).toString().padStart(6, '0')}`
}
