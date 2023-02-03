import { HBDataGridClientRef } from '@hasty-bazar/admin-shared/containers/HBDataGrid'
import { GetAdminSaleReasonsSettingApiArg } from '@hasty-bazar/admin-shared/services/saleApi.generated'
import {
  CheckboxSelectionCallbackParams,
  HeaderCheckboxSelectionCallbackParams,
} from 'ag-grid-community'
import { RefObject } from 'react'

export type UseReasonGridColumnsControllerType = {
  handleEditVoucher: (val: string) => void
  handleDeleteDialog: () => void
  checkboxSelection: (params: CheckboxSelectionCallbackParams) => boolean
  headerCheckboxSelection: (params: HeaderCheckboxSelectionCallbackParams) => boolean
  selectedRows?: GetAdminSaleReasonsSettingApiArg[]
  gridRef: RefObject<HBDataGridClientRef>
  refreshGridData: () => void
}
