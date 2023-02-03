import { HBRecordHistory } from '@hasty-bazar/admin-shared/containers'
import phrasesMessages from '@hasty-bazar-admin/core/translations/phrases.messages'
import {
  GetBankQueryResult,
  usePostAdminGeneralDataBankMutation,
  usePutAdminGeneralDataBankByIdMutation,
} from '@hasty-bazar/admin-shared/services/generalDataApi.generated'
import { HBForm, openToast } from '@hasty-bazar/core'
import { Box } from '@mui/material'
import { Dispatch, SetStateAction } from 'react'
import { useForm } from 'react-hook-form'
import { useIntl } from 'react-intl'
import BankAddEditFormItems from './bank-add-edit-form-items'

type AddEditFormProps = {
  bankData?: GetBankQueryResult
  setIsOpenAddEditDialog: Dispatch<SetStateAction<{ show: boolean; data?: GetBankQueryResult }>>
  refreshGridData: (isClearSearch?: boolean | undefined) => void
}

const AddEditForm = ({ bankData, setIsOpenAddEditDialog, refreshGridData }: AddEditFormProps) => {
  const { formatMessage } = useIntl()
  const formProvider = useForm<GetBankQueryResult>({
    mode: 'all',
    defaultValues: { ...bankData },
  })
  const [createBank, { isLoading: isLoadingCreate }] = usePostAdminGeneralDataBankMutation()
  const [editBank, { isLoading: isLoadingEdit }] = usePutAdminGeneralDataBankByIdMutation()

  const handleSubmit = (values: GetBankQueryResult) => {
    if (bankData?.id) {
      editBank({
        'client-name': 'Swagger on HIT.Hastim.Catalog.Endpoints.WebApi',
        'client-version': '1.0.1.100',
        id: bankData.id!,
        updateBankMdoel: { ...values, isActive: values.isActive },
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
      createBank({
        'client-name': 'Swagger on HIT.Hastim.Catalog.Endpoints.WebApi',
        'client-version': '1.0.1.100',
        createBankMdoel: { ...values, isActive: true },
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
      <BankAddEditFormItems isLoadingEdit={isLoadingEdit} isLoadingCreate={isLoadingCreate} />
      <Box mt={4}>
        {bankData?.id && <HBRecordHistory data={bankData} isBorder isShowAccordion showInRows />}
      </Box>
    </HBForm>
  )
}
export default AddEditForm
