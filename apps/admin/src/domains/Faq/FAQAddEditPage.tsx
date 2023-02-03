import { HBRecordHistory, HBWorkflow } from '@hasty-bazar/admin-shared/containers'
import { HBContentForm } from '@hasty-bazar/admin-shared/containers/HBContentForm'
import { EntityTypeEnums, StateMachineCode } from '@hasty-bazar/admin-shared/core/enums'
import phrasesMessages from '@hasty-bazar-admin/core/translations/phrases.messages'
import {
  ApiResult,
  PanelType,
  QuestionUsageType,
  useGetAdminCatalogFaqsGetStateInfoByStateCodeAndStateMachineCodeFactorQuery as useGetStateInfo,
  useGetAdminCatalogFaqsGetTransitionByEntityIdAndStateMachineCodeFactorQuery as useGetStateList,
  useGetAdminCatalogFaqsQuestionByIdHistoryQuery,
  useGetAdminCatalogFaqsQuestionByIdQuery,
  usePostAdminCatalogFaqsChangeStateMutation,
  usePostAdminCatalogFaqsQuestionMutation,
  usePutAdminCatalogFaqsQuestionByIdMutation,
} from '@hasty-bazar/admin-shared/services/catalogApi.generated'
import { HBForm, HBIcon, openToast } from '@hasty-bazar/core'
import { Box, Grid, Stack, Typography } from '@mui/material'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useIntl } from 'react-intl'
import FAQAddEditForm from './containers/FAQAddEditForm'
import FaqPageMessages from './FaqPage.messages'

export type PanelFieldType = { fullCode: number; title: string }
export type FAQType = {
  questionCategoryId?: string
  number?: number
  questionUsageTypeCode?: number
  sortOrderIndex?: number | null
  sortOrderIndexInFAQ?: number | null
  panelTypeCode?: number[] | null
  questionText?: string | null
  isUseful?: boolean | null
  displayInFAQ?: boolean | null
  shortAnswer?: string | null
  isActive?: boolean
  numberOfNotUseful?: number
  numberOfUseful?: number
  numberOfViews?: number
}
export type FAQFormType = FAQType & {
  id: string
}
const FAQAddEditPage = () => {
  const { formatMessage } = useIntl()
  const FormProvider = useForm<FAQFormType>()

  const router = useRouter()
  const action = router?.query?.action
  const id = router?.query?.id as string
  const questionCategoryId = router.query.questionCategoryId

  const { data, refetch } = useGetAdminCatalogFaqsQuestionByIdQuery(
    {
      'client-name': 'Swagger on HIT.Hastim.Catalog.Endpoints.AdminApi',
      'client-version': '1.0.1.100',
      id,
    },
    { skip: !id },
  )

  useEffect(() => {
    if (id && action === 'edit' && questionCategoryId) {
      let panelTypeCode: PanelFieldType[] = []
      data?.data?.panelTypeCode?.forEach((item, index) => {
        panelTypeCode.push({
          fullCode: item,
          title: data?.data?.panelTypeCodeTitle![index]!,
        })
      })

      FormProvider.reset({
        ...data?.data,
        sortOrderIndexInFAQ: data?.data?.sortOrderIndexInFaq,
        displayInFAQ: data?.data?.displayInFaq,
        //@ts-ignore
        panelTypeCode: panelTypeCode || [],
      })
    }
  }, [data?.data])
  const [putFaq] = usePutAdminCatalogFaqsQuestionByIdMutation()
  const [postFaq] = usePostAdminCatalogFaqsQuestionMutation()

  const handleSubmit = async (values: FAQType) => {
    const createUpdateModel = {
      ...values,
      questionCategoryId: questionCategoryId as string,
      //@ts-ignore
      panelTypeCode: values?.panelTypeCode?.map((i) => i.fullCode) as PanelType[],
      questionUsageTypeCode: values?.questionUsageTypeCode as QuestionUsageType,
      sortOrderIndex: values?.sortOrderIndex ? values.sortOrderIndex : undefined,
      sortOrderIndexInFAQ: values?.sortOrderIndexInFAQ ? values.sortOrderIndexInFAQ : undefined,
    }
    if (!id) {
      postFaq({
        'client-name': 'create-FAQ',
        'client-version': '1.0.0',
        createQuestionModel: createUpdateModel,
      }).then((res: { data: ApiResult }) => {
        if (res?.data?.success) {
          openToast({ message: formatMessage(phrasesMessages.successAdd), type: 'success' })
          router.replace(`/faq/show/?questionCategoryId=${questionCategoryId}`)
        }
      })
    } else {
      putFaq({
        'client-name': 'update-FAQ',
        'client-version': '1.0.0',
        updateQuestionModel: createUpdateModel,
        id,
      }).then((res: { data: ApiResult }) => {
        if (res?.data?.success) {
          openToast({ message: formatMessage(phrasesMessages.successUpdate), type: 'success' })
          router.replace(`/faq/show/?questionCategoryId=${questionCategoryId}`)
        }
      })
    }
  }

  return (
    <>
      <Box
        bgcolor="common.white"
        p={8}
        borderRadius={({ spacing }) => spacing(3)}
        display={'flex'}
        flexDirection={'column'}
        gap={8}
        sx={{
          border: (theme) => `1px solid ${theme.palette.grey[200]}`,
        }}
      >
        <Box display="flex" justifyContent="space-between" alignItems={'center'}>
          <Typography variant="h4" display={'flex'} gap={2} color="text.primary">
            <HBIcon type="shieldQuestion" />
            {formatMessage(FaqPageMessages.faqTitle)}
          </Typography>
          {action === 'edit' && id && (
            <HBWorkflow
              factor="1"
              entityId={id}
              machineCode={StateMachineCode.Faq}
              useGetStateList={useGetStateList}
              useGetState={useGetStateInfo}
              useChangeState={usePostAdminCatalogFaqsChangeStateMutation}
              stateCode={data?.data?.stateCode}
              onChangeState={refetch}
            />
          )}
        </Box>
        <Stack spacing={4}>
          <HBForm<FAQFormType>
            formProviderProps={id ? FormProvider : undefined}
            onSubmit={handleSubmit}
            mode="all"
          >
            <FAQAddEditForm />
          </HBForm>
        </Stack>
      </Box>
      <Grid item xs={12}>
        <HBContentForm
          entityTypeId={EntityTypeEnums.FAQ}
          entityId={id}
          isShowAccordion={true}
          isShowLink={false}
          isShowImage={false}
          isShowVideo={false}
          disabled={!id}
        />
      </Grid>
      <Grid item xs={12} mt={3}>
        <HBRecordHistory
          entityId={id}
          useGetHistory={useGetAdminCatalogFaqsQuestionByIdHistoryQuery}
          isBorder
          isShowAccordion
          disabled={!id}
        />
      </Grid>
    </>
  )
}

export default FAQAddEditPage
