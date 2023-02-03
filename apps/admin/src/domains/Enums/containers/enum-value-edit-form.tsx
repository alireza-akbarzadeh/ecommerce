import { HBRecordHistory } from '@hasty-bazar/admin-shared/containers'
import phrasesMessages from '@hasty-bazar-admin/core/translations/phrases.messages'
import {
  GetBusinessTypeValuesQueryResult,
  usePutAdminGeneralDataBusinessTypeValueByIdMutation,
} from '@hasty-bazar/admin-shared/services/generalDataApi.generated'
import { HBForm, openToast } from '@hasty-bazar/core'
import { Box } from '@mui/material'
import { Dispatch, SetStateAction } from 'react'
import { useForm } from 'react-hook-form'
import { useIntl } from 'react-intl'
import EnumValueEditFormItems from './enum-value-edit-form-items'

type EnumValueEditFormProps = {
  data?: GetBusinessTypeValuesQueryResult
  setIsOpenEditDialog: Dispatch<
    SetStateAction<{ show: boolean; data?: GetBusinessTypeValuesQueryResult }>
  >
  refreshGridData: (isClearSearch?: boolean | undefined) => void
}

const EnumValueEditForm = ({
  data,
  setIsOpenEditDialog,
  refreshGridData,
}: EnumValueEditFormProps) => {
  const { formatMessage } = useIntl()
  const formProvider = useForm<GetBusinessTypeValuesQueryResult>({
    mode: 'all',
    defaultValues: { ...data, colorName: data?.colorName ?? '' },
  })

  const [editEnumValue, { isLoading: isLoadingEdit }] =
    usePutAdminGeneralDataBusinessTypeValueByIdMutation()

  const handleSubmit = (values: GetBusinessTypeValuesQueryResult) => {
    if (data?.id) {
      editEnumValue({
        'client-name': 'Swagger on HIT.Hastim.Catalog.Endpoints.WebApi',
        'client-version': '1.0.1.100',
        id: data.id!,
        updateBusinessTypeValueModel: {
          displayOrder: values.displayOrder ?? undefined,
          iconName: values.iconName,
          colorName: values.colorName,
          isActive: values.isActive ?? true,
        },
      })
        .unwrap()
        .then((res) => {
          if (res?.success) {
            refreshGridData()
            openToast({
              message: formatMessage(phrasesMessages.successUpdate),
              type: 'success',
            })
            setIsOpenEditDialog({ show: false })
          }
        })
    }
  }

  return (
    <>
      <HBForm onSubmit={handleSubmit} formProviderProps={formProvider}>
        <EnumValueEditFormItems isLoadingEdit={isLoadingEdit} />
      </HBForm>
      <Box mt={4}>{data?.id && <HBRecordHistory data={data} isBorder />}</Box>
    </>
  )
}
export default EnumValueEditForm
