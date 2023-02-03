import { HBDataGridClientRef } from '@hasty-bazar/admin-shared/containers/HBDataGrid'
import { GetBusinessTypeValuesByBusinessTypeQueryResult } from '@hasty-bazar/admin-shared/services/generalDataApi.generated'
import { GetDailyReportQueryFilter } from '@hasty-bazar/admin-shared/services/reportApi.generated'
import { GetStatesQueryResult } from '@hasty-bazar/admin-shared/services/workflowApi.generated'
import { RefObject } from 'react'
import { DailyReportRowModal } from './DailyReportRowModal'

interface IDailySaleReportFormModel
  extends Omit<
    GetDailyReportQueryFilter,
    'dateType' | 'dataType' | 'informingType' | 'statusCodes'
  > {
  dateType: GetBusinessTypeValuesByBusinessTypeQueryResult
  dataType: GetBusinessTypeValuesByBusinessTypeQueryResult
  informingType: GetBusinessTypeValuesByBusinessTypeQueryResult
  statusCodes: GetStatesQueryResult[]
}

interface IUseReportDetailedDailySaleColumns {
  selectedRows: DailyReportRowModal[]
}
interface IUseToolbar {
  selectedRows: DailyReportRowModal[]
  gridRef: RefObject<HBDataGridClientRef>
  formWatch: IDailySaleReportFormModel | undefined
}

type DialogType = 'excel' | 'inform' | 'DownloadAUpdate' | false

export type {
  IDailySaleReportFormModel,
  IUseReportDetailedDailySaleColumns,
  IUseToolbar,
  DialogType,
}
