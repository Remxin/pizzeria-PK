export function toNumber(value: number | string | null | undefined): number {
  if (value === null || value === undefined) {
    return 0
  }

  return typeof value === 'number' ? value : Number(value)
}
