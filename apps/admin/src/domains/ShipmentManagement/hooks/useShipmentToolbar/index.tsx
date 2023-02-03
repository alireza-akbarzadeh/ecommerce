import { HBDataGridClientRef } from '@hasty-bazar/admin-shared/containers/HBDataGrid'
import { DownloadMethodType } from '@hasty-bazar/admin-shared/containers/HBDataGrid/useDataGrid'
import phrasesMessages from '@hasty-bazar-admin/core/translations/phrases.messages'
import { IUsePaymentInfoGridColumns } from '@hasty-bazar-admin/domains/PaymentInformation/types/IUsePaymentInfoGridColumns'
import {
  usePostAdminSaleShipmentBundleFlatGetAllCsvMutation,
  usePostAdminSaleShipmentBundleGetAllCsvMutation,
} from '@hasty-bazar/admin-shared/services/saleApi.generated'
import { HBDataGridToolbarProps, HBDataGrigToolbar, MenuItemProps } from '@hasty-bazar/core'
import { FC, RefObject, useCallback, useMemo, useState } from 'react'
import { useIntl } from 'react-intl'
import ShipmentManagementMessage from '../../messages'

interface IUseToolbar extends IUsePaymentInfoGridColumns {
  selectedRows: any[]
  gridRef: RefObject<HBDataGridClientRef>
  isProduct: boolean
  handleRemoveFilter: () => void
}

enum ExcelModel {
  stateTitle = 'stateTitle',
}

const useToolbar = ({ selectedRows, gridRef, isProduct, handleRemoveFilter }: IUseToolbar) => {
  const [isDialog, setIsDialog] = useState<boolean>(false)
  const { formatMessage } = useIntl()
  const [postAdminSaleShipmentBundleFlatGetAllCsv] =
    usePostAdminSaleShipmentBundleFlatGetAllCsvMutation()

  const [postAdminSaleShipmentBundleGetAllCsv] = usePostAdminSaleShipmentBundleGetAllCsvMutation()

  const handleDownloadSpecificExcel = async (props: DownloadMethodType) => {
    const { filterFields, ...res } = props
    const filterHeaders = res?.headers?.filter(
      (x) =>
        !['shipmentOrderBundleId', 'relatedProduct', 'stateCode'].includes(String(x?.nativeName)),
    )
    const createFilter = [
      {
        faName: formatMessage(ShipmentManagementMessage.shipmentStatus),
        nativeName: ExcelModel.stateTitle,
      },
    ]
    const headers = filterHeaders && [...filterHeaders, ...createFilter]
    if (isProduct)
      return await postAdminSaleShipmentBundleFlatGetAllCsv({
        'client-name': 'hasty-bazar-admin',
        'client-version': '1.0.0',
        getAllFlatShipmentOrderBundlesCsvQueryFilter: {
          ...res,
          ...filterFields,
          headers,
        },
      })
    return await postAdminSaleShipmentBundleGetAllCsv({
      'client-name': 'hasty-bazar-admin',
      'client-version': '1.0.0',
      getAllFlatShipmentOrderBundlesCsvQueryFilter: {
        ...res,
        ...filterFields,
        headers,
      },
    })
  }
  const handleDownloadPage = (isDownloadAll?: boolean) => {
    gridRef?.current?.downloadGridData({
      downloadFileMethod: handleDownloadSpecificExcel,
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

  const toolbarMoreItems = useMemo<MenuItemProps[]>(() => {
    return userGridToolbarMenu()
  }, [selectedRows])

  const toolBar = useCallback<FC<HBDataGridToolbarProps>>(
    (props) => {
      return (
        <HBDataGrigToolbar
          addProps={{
            show: false,
          }}
          deleteProps={{
            show: false,
          }}
          editProps={{
            show: false,
          }}
          statusProps={{ show: false }}
          items={toolbarMoreItems}
          searchProps={{
            show: false,
          }}
          refreshProps={{ onClick: () => handleRemoveFilter() }}
          {...props}
        ></HBDataGrigToolbar>
      )
    },
    [selectedRows],
  )
  return { toolBar, isDialog, setIsDialog }
}

export default useToolbar
