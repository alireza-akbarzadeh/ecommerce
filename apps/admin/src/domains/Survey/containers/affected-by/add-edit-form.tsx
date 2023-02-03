import phrasesMessages from '@hasty-bazar-admin/core/translations/phrases.messages'
import { HBRecordHistory } from '@hasty-bazar/admin-shared/containers'
import {
  GetAllInfluensesQueryResult,
  usePostAdminGeneralDataInfluensByIdMutation,
  usePutAdminGeneralDataInfluensByIdAndInfluensIdMutation,
} from '@hasty-bazar/admin-shared/services/generalDataApi.generated'
import { HBForm, openToast } from '@hasty-bazar/core'
import { Box } from '@mui/material'
import { useRouter } from 'next/router'
import { Dispatch, SetStateAction } from 'react'
import { useForm } from 'react-hook-form'
import { useIntl } from 'react-intl'
import { SelectBoxOptionsType } from '../../surveyAddEdit'
import AddEditFormItems from './add-edit-form-items'

type AddEditFormProps = {
  influensData?: GetAllInfluensesQueryResult
  effectivedInCodes: SelectBoxOptionsType
  setIsOpenAddEditDialog: Dispatch<
    SetStateAction<{ show: boolean; data?: GetAllInfluensesQueryResult }>
  >
  refreshGridData: (isClearSearch?: boolean | undefined) => void
}

const AddEditForm = ({
  influensData,
  effectivedInCodes,
  setIsOpenAddEditDialog,
  refreshGridData,
}: AddEditFormProps) => {
  const router = useRouter()
  const { formatMessage } = useIntl()
  const formProvider = useForm<GetAllInfluensesQueryResult>({
    mode: 'all',
    defaultValues: {
      effectivedIn: influensData?.effectivedIn,
      impactRate: influensData?.impactRate,
    },
  })
  const id = router.query.id?.[0] || ''
  const [createInfluens, { isLoading: isLoadingCreate }] =
    usePostAdminGeneralDataInfluensByIdMutation()
  const [editInfluens, { isLoading: isLoadingEdit }] =
    usePutAdminGeneralDataInfluensByIdAndInfluensIdMutation()

  const handleSubmit = async (
    values: GetAllInfluensesQueryResult & {
      [key: string]: { title?: string; value?: string }
    },
  ) => {
    const body = {
      impactRate: Number(values.impactRate),
      effectivedIn:
        typeof values.effectivedIn === 'object' && values.effectivedIn !== null
          ? values.effectivedIn['value']
          : values.effectivedIn,
    }

    if (influensData?.id) {
      editInfluens({
        'client-name': 'Swagger on HIT.Hastim.Catalog.Endpoints.WebApi',
        'client-version': '1.0.1.100',
        id,
        influensId: influensData.id!,
        updateInfluensModel: body,
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
      createInfluens({
        'client-name': 'Swagger on HIT.Hastim.Catalog.Endpoints.WebApi',
        'client-version': '1.0.1.100',
        createInfluensModel: body,
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
    <HBForm<GetAllInfluensesQueryResult> onSubmit={handleSubmit} formProviderProps={formProvider}>
      <AddEditFormItems
        effectivedInCodes={effectivedInCodes}
        setIsOpenAddEditDialog={setIsOpenAddEditDialog}
        isLoadingCreate={isLoadingCreate}
        isLoadingEdit={isLoadingEdit}
      />
      <Box mt={4}>
        {influensData?.id && (
          <HBRecordHistory data={influensData} isBorder isShowAccordion showInRows />
        )}
      </Box>
    </HBForm>
  )
}
export default AddEditForm
