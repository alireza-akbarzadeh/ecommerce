import {
  GetBusinessTypeValuesByBusinessTypeQueryResult,
  GetUserSegmentationsQueryResult,
} from '@hasty-bazar/admin-shared/services/generalDataApi.generated'
import { GetVendorsLookupQueryResult } from '@hasty-bazar/admin-shared/services/idrApi.generated'
import { CreateVoucherModel } from '@hasty-bazar/admin-shared/services/saleApi.generated'

export interface IUseReasonFormController
  extends Omit<
    CreateVoucherModel,
    | 'vendorId'
    | 'priceValueType'
    | 'providerType'
    | 'usageType'
    | 'voucherUsageType'
    | 'userSegmentations'
  > {
  vendorId?: GetVendorsLookupQueryResult
  priceValueType: GetBusinessTypeValuesByBusinessTypeQueryResult
  providerType: GetBusinessTypeValuesByBusinessTypeQueryResult
  usageType: GetBusinessTypeValuesByBusinessTypeQueryResult
  voucherUsageType: GetBusinessTypeValuesByBusinessTypeQueryResult
  userSegmentations: GetUserSegmentationsQueryResult[]
}
