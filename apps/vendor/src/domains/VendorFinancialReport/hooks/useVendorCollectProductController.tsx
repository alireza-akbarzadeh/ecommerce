import phrasesMessages from '@hasty-bazar-vendor/core/translations/phrases.messages'
import { HBDataGridClientRef } from '@hasty-bazar/admin-shared/containers/HBDataGrid'
import { DownloadMethodType } from '@hasty-bazar/admin-shared/containers/HBDataGrid/useDataGrid'
import {
  GetSellerProductResult,
  usePostAdminSaleVendorFinancialReportDetailExcelMutation,
} from '@hasty-bazar/admin-shared/services/saleApi.generated'
import { HBAgGridClasses, MenuItemProps } from '@hasty-bazar/core'
import { useTheme } from '@mui/material'
import { useMemo, useRef, useState } from 'react'
import { useIntl } from 'react-intl'
const useVendorProductItemsController = (pickupDate: string) => {
  const gridRef = useRef<HBDataGridClientRef>(null)
  const [selectedRows, setSetSelectedRows] = useState<GetSellerProductResult[]>()
  const { formatMessage } = useIntl()

  const theme = useTheme()

  const classes: HBAgGridClasses = {
    wrapper: {
      backgroundColor: `${theme.palette.common.white} !important`,
      height: 300,
      '& .ag-layout-normal .ag-header': {
        backgroundColor: `${theme.palette.grey[100]} !important`,
        border: 'unset',
      },
      '&>div:last-child': {
        padding: theme.spacing(3),
        borderRadius: 2,
        backgroundColor: theme.palette.grey[100],
      },
      '& div.ag-root-wrapper': {
        border: 'unset',
      },
    },
  }

  const refreshGridData = (isClearSearch?: boolean) => {
    gridRef.current?.refreshGridData(isClearSearch)
    gridRef.current!.api.deselectAll()
  }

  const [postAdminSaleVendorFinancialReportDetail] =
    usePostAdminSaleVendorFinancialReportDetailExcelMutation()

  const handleDownload = async (props: DownloadMethodType) => {
    const { filterFields, ...res } = props
    return await postAdminSaleVendorFinancialReportDetail({
      'client-name': 'hasty-bazar-admin',
      'client-version': '1.0.0',
      financialReportDetailQueryFilter: {
        ...res,
        ...filterFields,
        vendorId: '1035787876652023808',
        pickupDate,
      },
    })
  }
  const handleDownloadPage = (isDownloadAll?: boolean) => {
    gridRef?.current?.downloadGridData({
      downloadFileMethod: handleDownload,
      downloadAll: isDownloadAll,
    })
  }

  const userGridToolbarMenu = (): MenuItemProps[] => {
    return [
      {
        label: formatMessage(phrasesMessages.download),
        icon: 'fileDownload',
        onClick: handleDownloadPage,
      },
      {
        label: formatMessage(phrasesMessages.downloadAll),
        icon: 'fileDownloadAlt',
        onClick: () => handleDownloadPage(true),
      },
    ]
  }

  const handleChangedSelectedRows = (selectedRows: GetSellerProductResult[]) => {
    setSetSelectedRows(selectedRows)
  }

  const toolbarMoreItems = useMemo<MenuItemProps[]>(() => {
    return userGridToolbarMenu()
  }, [selectedRows])

  return {
    gridRef,
    refreshGridData,
    classes,
    toolbarMoreItems,
    handleChangedSelectedRows,
  }
}

export default useVendorProductItemsController
