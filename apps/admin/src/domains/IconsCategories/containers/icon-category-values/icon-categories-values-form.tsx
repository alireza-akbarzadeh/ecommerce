import phrasesMessages from '@hasty-bazar-admin/core/translations/phrases.messages'
import { HBRecordHistory } from '@hasty-bazar/admin-shared/containers'
import {
  GetIconCategoryTypeResult,
  GetIconCategoryTypeValueQueryResult,
  GetIconCategoryTypeValueQueryResultApiResult,
  usePostAdminGeneralDataApiIconCategoryTypeValueMutation,
  usePutAdminGeneralDataApiIconCategoryTypeValueByIdMutation,
} from '@hasty-bazar/admin-shared/services/generalDataApi.generated'
import { HBForm, openToast } from '@hasty-bazar/core'
import { Box } from '@mui/system'
import { Dispatch, SetStateAction } from 'react'
import { useForm } from 'react-hook-form'
import { useIntl } from 'react-intl'
import IconCategoriesValuesFormItems from './icon-categories-values-form-items'

export type IconCategoriesValuesFormType = {
  startDate?: string
  expireDate?: string
  percent?: number
  isActive?: boolean
}

type IconCategoriesValuesFormProps = {
  iconCategoriesData: GetIconCategoryTypeResult
  valuesData?: GetIconCategoryTypeValueQueryResult
  setIsOpenAddEditDialog: Dispatch<
    SetStateAction<{ show: boolean; data?: GetIconCategoryTypeValueQueryResult }>
  >
  refreshGridData: (isClearSearch?: boolean | undefined) => void
}

const IconCategoriesValuesAddEditForm = ({
  iconCategoriesData,
  valuesData,
  setIsOpenAddEditDialog,
  refreshGridData,
}: IconCategoriesValuesFormProps) => {
  const { formatMessage } = useIntl()
  const formProvider = useForm({
    mode: 'all',
    defaultValues: { ...valuesData },
  })

  const [createValue, { isLoading: isLoadingCreate }] =
    usePostAdminGeneralDataApiIconCategoryTypeValueMutation()
  const [editValue, { isLoading: isLoadingEdit }] =
    usePutAdminGeneralDataApiIconCategoryTypeValueByIdMutation()

  const handleSubmit = (values: GetIconCategoryTypeValueQueryResult) => {
    const body = {
      name: values.name,
      value: values.value,
      sortOrder: values.sortOrder,
      iconPath: values.iconPath,
    }
    if (valuesData?.id) {
      editValue({
        'client-name': 'Swagger on HIT.Hastim.Catalog.Endpoints.WebApi',
        'client-version': '1.0.1.100',
        id: iconCategoriesData.id!,
        valueId: valuesData?.id,
        updateIconCategoryTypeValueModel: body,
      })
        .unwrap()
        .then((res: GetIconCategoryTypeValueQueryResultApiResult) => {
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
      createValue({
        'client-name': 'Swagger on HIT.Hastim.Catalog.Endpoints.WebApi',
        'client-version': '1.0.1.100',
        id: iconCategoriesData.id,
        createIconCategoryTypeValueModel: { ...values },
      })
        .unwrap()
        .then((res: GetIconCategoryTypeValueQueryResultApiResult) => {
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
      <IconCategoriesValuesFormItems
        isLoadingCreate={isLoadingCreate}
        isLoadingEdit={isLoadingEdit}
      />
      <Box mt={4}>
        {valuesData?.id && (
          <HBRecordHistory data={valuesData} isBorder isShowAccordion showInRows />
        )}
      </Box>
    </HBForm>
  )
}
export default IconCategoriesValuesAddEditForm
