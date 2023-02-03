import phrasesMessages from '@hasty-bazar-admin/core/translations/phrases.messages'
import { HBRecordHistory } from '@hasty-bazar/admin-shared/containers'
import {
  GetIconCategoryTypeResult,
  GetIconCategoryTypeResultApiResult,
  usePostAdminGeneralDataIconCategoryTypesMutation,
  usePutAdminGeneralDataIconCategoryTypesByIdMutation,
} from '@hasty-bazar/admin-shared/services/generalDataApi.generated'
import { HBForm, openToast } from '@hasty-bazar/core'
import { Box } from '@mui/material'
import { Dispatch, SetStateAction } from 'react'
import { useForm } from 'react-hook-form'
import { useIntl } from 'react-intl'
import IconCategoriesFormItems from './icon-categories-form-items'

export type IconCategoriesForm = {
  code?: string | null
  title?: string | null
  isActive?: boolean
}

type IconCategoriesFormProps = {
  iconCategoriesData?: GetIconCategoryTypeResult
  setIsOpenAddEditDialog: Dispatch<
    SetStateAction<{ show: boolean; data?: GetIconCategoryTypeResult }>
  >
  refreshGridData: (isClearSearch?: boolean | undefined) => void
}

const IconCategoriesAddEditForm = ({
  iconCategoriesData,
  setIsOpenAddEditDialog,
  refreshGridData,
}: IconCategoriesFormProps) => {
  const { formatMessage } = useIntl()
  const formProvider = useForm({
    mode: 'all',
    defaultValues: { ...iconCategoriesData },
  })

  const [createIconCategories, { isLoading: isLoadingCreate }] =
    usePostAdminGeneralDataIconCategoryTypesMutation()
  const [editIconCategories, { isLoading: isLoadingEdit }] =
    usePutAdminGeneralDataIconCategoryTypesByIdMutation()

  const handleSubmit = (values: GetIconCategoryTypeResult) => {
    if (iconCategoriesData?.id) {
      editIconCategories({
        'client-name': 'Swagger on HIT.Hastim.Catalog.Endpoints.WebApi',
        'client-version': '1.0.1.100',
        id: iconCategoriesData?.id,
        updateIconCategoryTypeModel: values,
      })
        .unwrap()
        .then((res: GetIconCategoryTypeResultApiResult) => {
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
      createIconCategories({
        'client-name': 'Swagger on HIT.Hastim.Catalog.Endpoints.WebApi',
        'client-version': '1.0.1.100',
        createIconCategoryTypeModel: { ...values, isActive: true },
      })
        .unwrap()
        .then((res: GetIconCategoryTypeResultApiResult) => {
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
      <IconCategoriesFormItems isLoadingCreate={isLoadingCreate} isLoadingEdit={isLoadingEdit} />
      <Box mt={4}>
        {iconCategoriesData?.id && (
          <HBRecordHistory data={iconCategoriesData} isBorder isShowAccordion showInRows />
        )}
      </Box>
    </HBForm>
  )
}
export default IconCategoriesAddEditForm
