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

/**
 * Format Date to YYYY-MM-DD string without timezone conversion
 * This ensures the date stays the same regardless of timezone
 */
export function formatDateToString(date: Date | undefined): string {
  if (!date) return '';
  
  // Use local date values to avoid timezone shift
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  
  return `${year}-${month}-${day}`;
}
