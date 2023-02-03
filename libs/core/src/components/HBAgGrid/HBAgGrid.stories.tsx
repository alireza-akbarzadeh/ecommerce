/* eslint-disable no-prototype-builtins */
import { Box, Typography } from '@mui/material'
import { ArgTypes, Meta, Story } from '@storybook/react'
import { GridReadyEvent, IServerSideDatasource, IServerSideGetRowsParams } from 'ag-grid-community'
import { useCallback, useState } from 'react'
import { MenuItemProps } from '../HBGridHeader'
import { HBIcon } from '../HBIcon'
import HBAgGrid, { HBAgGridProps } from './HBAgGrid'
import HBAgGridDoc from './HBAgGrid.doc'

const argTypes: ArgTypes<HBAgGridProps> = {}

export default {
  component: HBAgGrid,
  parameters: {
    docs: {
      page: HBAgGridDoc,
    },
    options: {
      showPanel: true,
    },
    design: {
      type: 'figma',
      title: 'Figma Grid',
      url: 'https://www.figma.com/file/tIp9Yhjx94GIs8x8z4puKL/Ag-Grids?node-id=1%3A824',
    },
  },
  title: 'core/HBAgGrid',
  argTypes,
} as Meta<HBAgGridProps>

const PasswordElement = ({ icon, title, color }) => {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <HBIcon type={icon} style={{ color }} size="small" />
      <Typography variant="subtitle2">{title}</Typography>
    </Box>
  )
}

const GetPasswordCustom = ({ value }) => {
  if (value === 0) return <PasswordElement icon="check" title="تنظیم شده" color="green" />
  else if (value === 2) return <PasswordElement icon="clockNine" title="منقضی شده" color="red" />
  else if (value === 1)
    return <PasswordElement icon="timesCircle" title="تنظیم نشده" color="black" />
  return <div>{value}</div>
}

const StatusElement = ({ value }) => {
  return (
    <Box>
      {value ? (
        <Box
          component="span"
          sx={{
            color: (theme) => theme.palette.success.main,
            backgroundColor: (theme) => theme.palette.success.light,
            padding: 1,
            borderRadius: 2,
          }}
        >
          فعال
        </Box>
      ) : (
        <Box
          component="span"
          sx={{
            color: (theme) => theme.palette.error.main,
            backgroundColor: (theme) => theme.palette.error.light,
            padding: 1,
            borderRadius: 2,
          }}
        >
          غیرفعال
        </Box>
      )}
    </Box>
  )
}

const DateElement = ({ value }) => {
  const date = new Date(value || '').toLocaleDateString()
  return <span>{date}</span>
}

const columnDefs = [
  {
    field: 'id',
    headerName: 'شناسه',
    filter: 'agNumberColumnFilter',
    // floatingFilterComponent: NumberFloatingFilter,
  },
  { field: 'firstName', headerName: 'نام', filter: 'agTextColumnFilter' },
  { field: 'lastName', headerName: 'نام خانوادگی', filter: 'agTextColumnFilter' },
  { field: 'mobile', headerName: 'شماره موبایل', filter: 'agTextColumnFilter' },
  { field: 'email', headerName: 'ایمیل', filter: 'agTextColumnFilter' },
  {
    field: 'statePassword',
    headerName: 'رمزعبور',
    cellRenderer: GetPasswordCustom,
  },
  {
    field: 'createdOn',
    headerName: 'تاریخ ایجاد',
    filter: 'agDateColumnFilter',
    cellRenderer: DateElement,
  },
  {
    field: 'stateCode',
    headerName: 'وضعیت',
    cellRenderer: StatusElement,
    filter: 'agSetColumnFilter',
    maxWidth: 100,
  },
]

const defaultColDef = {
  editable: true,
  floatingFilter: true,
  flex: 1,
  floatingFilterComponentParams: {
    suppressFilterButton: true,
  },
}

const toolbarActions: MenuItemProps[] = [
  { label: 'اضافه', icon: 'plus' },
  {
    label: 'دانلود',
    icon: 'import',
    children: [
      { label: 'دانلود ورد', icon: 'import' },
      { label: 'دانلود اکسل', icon: 'import' },
    ],
  },
  { label: 'به روزرسانی', icon: 'sync' },
  { label: 'ویرایش', icon: 'editAlt' },
  { label: 'تاریخچه', icon: 'historyAlt' },
  { label: 'حذف', icon: 'trashAlt' },
  {
    label: 'بیشتر',
    icon: 'ellipsisH',
    variant: 'text',
    children: [{ label: 'بیشتر' }, { label: 'افزودن سطر' }],
  },
]

const Template: Story<HBAgGridProps> = ({ ...args }) => {
  const [pageSize, setPageSize] = useState(50)
  const [totalRows, setTotalRows] = useState<number>()

  const handleChangePageSize = (pageSize: number) => {
    setPageSize(pageSize)
  }

  const getServerSideDatasource: (server: any) => IServerSideDatasource = (server: any) => {
    return {
      getRows: (params: IServerSideGetRowsParams) => {
        const queries = getFilter(params.request, pageSize)

        fetch(`https://devgateway.hasti.co/IDR/parties/?${queries}`)
          .then((httpResponse) => httpResponse.json())
          .then((response) => {
            setTotalRows(response.data.totalItems)

            params.success({
              rowData: response.data.items,
              rowCount: response.data.totalItems,
            })
          })
          .catch((error) => {
            params.fail()
          })
      },
    }
  }

  const onGridReady = useCallback((params: GridReadyEvent) => {
    const datasource = getServerSideDatasource(params)
    params.api!.setServerSideDatasource(datasource)
  }, [])

  return (
    <HBAgGrid
      {...args}
      columnDefs={columnDefs}
      defaultColDef={defaultColDef}
      rowSelection="multiple"
      enableRangeSelection
      suppressRowClickSelection
      rowDragManaged
      pagination
      paginationPageSize={pageSize}
      cacheBlockSize={pageSize}
      // sideBar={'columns'}
      toolbarActions={toolbarActions}
      totalRows={totalRows}
      rowModelType={'serverSide'}
      serverSideStoreType={'partial'}
      onGridReady={onGridReady}
      onPageSize={handleChangePageSize}
    />
  )
}

export const Primary: Story<HBAgGridProps> = Template.bind({})
Primary.args = {}

function getFilter(params, pageSize) {
  const page = params.endRow / pageSize
  const { filterModel, sortModel } = params
  const filters = []
  const filterFields = {}
  const sortFields = []
  const sortDirection = []

  Object.keys(filterModel).forEach((item) => {
    filters.push({
      name: item,
      type: filterModel[item].type,
      value:
        filterModel[item].filterType !== 'date'
          ? filterModel[item].filter
          : filterModel[item].dateFrom,
    })
    filterFields[item] =
      filterModel[item].filterType !== 'date'
        ? filterModel[item].filter
        : filterModel[item].dateFrom
  })

  sortModel.forEach((item) => {
    sortFields.push(item.colId)
    sortDirection.push(cfl(item.sort))
  })

  const filter: string = filters
    .map((item) => `${item.name}.${cfl(item.type)}(@${item.name})`)
    .join(' And ')
  const options = {
    PageNumber: page,
    PageSize: pageSize,
    SortPropertyName: sortFields.join(','),
    SortDirection: sortDirection.join(','),
    Filter: filter,
    ...filterFields,
  }

  // console.log(filters, filter, 'filtersssssssssssssssssssssssssssss')

  return serialize(options, null)
}

function serialize(obj: object, prefix) {
  const str = []
  // eslint-disable-next-line no-prototype-builtins
  for (const p in obj)
    if (obj.hasOwnProperty(p) && obj[p]) {
      str.push(encodeURIComponent(p) + '=' + encodeURIComponent(obj[p]))
    }
  return str.join('&')
}

function cfl(string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
}
