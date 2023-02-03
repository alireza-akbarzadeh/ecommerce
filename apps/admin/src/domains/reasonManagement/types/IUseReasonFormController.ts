import { GetBusinessTypeValuesByBusinessTypeQueryResult } from '@hasty-bazar/admin-shared/services/generalDataApi.generated'
import { CreateReasonsSettingModel } from '@hasty-bazar/admin-shared/services/saleApi.generated'

export interface IUseReasonFormController extends Omit<CreateReasonsSettingModel, 'userTypeCode'> {
  userTypeCode: GetBusinessTypeValuesByBusinessTypeQueryResult
}
