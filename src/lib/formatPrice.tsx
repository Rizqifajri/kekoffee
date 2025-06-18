export function formatPrice(value: number): string {
  return value?.toLocaleString('id-ID', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
}
