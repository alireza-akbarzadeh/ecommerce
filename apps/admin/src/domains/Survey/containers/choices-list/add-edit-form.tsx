import phrasesMessages from '@hasty-bazar-admin/core/translations/phrases.messages'
import { HBRecordHistory } from '@hasty-bazar/admin-shared/containers'
import {
  GetAllSelectionsListQueryResult,
  usePostAdminGeneralDataSelectionsListByIdMutation,
  usePutAdminGeneralDataSelectionsListByIdAndSelectionsListIdMutation,
} from '@hasty-bazar/admin-shared/services/generalDataApi.generated'
import { HBForm, openToast } from '@hasty-bazar/core'
import { Box } from '@mui/material'
import { useRouter } from 'next/router'
import { Dispatch, SetStateAction } from 'react'
import { useForm } from 'react-hook-form'
import { useIntl } from 'react-intl'
import AddEditFormItems from './add-edit-form-items'

type AddEditFormProps = {
  selectionsListData?: GetAllSelectionsListQueryResult
  setIsOpenAddEditDialog: Dispatch<
    SetStateAction<{ show: boolean; data?: GetAllSelectionsListQueryResult }>
  >
  refreshGridData: (isClearSearch?: boolean | undefined) => void
}

const AddEditForm = ({
  selectionsListData,
  setIsOpenAddEditDialog,
  refreshGridData,
}: AddEditFormProps) => {
  const router = useRouter()
  const { formatMessage } = useIntl()
  const formProvider = useForm<GetAllSelectionsListQueryResult>({
    mode: 'all',
    defaultValues: {
      name: selectionsListData?.name,
      value: selectionsListData?.value,
      sortOrder: selectionsListData?.sortOrder,
    },
  })
  const id = router.query.id?.[0] || ''

  const [createSelectionsList, { isLoading: isLoadingCreate }] =
    usePostAdminGeneralDataSelectionsListByIdMutation()
  const [editSelectionsList, { isLoading: isLoadingEdit }] =
    usePutAdminGeneralDataSelectionsListByIdAndSelectionsListIdMutation()

  const handleSubmit = (values: GetAllSelectionsListQueryResult) => {
    if (selectionsListData?.id) {
      editSelectionsList({
        'client-name': 'Swagger on HIT.Hastim.Catalog.Endpoints.WebApi',
        'client-version': '1.0.1.100',
        selectionsListId: selectionsListData.id!,
        id,
        updateSelectionsListModel: { ...values },
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
      createSelectionsList({
        'client-name': 'Swagger on HIT.Hastim.Catalog.Endpoints.WebApi',
        'client-version': '1.0.1.100',
        createSelectionsListModel: values,
        id,
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
    <HBForm<GetAllSelectionsListQueryResult>
      onSubmit={handleSubmit}
      formProviderProps={formProvider}
    >
      <AddEditFormItems
        setIsOpenAddEditDialog={setIsOpenAddEditDialog}
        isLoadingCreate={isLoadingCreate}
        isLoadingEdit={isLoadingEdit}
      />
      <Box mt={4}>
        {selectionsListData?.id && (
          <HBRecordHistory data={selectionsListData} isBorder isShowAccordion showInRows />
        )}
      </Box>
    </HBForm>
  )
}
export default AddEditForm
