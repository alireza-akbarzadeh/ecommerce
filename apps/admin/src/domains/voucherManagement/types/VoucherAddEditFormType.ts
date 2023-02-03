import { UseFormGetValues, UseFormSetValue } from 'react-hook-form'
import { IUseReasonFormController } from './IUseReasonFormController'

export interface VoucherAddEditFormType {
  getValues: UseFormGetValues<IUseReasonFormController>
  setValue: UseFormSetValue<IUseReasonFormController>
  watchVoucherUsageType: string
  watchIsActive: boolean
  watchMaxPriceValue: number
  vendor: string
  watchPriceValueType: string
  watchProviderType: string
  watchVoucherValue: number
  id: string
}
