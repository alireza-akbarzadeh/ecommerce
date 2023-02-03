export function convertDataToSelectItems<T extends object = any>(
  data: T[] = [],
  valueName: keyof T,
  titleName: keyof T,
  filterName?: keyof T,
  filterValue?: any,
) {
  return data
    .filter((item) => {
      if (filterName && filterValue) {
        return item[filterName as keyof typeof item] === filterValue
      }
      return true
    })
    .map(({ [valueName]: value, [titleName]: title }) => ({
      value: value || '',
      title: title || '',
    })) as Array<{ title: string; value: string | number }>
}
