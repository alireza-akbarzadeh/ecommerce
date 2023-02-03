import { GetBusinessTypeValuesQueryResultPagedCollectionQueryResultApiResult } from '@hasty-bazar/admin-shared/services/generalDataApi.generated'
import { ICellRendererParams } from 'ag-grid-community'

export interface ParamsValueType extends ICellRendererParams {
  data: GetBusinessTypeValuesQueryResultPagedCollectionQueryResultApiResult
}

export default function BusinessData({ value, data }: ParamsValueType) {
  return data?.data?.items?.find((item) => item.id == value)?.title
}
