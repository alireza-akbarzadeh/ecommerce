import { default as phrasesMessages } from '@hasty-bazar-vendor/core/translations/phrases.messages'
import { HBDataGridClientRef } from '@hasty-bazar/admin-shared/containers/HBDataGrid'
import {
  GetSellerProductResult,
  useGetAdminSaleVendorFinancialReportProductsQuery,
} from '@hasty-bazar/admin-shared/services/saleApi.generated'
import { HBAgGridClasses } from '@hasty-bazar/core'
import { ColDef } from 'ag-grid-community'
import { useMemo, useRef, useState } from 'react'
import { useIntl } from 'react-intl'
import vendorFinancialReportMessages from '../vendorFinancialReport.messages'

const classes: HBAgGridClasses = {
  wrapper: {
    height: `calc(100vh - 220px)`,
  },
}
const useVendorFinancialReportController = () => {
  const [selectedRows, setSelectedRows] = useState<GetSellerProductResult[]>([])
  const [selectedValue, setSelectedValue] = useState<{ label: string; value: string }[]>()
  const gridRef = useRef<HBDataGridClientRef>(null)
  const { formatMessage } = useIntl()
  const url = `${process.env.NEXT_PUBLIC_GATEWAY}/Admin/sale/vendor/FinancialReport?VendorId=1035787876652023808`
  const [actionUrl, setActionUrl] = useState<string>(url)
  const handleChangedSelectedRows = (selectedRows: GetSellerProductResult[]) => {
    setSelectedRows(selectedRows)
  }

  const onFilterChange = (params: { label: string; value: string }[]) => {
    setSelectedValue(params)
    setActionUrl(
      `${url}${
        params?.length
          ? `${params
              ?.map((item) => `&ProductId=${item.value}`)
              .toString()
              .replace(',', '')}`
          : ''
      }`,
    )
  }

  const autoGroupColumnDef = useMemo<ColDef>(() => {
    return {
      headerCheckboxSelection: true,
      cellRenderer: 'agGroupCellRenderer',
    }
  }, [])

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
      title: formatMessage(vendorFinancialReportMessages.VendorFinancialReport),
    },
  ]

  const { data: { data: product = [] } = {} } = useGetAdminSaleVendorFinancialReportProductsQuery({
    'client-name': 'Swagger on HIT.Hastim.Sale.Endpoints.AdminApi',
    'client-version': '1.0.1.100',
    vendorId: '1036140740608000000',
  })

  return {
    actionUrl,
    classes,
    autoGroupColumnDef,
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

export default useVendorFinancialReportController
