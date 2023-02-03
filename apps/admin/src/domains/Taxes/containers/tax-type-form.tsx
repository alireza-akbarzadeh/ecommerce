import { HBRecordHistory } from '@hasty-bazar/admin-shared/containers'
import phrasesMessages from '@hasty-bazar-admin/core/translations/phrases.messages'
import {
  GetTaxTypesQueryResult,
  usePostAdminGeneralDataTaxTypesMutation,
  usePutAdminGeneralDataTaxTypesByIdMutation,
} from '@hasty-bazar/admin-shared/services/generalDataApi.generated'
import { HBForm, openToast } from '@hasty-bazar/core'
import { Box, Typography } from '@mui/material'
import { Dispatch, SetStateAction } from 'react'
import { useForm } from 'react-hook-form'
import { useIntl } from 'react-intl'
import taxesMessages from '../taxes.messages'
import TaxTypeFormItems from './tax-type-form-items'

export type TaxTypeAddEditFormType = {
  code?: string | null
  title?: string | null
  isActive?: boolean
}

type TaxTypeFormProps = {
  taxTypeData?: GetTaxTypesQueryResult
  setIsOpenAddEditDialog: Dispatch<SetStateAction<{ show: boolean; data?: GetTaxTypesQueryResult }>>
  refreshGridData: (isClearSearch?: boolean | undefined) => void
}

const TaxTypeForm = ({
  taxTypeData,
  setIsOpenAddEditDialog,
  refreshGridData,
}: TaxTypeFormProps) => {
  const { formatMessage } = useIntl()
  const formProvider = useForm<TaxTypeAddEditFormType>({
    mode: 'all',
    defaultValues: { ...taxTypeData },
  })
  const [createTaxType, { isLoading: isLoadingCreate }] = usePostAdminGeneralDataTaxTypesMutation()
  const [editTaxType, { isLoading: isLoadingEdit }] = usePutAdminGeneralDataTaxTypesByIdMutation()

  const handleSubmit = (values: TaxTypeAddEditFormType) => {
    if (taxTypeData?.id) {
      editTaxType({
        'client-name': 'Swagger on HIT.Hastim.Catalog.Endpoints.WebApi',
        'client-version': '1.0.1.100',
        id: taxTypeData.id!,
        updateTaxTypeModel: { ...values, isActive: values.isActive },
      })
        .unwrap()
        .then((res) => {
          if (res?.success) {
            refreshGridData()
            openToast({
              message: formatMessage(phrasesMessages.successUpdate),
              type: 'success',
            })
            setIsOpenAddEditDialog({ show: false })
          }
        })
    } else {
      createTaxType({
        'client-name': 'Swagger on HIT.Hastim.Catalog.Endpoints.WebApi',
        'client-version': '1.0.1.100',
        createTaxTypeModel: { ...values },
      })
        .unwrap()
        .then((res) => {
          if (res?.success) {
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
      <TaxTypeFormItems isLoadingCreate={isLoadingCreate} isLoadingEdit={isLoadingEdit} />
      <Box mt={4}>
        {taxTypeData?.id && (
          <HBRecordHistory data={taxTypeData} isBorder isShowAccordion showInRows />
        )}
      </Box>
    </HBForm>
  )
}
export default TaxTypeForm
