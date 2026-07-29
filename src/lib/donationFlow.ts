export const CHIP_AMOUNTS = [50000, 200000, 500000, 2500000]
export const FEE_RATE = 0.021

export function computeAmount(selectedChip: number, customAmount: string): number {
  const custom = parseInt(customAmount, 10)
  if (custom > 0) return custom * 100
  return CHIP_AMOUNTS[selectedChip]
}
