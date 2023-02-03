import { HBDataGridClientRef } from '@hasty-bazar/admin-shared/containers/HBDataGrid'
import {
  GetBusinessTypeValuesByBusinessTypeQueryResult,
  GetUserSegmentationQueryResult,
  GetUserSegmentationQueryResultApiResult,
  GetUserSegmentationResultsQueryResult,
} from '@hasty-bazar/admin-shared/services/generalDataApi.generated'
import {
  CheckboxSelectionCallbackParams,
  HeaderCheckboxSelectionCallbackParams,
} from 'ag-grid-community'
import { Dispatch, RefObject, SetStateAction } from 'react'

export interface IUserCategories {
  id?: string
}

export interface IQueryResult {
  isDirty: boolean
  listCreationType: GetBusinessTypeValuesByBusinessTypeQueryResult | undefined
  data: GetUserSegmentationQueryResultApiResult | undefined
}
export interface IQueryResultData {
  gridRef: RefObject<HBDataGridClientRef>
  refreshGridData: () => void
  setDeleteDialogState: Dispatch<SetStateAction<{ show: boolean; id?: string | undefined }>>
  selectedRows: GetUserSegmentationResultsQueryResult[]
  checkboxSelection: (params: CheckboxSelectionCallbackParams) => boolean
  headerCheckboxSelection: (params: HeaderCheckboxSelectionCallbackParams) => boolean
  setOpenActive: Dispatch<SetStateAction<boolean>>
  data?: GetUserSegmentationQueryResult | undefined
}
