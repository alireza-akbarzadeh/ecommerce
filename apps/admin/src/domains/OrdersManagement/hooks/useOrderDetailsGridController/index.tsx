import { useTheme } from '@mui/material'
import { useCallback, useMemo, useRef, useState } from 'react'
import { useIntl } from 'react-intl'
import { HBDataGridClientRef } from '@hasty-bazar/admin-shared/containers/HBDataGrid'
import { DownloadMethodType } from '@hasty-bazar/admin-shared/containers/HBDataGrid/useDataGrid'
import phrasesMessages from '@hasty-bazar-admin/core/translations/phrases.messages'
import { usePostAdminSaleShipmentBundleByShipmentOrderIdBundlesExcelMutation } from '@hasty-bazar/admin-shared/services/saleApi.generated'
import { HBAgGridClasses, MenuItemProps } from '@hasty-bazar/core'

const useOrderDetailsGridController = (id: string) => {
  const { formatMessage } = useIntl()
  const theme = useTheme()
  const [selectedRows, setSelectedRows] = useState<unknown[]>([])
  const gridRef = useRef<HBDataGridClientRef>(null)

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

  const isRowSelectable = useCallback((rowNode: any) => {
    return rowNode.data ? !rowNode.data.isAdd : true
  }, [])

  const [postAdminSaleShipmentBundleByShipmentOrderIdBundlesExcel] =
    usePostAdminSaleShipmentBundleByShipmentOrderIdBundlesExcelMutation()

  const handleDownload = async (props: DownloadMethodType) => {
    const { filterFields, ...res } = props
    return await postAdminSaleShipmentBundleByShipmentOrderIdBundlesExcel({
      'client-name': 'hasty-bazar-admin',
      'client-version': '1.0.0',
      getShipmentOrderBundlesExcelQueryFilter: {
        ...res,
        ...filterFields,
      },
      shipmentOrderId: id,
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
  const handleChangedSelectedRows = (selectedRows: unknown[]) => {
    setSelectedRows(selectedRows)
  }
  const toolbarMoreItems = useMemo<MenuItemProps[]>(() => {
    return userGridToolbarMenu()
  }, [selectedRows])
  return {
    handleChangedSelectedRows,
    toolbarMoreItems,
    isRowSelectable,
    gridRef,
    classes,
  }
}

export default useOrderDetailsGridController
