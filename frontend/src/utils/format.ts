export function formatPrice(amount: number): string {
  return `${amount.toFixed(2).replace('.', ',')} zł`
}
