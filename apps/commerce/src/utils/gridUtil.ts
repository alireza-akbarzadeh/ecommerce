import { IServerSideGetRowsRequest, SortModelItem } from 'ag-grid-community'

export type FilterType = {
  name: string
  type: string
  value: string
  valueTo?: string
}

function getFilter(params: IServerSideGetRowsRequest, pageSize: number) {
  const page = params.endRow ? params.endRow / pageSize : 0
  const { filterModel, sortModel } = params
  const filters: FilterType[] = []
  const filterFields: { [key: string]: any } = {}
  const sortFields: string[] = []
  const sortDirection: string[] = []

  Object.keys(filterModel).forEach((item) => {
    filters.push({
      name: item,
      type: filterModel[item].type,
      value:
        filterModel[item].filterType !== 'date'
          ? filterModel[item].filter
          : filterModel[item].dateFrom,
      valueTo: filterModel[item]?.filterTo || null,
    })
    filterFields[capitalFirstLetter(item)] =
      filterModel[item].filterType !== 'date'
        ? filterModel[item].filter
        : filterModel[item].dateFrom
  })

  sortModel.forEach((item: SortModelItem) => {
    sortFields.push(`${item.colId} ${item.sort}`)
  })

  const filter: string = filters
    .map((item: FilterType) => {
      const basicOperation = [
        'equals',
        'notEqual',
        'lessThan',
        'lessThanOrEqual',
        'greaterThan',
        'greaterThanOrEqual',
      ]
      const basic = ['contains', 'notContains', 'startsWith', 'endsWith']
      const extra = ['blank', 'notBlank', 'inRange']
      if (basicOperation.includes(item.type)) {
        return `${capitalFirstLetter(item.name)}_${capitalFirstLetter(
          item.type === 'equals' ? 'equal' : item.type,
        )}_--${capitalFirstLetter(item.name)}`
      } else if (basic.includes(item.type)) {
        return `${capitalFirstLetter(item.name)}.${capitalFirstLetter(
          item.type,
        )}(--${capitalFirstLetter(item.name)})`
      } else if (extra.includes(item.type)) {
        if (item.type === 'blank') return `${capitalFirstLetter(item.name)} == null`
        else if (item.type === 'notBlank') return `${capitalFirstLetter(item.name)} != null`
        else
          return `${capitalFirstLetter(item.name)}_GreaterThan_${
            item.value
          }_And_${capitalFirstLetter(item.name)}_LessThan_${item.valueTo}`
      }
      return `${capitalFirstLetter(item.name)}.${capitalFirstLetter(
        item.type,
      )}(--${capitalFirstLetter(item.name)})`
    })
    .join(' And ')

  const options = {
    PageNumber: page,
    PageSize: pageSize,
    Ordering: sortFields.join(','),
    Filter: filter,
    ...filterFields,
  }

  return serialize(options, null)
}

function serialize(obj: { [key: string]: any }, prefix: any) {
  const str = []
  for (const p in obj)
    if (obj.hasOwnProperty(p) && obj[p]) {
      str.push(encodeURIComponent(p) + '=' + encodeURIComponent(obj[p]))
    }
  return str.join('&')
}

function capitalFirstLetter(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1)
}

export { getFilter }
