export function removeEmptyFields<T = any>(
  data: Record<string, any>,
  options?: {
    exclude: Array<keyof T>
  },
): T {
  const newData: Record<string, any> = {}
  Object.keys(data || {}).forEach((key) => {
    if (options?.exclude.includes(key as keyof T)) {
      newData[key] = data[key]
    } else if (data[key] !== undefined && data[key] !== null && data[key] !== '') {
      newData[key] = data[key]
    }
  })

  return newData as T
}
