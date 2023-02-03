import { VoucherManagemendDataGridProps } from '@hasty-bazar-admin/domains/voucherManagement/types/VoucherManagemendDataGridProps'
import {
  CheckboxSelectionCallbackParams,
  HeaderCheckboxSelectionCallbackParams,
} from 'ag-grid-community'
import { AgGridReact } from 'ag-grid-react'
import { Dispatch, RefObject, SetStateAction } from 'react'

export interface IUseDiscountCodeGridData {
  gridRef: RefObject<AgGridReact>
  id: string
  refreshGridData: () => void
  setDeleteDialogState: Dispatch<SetStateAction<{ show: boolean; id?: string | undefined }>>
  selectedRows: VoucherManagemendDataGridProps[]
  checkboxSelection: (params: CheckboxSelectionCallbackParams) => boolean
  headerCheckboxSelection: (params: HeaderCheckboxSelectionCallbackParams) => boolean
}
