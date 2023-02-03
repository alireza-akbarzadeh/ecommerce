import { HBDataGridClientRef } from '@hasty-bazar/admin-shared/containers/HBDataGrid'
import { GetSellerProductResult } from '@hasty-bazar/admin-shared/services/saleApi.generated'
import { ICellRendererParams } from 'ag-grid-community'
import { RefObject } from 'react'

interface CollectProductGridProps extends Partial<ICellRendererParams> {
  id?: string
  title?: string
}
type useVendorOrderDetailsColumnDefs = {
  gridRef: RefObject<HBDataGridClientRef>
  selectedRows: GetSellerProductResult[]
}

export type { CollectProductGridProps, useVendorOrderDetailsColumnDefs }
