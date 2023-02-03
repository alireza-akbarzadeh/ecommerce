import { HBDataGridClientRef } from '@hasty-bazar/admin-shared/containers/HBDataGrid'
import { RefObject, useCallback } from 'react'
import { useIntl } from 'react-intl'
import ProductReportMessage from '../productReport.messages'

function useProductReportGrid(gridRef: RefObject<HBDataGridClientRef>) {
  const { formatMessage } = useIntl()

  const productReportGridColumns = () => {
    return [
      {
        field: 'categoriesInProductsCount',
        headerName: formatMessage(ProductReportMessage.categoriesInProductsCount),
        filter: 'agTextColumnFilter',
        maxWidth: 140,
      },
      {
        field: 'publishedCount',
        headerName: formatMessage(ProductReportMessage.publishedCategoriesCount),
        filter: 'agTextColumnFilter',
      },
      {
        field: 'draftsCount',
        headerName: formatMessage(ProductReportMessage.draftCategoriesCount),
        filter: 'agTextColumnFilter',
      },
      {
        field: 'disabledCount',
        headerName: formatMessage(ProductReportMessage.disableCategoriesCount),
      },
      {
        field: 'vendorsCount',
        headerName: formatMessage(ProductReportMessage.vendorsCount),
        filter: 'agTextColumnFilter',
      },
      {
        field: 'allSubCategoriesCount',
        headerName: formatMessage(ProductReportMessage.allSubCategoriesCount),
        filter: 'agTextColumnFilter',
      },
    ]
  }

  const refreshGridData = useCallback((route?: string[]) => {
    gridRef.current!.api.refreshServerSideStore({
      route,
    })
    gridRef.current!.api.deselectAll()
  }, [])

  return {
    productReportGridColumns,
    refreshGridData,
  }
}

export default useProductReportGrid
