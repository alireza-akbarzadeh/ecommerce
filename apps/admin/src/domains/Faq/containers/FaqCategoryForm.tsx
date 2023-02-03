import { HBSwitchController } from '@hasty-bazar/admin-shared/containers/HBSwitchController'
import HBTextFieldController from '@hasty-bazar/admin-shared/containers/HBTextFieldController'
import { HBUploadImageController } from '@hasty-bazar/admin-shared/containers/HBUploadImageController'
import phrasesMessages from '@hasty-bazar-admin/core/translations/phrases.messages'
import {
  ApiResult,
  useGetAdminCatalogFaqsCategoryByIdQuery,
  usePostAdminCatalogFaqsCategoryMutation,
  usePutAdminCatalogFaqsCategoryByIdMutation,
} from '@hasty-bazar/admin-shared/services/catalogApi.generated'
import { HBButton, HBDataGrigToolbar, HBDialog, HBForm, openToast } from '@hasty-bazar/core'
import { Box, Grid, Stack, Typography } from '@mui/material'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useIntl } from 'react-intl'
import FaqPageMessages from '../FaqPage.messages'

interface FaqCategoryToolbarProps {
  refetch?: () => void
  id?: string
  setDeleteDialogState: Dispatch<
    SetStateAction<{
      show: boolean
      id?: string | undefined
    }>
  >
}
type FaqCategoryType = {
  id?: string
  name?: string | null
  icon?: string | null
  sortOrderIndex?: number | null
  isActive?: boolean | null
}
const FaqCategoryToolbar = ({ refetch, id, setDeleteDialogState }: FaqCategoryToolbarProps) => {
  const { formatMessage } = useIntl()
  const FormProvider = useForm<FaqCategoryType>()

  const [formDialogState, setFormDialogState] = useState<{ show: boolean; id?: string }>({
    show: false,
  })
  const [postFaqCategory] = usePostAdminCatalogFaqsCategoryMutation()
  const [putFaqCategory] = usePutAdminCatalogFaqsCategoryByIdMutation()

  const { data } = useGetAdminCatalogFaqsCategoryByIdQuery(
    {
      'client-name': 'Swagger on HIT.Hastim.Catalog.Endpoints.AdminApi',
      'client-version': '1.0.1.100',
      id: id as string,
    },
    { skip: !formDialogState.id },
  )

  useEffect(() => {
    if (formDialogState.id) {
      FormProvider.reset({
        ...data?.data,
      })
    } else {
      FormProvider.reset({
        icon: '',
        id: '',
        isActive: false,
        name: '',
        sortOrderIndex: 0,
      })
    }
  }, [data?.data, formDialogState.id])

  const handleSubmit = (values: FaqCategoryType) => {
    const createUpdateModel = {
      ...values,
      name: values?.name as string,
      sortOrderIndex: values?.sortOrderIndex as number,
    }
    if (!formDialogState.id) {
      postFaqCategory({
        'client-name': 'create-FAQ-category',
        'client-version': '1.0.0',
        createQuestionCategoryModel: createUpdateModel,
      }).then((res: { data: ApiResult }) => {
        if (res?.data?.success) {
          openToast({ message: formatMessage(phrasesMessages.successAdd), type: 'success' })
          setFormDialogState({ show: false, id: undefined })
          refetch?.()
          FormProvider.reset({
            icon: '',
            id: '',
            isActive: false,
            name: '',
            sortOrderIndex: 0,
          })
        }
      })
    } else {
      putFaqCategory({
        'client-name': 'update-FAQ-category',
        'client-version': '1.0.0',
        updateQuestionCategoryModel: createUpdateModel,
        id: formDialogState.id as string,
      }).then((res: { data: ApiResult }) => {
        if (res?.data?.success) {
          openToast({ message: formatMessage(phrasesMessages.successUpdate), type: 'success' })
          setFormDialogState({ show: false, id: undefined })
          refetch?.()
        }
      })
    }
  }

  return (
    <>
      <HBDataGrigToolbar
        statusProps={{ show: false }}
        addProps={{
          onClick: () => setFormDialogState({ show: true, id: undefined }),
        }}
        deleteProps={{
          disabled: !id,
          onClick: () => setDeleteDialogState({ show: true, id }),
        }}
        editProps={{
          disabled: !id,
          onClick: () => setFormDialogState({ show: true, id }),
        }}
        moreProps={{ show: false }}
        searchProps={{ show: false }}
        refreshProps={{ onClick: () => refetch?.() }}
      />
      <HBDialog
        title={formatMessage(FaqPageMessages.faqCategoryTitle)}
        open={formDialogState.show}
        onClose={() => setFormDialogState({ show: false, id: undefined })}
      >
        <HBForm<FaqCategoryType>
          onSubmit={handleSubmit}
          formProviderProps={id ? FormProvider : undefined}
          mode="all"
        >
          <Stack display={'flex'} flexDirection={'column'} gap={3}>
            <Grid item container spacing={4}>
              <Grid item xs={12} sm={7} container>
                <Box display={'flex'} flexDirection={'column'} gap={6}>
                  <HBTextFieldController
                    name="name"
                    formRules={{ required: true }}
                    label={formatMessage(FaqPageMessages.categoryTitle)}
                  />
                  <HBTextFieldController
                    type={'number'}
                    name="sortOrderIndex"
                    formRules={{ required: true }}
                    label={formatMessage(FaqPageMessages.sortOrderTitle)}
                    maskOptions={{ mask: Number, min: 1 }}
                  />
                  <Box display={'flex'} gap={2} alignItems={'center'}>
                    <Typography>{formatMessage(FaqPageMessages.isActive)}</Typography>
                    <HBSwitchController name="isActive" />
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={12} sm={5}>
                <Box display={'flex'}>
                  <HBUploadImageController name="icon" formRules={{ required: true }} />
                </Box>
              </Grid>
            </Grid>
            <Grid item xs={6} sx={{ direction: (theme) => theme.direction }} mr={3}>
              <HBButton type="submit">{formatMessage(FaqPageMessages.submit)}</HBButton>
            </Grid>
          </Stack>
        </HBForm>
      </HBDialog>
    </>
  )
}

export default FaqCategoryToolbar
