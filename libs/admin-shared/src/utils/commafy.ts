export function commafy(value: number | string | null = ''): string {
  if (value === null) return ''
  return value?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

export function uncommafy(value = ''): string {
  return value.replace(/,/g, '')
}
