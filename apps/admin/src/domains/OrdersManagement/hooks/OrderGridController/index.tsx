import { HBDataGridClientRef } from '@hasty-bazar/admin-shared/containers/HBDataGrid'
import { DownloadMethodType } from '@hasty-bazar/admin-shared/containers/HBDataGrid/useDataGrid'
import phrasesMessages from '@hasty-bazar-admin/core/translations/phrases.messages'
import { GetBusinessTypeValuesQueryResult } from '@hasty-bazar/admin-shared/services/generalDataApi.generated'
import {
  GetOrdersHeaderCsvQueryFilter,
  GetOrdersHeaderQueryFilter,
  usePostAdminSaleOrderCsvMutation,
} from '@hasty-bazar/admin-shared/services/saleApi.generated'
import { GetStatesQueryResult } from '@hasty-bazar/admin-shared/services/workflowApi.generated'
import { HBAgGridClasses, MenuItemProps } from '@hasty-bazar/core'
import { ColDef, RowDoubleClickedEvent } from 'ag-grid-community'
import { RefObject, useCallback, useMemo, useRef, useState } from 'react'
import { useIntl } from 'react-intl'
import useOrderGridData from '../useOrderGridData'
const gridClasses: HBAgGridClasses = {
  wrapper: {
    height: 670,
  },
}

type OrderGridController = {
  modelData: RefObject<GetOrdersHeaderQueryFilter>
  getIds: (val: unknown[]) => void
  userId?: string
}

const OrderGridController = ({ getIds, modelData, userId }: OrderGridController) => {
  const [openActive, setOpenActive] = useState(false)
  const [selectedRows, setSelectedRows] = useState<unknown[]>([])
  const { formatMessage } = useIntl()
  const gridRef = useRef<HBDataGridClientRef>(null)

  const toolbarStatus = useMemo(() => {
    const disabledOnSelected = selectedRows.length > 0
    const disabledOnNoSelected = selectedRows.length === 0

    return { disabledOnSelected, disabledOnNoSelected }
  }, [selectedRows])

  const refreshGridData = useCallback((isClearSearch?: boolean) => {
    gridRef.current?.refreshGridData(isClearSearch)
    gridRef.current!.api.deselectAll()
  }, [])

  const { columnDefs } = useOrderGridData({ refreshGridData, selectedRows })

  const [PostAdminSaleOrderCsv] = usePostAdminSaleOrderCsvMutation()

  const handleDownload = async (props: DownloadMethodType) => {
    const data = {
      dateFilterTypeCode:
        (modelData?.current?.dateFilterTypeCode as GetBusinessTypeValuesQueryResult)?.id || null,
      fromDate: modelData?.current?.fromDate || null,
      toDate: modelData?.current?.toDate || null,
      vendorId: modelData?.current?.vendorId?.length ? getIds(modelData?.current?.vendorId) : [],
      agentId: modelData?.current?.agentId?.length ? getIds(modelData?.current?.agentId) : [],
      productId: modelData?.current?.productId?.length ? getIds(modelData?.current?.productId) : [],
      providerCode: modelData?.current?.providerCode?.length
        ? getIds(modelData?.current?.providerCode)
        : [],
      customerId: !userId
        ? modelData?.current?.customerId?.length
          ? getIds(modelData?.current?.customerId)
          : []
        : [userId],
      bundleId: modelData?.current?.bundleId || undefined,
      ...(modelData?.current?.orderId
        ? { shoppingCartId: modelData?.current?.orderId }
        : { shoppingCartId: undefined }),
      shippingStatusType: modelData?.current?.shippingStatusType?.length
        ? (modelData?.current.shippingStatusType as GetStatesQueryResult[])?.map(
            (item: GetStatesQueryResult) => item.code!,
          )
        : [],
      orderNumber: modelData?.current?.orderNumber,
    }
    const { filterFields, ...res } = props
    const headers = res?.headers?.filter((x) => !['id'].includes(String(x?.nativeName)))
    return await PostAdminSaleOrderCsv({
      'client-name': 'hasty-bazar-admin',
      'client-version': '1.0.0',
      getOrdersHeaderCsvQueryFilter: {
        ...res,
        ...filterFields,
        headers,
        ...(data as GetOrdersHeaderCsvQueryFilter),
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

  const toolbarMoreItems = useMemo<MenuItemProps[]>(() => {
    return userGridToolbarMenu()
  }, [selectedRows])

  const autoGroupColumnDef = useMemo<ColDef>(() => {
    return {
      headerCheckboxSelection: true,
      cellRenderer: 'agGroupCellRenderer',
    }
  }, [])

  const handleChangedSelectedRows = (selectedRows: unknown[]) => {
    setSelectedRows(selectedRows)
  }

  const openInNewTab = (params: RowDoubleClickedEvent) => {
    const newWindow = window.open(
      `/ordersManagement/orderDetails/${params?.data?.id}`,
      '_blank',
      'noopener,noreferrer',
    )
    if (newWindow) newWindow.opener = null
  }

  return {
    columnDefs,
    formatMessage,
    autoGroupColumnDef,
    handleChangedSelectedRows,
    gridRef,
    toolbarStatus,
    selectedRows,
    toolbarMoreItems,
    setOpenActive,
    openActive,
    refreshGridData,
    gridClasses,
    openInNewTab,
  }
}

export default OrderGridController
