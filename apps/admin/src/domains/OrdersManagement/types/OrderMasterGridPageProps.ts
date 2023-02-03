import { OnGridReadyParams } from '@hasty-bazar/admin-shared/core/types'
import { GetOrdersHeaderQueryResult } from '@hasty-bazar/admin-shared/services/saleApi.generated'

export interface gridInformationModel {
  pageNumber?: number
  pageSize: number
}

interface OrderMasterGridPageProps {
  rowData?: GetOrdersHeaderQueryResult
  handleOnGrigReady: (params: OnGridReadyParams) => void
}
export type { OrderMasterGridPageProps }
