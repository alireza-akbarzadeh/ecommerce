import { CommissionCalculationMethod } from '@hasty-bazar/admin-shared/core/enums'
import phrasesMessages from '@hasty-bazar-admin/core/translations/phrases.messages'
import { HBAgGridClasses } from '@hasty-bazar/core'
import { ICellRendererParams } from 'ag-grid-community'
import CommissionSettingMessages from './CommissionSetting.message'

export const createBreadcrumbs = (formatMessage: (params: {}) => string) => [
  {
    url: '/',
    title: formatMessage(CommissionSettingMessages.dashboard),
  },
  {
    url: '#',
    title: formatMessage(CommissionSettingMessages.commissionSetting),
  },
]

export const classes: HBAgGridClasses = {
  wrapper: {
    height: `calc(100vh - 240px)`,
  },
}

export const descriptionColumns = (formatMessage: (params: {}) => string) => {
  return [
    {
      field: 'description',
      headerName: formatMessage(CommissionSettingMessages.description),
      minWidth: 150,
      filter: 'agTextColumnFilter',
    },
  ]
}
export const gridColumns = (formatMessage: (params: {}) => string) => {
  return [
    {
      field: 'id',
      headerName: formatMessage(phrasesMessages.id),
      hide: true,
      filter: 'agTextColumnFilter',
    },
    {
      field: 'number',
      headerName: formatMessage(CommissionSettingMessages.code),
      minWidth: 200,
      filter: 'agTextColumnFilter',
    },
    {
      field: 'commissionTypeTitle',
      headerName: formatMessage(CommissionSettingMessages.typeOfCommissionCalculation),
      minWidth: 180,
      filter: 'agTextColumnFilter',
    },
    {
      field: 'categoryTitle',
      headerName: formatMessage(CommissionSettingMessages.productGrouping),
      minWidth: 150,
      filter: 'agTextColumnFilter',
    },
    {
      field: 'productTitle',
      headerName: formatMessage(CommissionSettingMessages.product),
      minWidth: 160,
      filter: 'agTextColumnFilter',
    },
    {
      field: 'brandTitle',
      headerName: formatMessage(CommissionSettingMessages.productBrand),
      filter: 'agTextColumnFilter',
    },
    {
      field: 'vendorTitle',
      headerName: formatMessage(CommissionSettingMessages.seller),
      minWidth: 130,
      filter: 'agTextColumnFilter',
    },
    {
      field: 'calculationTypeTitle',
      headerName: formatMessage(CommissionSettingMessages.calculationMethod),
      minWidth: 150,
      filter: 'agTextColumnFilter',
    },
    {
      field: 'startDate',
      headerName: formatMessage(CommissionSettingMessages.startDate),
      minWidth: 150,
      filter: 'agTextColumnFilter',
      cellRenderer: (params: ICellRendererParams) => {
        return params.value
          ? new Date(params.value).toLocaleDateString('fa-IR', {
              month: '2-digit',
              day: '2-digit',
              year: 'numeric',
            })
          : '-'
      },
    },
    {
      field: 'endDate',
      headerName: formatMessage(CommissionSettingMessages.endDate),
      minWidth: 150,
      filter: 'agTextColumnFilter',
      cellRenderer: (params: ICellRendererParams) => {
        return params.value
          ? new Date(params.value).toLocaleDateString('fa-IR', {
              month: '2-digit',
              day: '2-digit',
              year: 'numeric',
            })
          : '-'
      },
    },
    {
      field: 'targetValue',
      headerName: formatMessage(CommissionSettingMessages.targetValue),
      minWidth: 130,
      filter: 'agTextColumnFilter',
      cellRenderer: (params: ICellRendererParams) => {
        return params?.data?.calculationType == CommissionCalculationMethod.Percentage
          ? `% ${params.value}`
          : params.value.toLocaleString()
      },
    },
    {
      field: 'minCommissionPrice',
      headerName: formatMessage(CommissionSettingMessages.minCommission),
      minWidth: 150,
      filter: 'agTextColumnFilter',
      cellRenderer: (params: ICellRendererParams) => {
        return params.value ? params.value.toLocaleString() : '-'
      },
    },
    {
      field: 'maxCommissionPrice',
      headerName: formatMessage(CommissionSettingMessages.maxCommission),
      minWidth: 150,
      filter: 'agTextColumnFilter',
      cellRenderer: (params: ICellRendererParams) => {
        return params.value ? params.value.toLocaleString() : '-'
      },
    },
  ]
}
