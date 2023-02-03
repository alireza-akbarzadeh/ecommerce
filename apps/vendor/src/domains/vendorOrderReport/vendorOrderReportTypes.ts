import { HBDataGridClientRef } from '@hasty-bazar/admin-shared/containers/HBDataGrid'
import { GetSellerProductResult } from '@hasty-bazar/admin-shared/services/saleApi.generated'
import { ICellRendererParams } from 'ag-grid-community'
import { RefObject } from 'react'

interface ProductItemsDataGridProps extends Partial<ICellRendererParams> {
  id?: string
  title?: string
}
type VendorOrderDetailsTypes = {
  gridRef: RefObject<HBDataGridClientRef>
  selectedRows: GetSellerProductResult[]
}

export type { ProductItemsDataGridProps, VendorOrderDetailsTypes }
