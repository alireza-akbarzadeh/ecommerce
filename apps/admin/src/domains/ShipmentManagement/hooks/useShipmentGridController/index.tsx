import { HBDataGridClientRef } from '@hasty-bazar/admin-shared/containers/HBDataGrid'
import ReportDailySaleMessages from '@hasty-bazar-admin/domains/ReportDailySale/ReportDailySale.messages'
import { GetAllProductsQueryResult } from '@hasty-bazar/admin-shared/services/catalogApi.generated'
import { HBAgGridClasses } from '@hasty-bazar/core'
import { ColDef } from 'ag-grid-community'
import { useCallback, useMemo, useRef, useState } from 'react'
import { useIntl } from 'react-intl'
import { IShipmentData } from '../../types'
import useShipmentGridWithOutProductColumns from '../useShipmentGridWithOutProductColumns'
import useShipmentGridWithProductColumns from '../useShipmentGridWithProductColumns'
const classes: HBAgGridClasses = {
  wrapper: {
    height: 630,
  },
}
const useShipmentGridController = (shippingData?: IShipmentData | undefined) => {
  const [selectedRows, setSelectedRows] = useState<GetAllProductsQueryResult[]>([])
  const { formatMessage } = useIntl()
  const gridRef = useRef<HBDataGridClientRef>(null)
  const handleChangedSelectedRows = (selectedRows: GetAllProductsQueryResult[]) => {
    setSelectedRows(selectedRows)
  }
  const refreshGridData = useCallback((isClearSearch?: boolean) => {
    gridRef.current?.refreshGridData(isClearSearch)
    gridRef.current!.api.deselectAll()
  }, [])
  const { columnDefs: columnsWithOutProduct } = useShipmentGridWithOutProductColumns(
    selectedRows,
    refreshGridData,
  )
  const autoGroupColumnDef = useMemo<ColDef>(() => {
    return {
      headerCheckboxSelection: true,
      cellRenderer: 'agGroupCellRenderer',
    }
  }, [])
  const { columnDefs: columnsWithProduct } = useShipmentGridWithProductColumns()
  const withProduct = useMemo(
    () => [
      {
        deliveryAddress: formatMessage(ReportDailySaleMessages.totalOnThePage),
        vendorShare: shippingData?.pagedVendorDemand ?? 0,
        packagingAmount: shippingData?.pagedPackagingAmount ?? 0,
        customerShare: shippingData?.pagedCustomerShare ?? 0,
        platformShare: shippingData?.pagedPlatformShare ?? 0,
        originalPrice: shippingData?.pagedOriginalPrice ?? 0,
        finalPrice: shippingData?.pagedFinalPrice ?? 0,
        vendorDemand: shippingData?.pagedVendorDemand ?? 0,
        discountPrice: shippingData?.pagedDiscountPrice ?? 0,
        shippingAmount: shippingData?.pagedShipmentAmount ?? 0,
      },
      {
        deliveryAddress: formatMessage(ReportDailySaleMessages.total),
        packagingAmount: shippingData?.totalPackagingAmount ?? 0,
        vendorShare: shippingData?.totalVendorShare ?? 0,
        customerShare: shippingData?.totalCustomerShare ?? 0,
        platformShare: shippingData?.totalPlatformShare ?? 0,
        originalPrice: shippingData?.totalOriginalPrice ?? 0,
        finalPrice: shippingData?.totalFinalPrice ?? 0,
        vendorDemand: shippingData?.totalVendorDemand ?? 0,
        discountPrice: shippingData?.totalDiscountPrice ?? 0,
        shippingAmount: shippingData?.totalShipmentAmount ?? 0,
      },
    ],
    [shippingData],
  )

  const withOutProduct = useMemo(
    () => [
      {
        deliveryAddress: formatMessage(ReportDailySaleMessages.totalOnThePage),
        vendorShare: shippingData?.pagedVendorDemand ?? 0,
        customerShare: shippingData?.pagedCustomerShare ?? 0,
        platformShare: shippingData?.pagedPlatformShare ?? 0,
        vendorDemand: shippingData?.pagedVendorDemand ?? 0,
        packagingAmount: shippingData?.pagedPackagingAmount ?? 0,
        shippingAmount: shippingData?.pagedShipmentAmount ?? 0,
      },
      {
        deliveryAddress: formatMessage(ReportDailySaleMessages.total),
        vendorShare: shippingData?.totalVendorShare ?? 0,
        customerShare: shippingData?.totalCustomerShare ?? 0,
        platformShare: shippingData?.totalPlatformShare ?? 0,
        vendorDemand: shippingData?.totalVendorDemand ?? 0,
        packagingAmount: shippingData?.totalPackagingAmount ?? 0,
        shippingAmount: shippingData?.totalShipmentAmount ?? 0,
      },
    ],
    [shippingData],
  )
  return {
    columnsWithProduct: [...columnsWithOutProduct, ...columnsWithProduct],
    columnsWithOutProduct: columnsWithOutProduct?.filter((_, index) => index != 9 && index != 10),
    classes,
    handleChangedSelectedRows,
    gridRef,
    selectedRows,
    withProduct,
    refreshGridData,
    autoGroupColumnDef,
    withOutProduct,
  }
}
export default useShipmentGridController
