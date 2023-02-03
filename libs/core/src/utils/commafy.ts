export function commafy(value: number | string | null = '', separator = ','): string {
  if (value === null) return ''
  return value?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, separator)
}

export function uncommafy(value = ''): string {
  return value.replace(/,/g, '')
}
