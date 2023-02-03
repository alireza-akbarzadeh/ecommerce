import { HBDataGridClientRef } from '@hasty-bazar/admin-shared/containers/HBDataGrid'
import { default as phrasesMessages } from '@hasty-bazar-vendor/core/translations/phrases.messages'
import {
  GetSellerProductResult,
  useGetAdminSaleShipmentBundleGetSellerProductsQuery,
} from '@hasty-bazar/admin-shared/services/saleApi.generated'
// import { useGetAdminSaleShipmentBundleGetSellerProductsQuery } from '@hasty-bazar-admin/services/saleApi.generated'
// import { useGetAdminSaleShipmentBundleGetSellerProductsQuery } from '@hasty-bazar-vendor/services/saleApi.generated'
// import {
//   GetSellerProductResult,
//   useGetAdminSaleShipmentBundleGetSellerProductsQuery,
// } from '@hasty-bazar-admin/services/saleApi.generated'
import { HBAgGridClasses } from '@hasty-bazar/core'
import { useRef, useState } from 'react'
import { useIntl } from 'react-intl'
import vendorOrderReportMessages from '../vendorOrderReportMessages'

const classes: HBAgGridClasses = {
  wrapper: {
    height: `calc(100vh - 220px)`,
  },
}
const useVendorOrderDetailsController = () => {
  const [selectedRows, setSelectedRows] = useState<GetSellerProductResult[]>([])
  const [selectedValue, setSelectedValue] = useState<{ label: string; value: string }>()
  const gridRef = useRef<HBDataGridClientRef>(null)
  const { formatMessage } = useIntl()
  const url = `${process.env.NEXT_PUBLIC_GATEWAY}/Admin/sale/ShipmentBundle/get-daily-report?VendorId=1035787876652023808`
  const [actionUrl, setActionUrl] = useState<string>(url)
  const handleChangedSelectedRows = (selectedRows: GetSellerProductResult[]) => {
    setSelectedRows(selectedRows)
  }

  const onFilterChange = (params: { label: string; value: string }) => {
    setSelectedValue(params)
    setActionUrl(`${url}${params?.value ? `&ProductId=${params?.value}` : ''}`)
  }

  const refreshGridData = (isClearSearch?: boolean) => {
    gridRef.current?.refreshGridData(isClearSearch)
    gridRef.current!.api.deselectAll()
  }

  const breadcrumbs = [
    {
      url: '/',
      title: formatMessage(phrasesMessages.admin),
    },
    {
      url: '#',
      title: formatMessage(vendorOrderReportMessages.vendorOrderReport),
    },
  ]

  const { data: { data: { items: product = [] } = {} } = {} } =
    useGetAdminSaleShipmentBundleGetSellerProductsQuery({
      'client-name': 'Swagger on HIT.Hastim.Sale.Endpoints.AdminApi',
      'client-version': '1.0.1.100',
      vendorId: '1036140740608000000',
    })

  return {
    actionUrl,
    classes,
    handleChangedSelectedRows,
    gridRef,
    breadcrumbs,
    refreshGridData,
    selectedRows,
    formatMessage,
    product,
    onFilterChange,
    selectedValue,
  }
}

export default useVendorOrderDetailsController
