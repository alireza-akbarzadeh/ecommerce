import { HBAgGridClasses } from '@hasty-bazar/core'
import PlatformCarrierAgrrementsMessages from './PlatformCarrierAgreementSettings.message'

export const contractDetailsColumnsOfGrid = (formatMessage: (params: {}) => string) => {
  return [
    {
      field: 'vendorNationalCode',
      headerName: formatMessage(PlatformCarrierAgrrementsMessages.vendorNationalCode),
      filter: 'agTextColumnFilter',
      maxWidth: 200,
    },
    {
      field: 'vendorMobileNo',
      headerName: formatMessage(PlatformCarrierAgrrementsMessages.vendorMobileNo),
      filter: 'agTextColumnFilter',
      maxWidth: 200,
    },
    {
      field: 'vendorAddress',
      headerName: formatMessage(PlatformCarrierAgrrementsMessages.vendorAddress),
      filter: 'agTextColumnFilter',
      maxWidth: 200,
    },
  ]
}

export const classes: HBAgGridClasses = {
  wrapper: {
    height: `calc(100vh - 240px)`,
  },
}

export const breadcrumbsItems = (formatMessage: (params: {}) => string) => [
  {
    url: '/',
    title: formatMessage(PlatformCarrierAgrrementsMessages.dashboard),
  },
  {
    url: '#',
    title: formatMessage(PlatformCarrierAgrrementsMessages.platformCarrierAgreement),
  },
]
