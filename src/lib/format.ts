export function formatRupiah(amount: number | string): string {
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;

  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(numAmount);
}

export function parseRupiah(rupiahString: string): number {
  const cleanString = rupiahString.replace(/[^0-9]/g, '');
  return parseInt(cleanString) || 0;
}
