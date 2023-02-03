import { AgGridReact } from 'ag-grid-react'
import { RefObject } from 'react'
import { FilterType } from './gridUtil'
import { isServer } from './isServer'

export function downloadExcelUrl(url: string) {
  if (!url || isServer()) return
  const link = document.createElement('a')
  link.href = url
  link.setAttribute('download', 'attributes.xlsx')
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

export function capitalFirstLetter(value: string) {
  if (!isNaN(+value)) return value
  return value?.charAt(0).toUpperCase() + value?.slice(1)
}

function convertOperatorToFilterType(operator: string) {
  switch (operator) {
    case 'equals':
      return 'equal'
    case 'notEqual':
      return '!='
    case 'lessThan':
      return '<'
    case 'lessThanOrEqual':
      return '<='
    case 'greaterThan':
      return '>'
    case 'greaterThanOrEqual':
      return '>='
    default:
      return operator
  }
}

export function getFilterMap(filters: FilterType[]) {
  return filters
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
      const extra = ['blank', 'notBlank', 'inRange', 'empty', 'notEmpty']
      if (basicOperation.includes(item.type)) {
        return `${capitalFirstLetter(item.name)}_${capitalFirstLetter(
          convertOperatorToFilterType(item.type),
        )}_--${capitalFirstLetter(item.name)}`
      } else if (basic.includes(item.type)) {
        if (item.type === 'notContains') {
          return `!${capitalFirstLetter(item.name)}.Contains(--${capitalFirstLetter(item.name)})`
        }
        return `${capitalFirstLetter(item.name)}.${capitalFirstLetter(
          convertOperatorToFilterType(item.type),
        )}(--${capitalFirstLetter(item.name)})`
      } else if (extra.includes(item.type)) {
        if (item.type === 'blank' || item.type === 'empty')
          return `${capitalFirstLetter(item.name)} == null`
        else if (item.type === 'notBlank' || item.type === 'notEmpty')
          return `${capitalFirstLetter(item.name)} != null`
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
}

export function getGridOptions(gridRef: RefObject<AgGridReact>, isDownloadAll?: boolean) {
  const filters: FilterType[] = []
  const filterFields: { [key: string]: any } = {}
  const sortFields: string[] = []
  const pageNumber = gridRef.current?.api?.paginationGetCurrentPage()! + 1
  const pageSize = !isDownloadAll ? gridRef.current?.api?.paginationGetPageSize()! : 1000000
  const filterModel = gridRef.current?.api?.getFilterModel() || {}

  const sortModel =
    gridRef.current?.columnApi
      ?.getColumnState()
      .filter((col) => col.sort)
      ?.map((col) => {
        return {
          colId: col.colId,
          sort: col.sort,
        }
      }) || []
  const headers =
    gridRef.current?.columnApi?.getAllDisplayedColumns().map((col) => {
      return {
        faName: col.getColDef().headerName,
        nativeName: col.getColDef().field,
      }
    }) || []

  const selectedRows = gridRef.current?.api?.getSelectedRows()?.map((item) => item?.id) || []

  Object.keys(filterModel).forEach((item) => {
    if (filterModel[item].filter) {
      filters.push({
        name: item,
        type: filterModel[item].type,
        value:
          filterModel[item].filterType !== 'date'
            ? filterModel[item].filter + ''
            : filterModel[item].dateFrom,
        valueTo: filterModel[item]?.filterTo || null,
      })
      filterFields[capitalFirstLetter(item)] =
        filterModel[item].filterType !== 'date'
          ? filterModel[item].filter + ''
          : filterModel[item].dateFrom
    }
  })

  const filter: string = getFilterMap(filters)
  sortModel.forEach((item: any) => {
    sortFields.push(`${item.colId} ${item.sort}`)
  })

  return {
    pageNumber,
    pageSize,
    headers,
    filter,
    sortFields: sortFields.join(','),
    filterFields,
    selectedRows,
  }
}
