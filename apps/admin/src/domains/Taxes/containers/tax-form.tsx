import { HBRecordHistory } from '@hasty-bazar/admin-shared/containers'
import phrasesMessages from '@hasty-bazar-admin/core/translations/phrases.messages'
import {
  GetTaxTypesQueryResult,
  GetTaxTypeValuesQueryResult,
  usePostAdminGeneralDataTaxTypesByIdValueMutation,
  usePutAdminGeneralDataTaxTypesByIdValueAndValueIdMutation,
} from '@hasty-bazar/admin-shared/services/generalDataApi.generated'
import { HBForm, openToast } from '@hasty-bazar/core'
import { Typography } from '@mui/material'
import { Box } from '@mui/system'
import { Dispatch, SetStateAction } from 'react'
import { useForm } from 'react-hook-form'
import { useIntl } from 'react-intl'
import taxesMessages from '../taxes.messages'
import TaxFormItems from './tax-form-items'

export type TaxFormType = {
  startDate?: string
  expireDate?: string
  percent?: number
  isActive?: boolean
}

type TaxFormProps = {
  taxData?: GetTaxTypeValuesQueryResult
  taxTypeData: GetTaxTypesQueryResult
  setIsOpenAddEditDialog: Dispatch<
    SetStateAction<{ show: boolean; data?: GetTaxTypeValuesQueryResult }>
  >
  refreshGridData: (isClearSearch?: boolean | undefined) => void
}

const TaxForm = ({
  taxTypeData,
  taxData,
  setIsOpenAddEditDialog,
  refreshGridData,
}: TaxFormProps) => {
  const { formatMessage } = useIntl()
  const formProvider = useForm<TaxFormType>({
    mode: 'all',
    defaultValues: { ...taxData, expireDate: taxData?.expireDate || undefined },
  })

  const [createTax, { isLoading: isLoadingCreate }] =
    usePostAdminGeneralDataTaxTypesByIdValueMutation()
  const [editTax, { isLoading: isLoadingEdit }] =
    usePutAdminGeneralDataTaxTypesByIdValueAndValueIdMutation()

  const handleSubmit = (values: TaxFormType) => {
    if (taxData?.id) {
      editTax({
        'client-name': 'Swagger on HIT.Hastim.Catalog.Endpoints.WebApi',
        'client-version': '1.0.1.100',
        id: taxTypeData.id!,
        valueId: taxData.id,
        updateTaxTypeValueModel: {
          ...values,
          isActive: values.isActive,
          percent: +values.percent!,
        },
      }).then((res) => {
        //@ts-ignore
        if (res?.data?.success) {
          refreshGridData()
          openToast({
            message: formatMessage(phrasesMessages.successUpdate),
            type: 'success',
          })
          setIsOpenAddEditDialog({ show: false })
        }
      })
    } else {
      createTax({
        'client-name': 'Swagger on HIT.Hastim.Catalog.Endpoints.WebApi',
        'client-version': '1.0.1.100',
        id: taxTypeData.id!,
        createTaxTypeValueModel: { ...values, percent: +values.percent! },
      }).then((res) => {
        // @ts-ignore
        if (res?.data?.success) {
          refreshGridData()
          openToast({
            message: formatMessage(phrasesMessages.successAdd),
            type: 'success',
          })
          setIsOpenAddEditDialog({ show: false })
        }
      })
    }
  }

  return (
    <HBForm onSubmit={handleSubmit} formProviderProps={formProvider}>
      <Typography color={'GrayText'} mt={2}>
        {formatMessage(taxesMessages.interInformationPlease)}
      </Typography>
      <TaxFormItems isLoadingEdit={isLoadingEdit} isLoadingCreate={isLoadingCreate} />
      <Box mt={4}>
        {taxData?.id && <HBRecordHistory data={taxData} isBorder isShowAccordion showInRows />}
      </Box>
    </HBForm>
  )
}
export default TaxForm
