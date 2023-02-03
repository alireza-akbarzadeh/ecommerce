import {
  GetSurveyQueryResult,
  GetSurveyQueryResultApiResult,
  useGetAdminGeneralDataIconCategoryTypesGetAllQuery,
  usePostAdminGeneralDataSurveyMutation,
  usePutAdminGeneralDataSurveyByIdMutation,
} from '@hasty-bazar/admin-shared/services/generalDataApi.generated'
import { HBForm, openToast } from '@hasty-bazar/core'
import { Box } from '@mui/material'
import { isEmpty } from 'lodash'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useIntl } from 'react-intl'
import surveyMessages from '../../survey.messages'
import { SelectBoxOptionsType } from '../../surveyAddEdit'
import SurveyQuestionsFormItems from './survey-questions-form-items'

type SurveyQuestionsTypesProps = {
  surveyData: GetSurveyQueryResult
  refetchSurvey: () => void
  answerTypeCodes: SelectBoxOptionsType
  answerDisplayTypeCodes: SelectBoxOptionsType
  usageTypeCodes: SelectBoxOptionsType
}

const SurveyQuestionsTypes = (props: SurveyQuestionsTypesProps) => {
  const { surveyData, refetchSurvey, answerTypeCodes, answerDisplayTypeCodes, usageTypeCodes } =
    props
  const router = useRouter()
  const { formatMessage } = useIntl()
  const id = router.query.id?.[0] || ''
  const formProvider = useForm<GetSurveyQueryResult>({
    mode: 'all',
    defaultValues: {
      minCountSelectCharacter: '1',
      maxCountSelectCharacter: '1',
    },
  })

  const [createSurvey] = usePostAdminGeneralDataSurveyMutation()
  const [updateSurvey] = usePutAdminGeneralDataSurveyByIdMutation()

  const { data: { data: { items: iconCategoryData = [] } = {} } = {} } =
    useGetAdminGeneralDataIconCategoryTypesGetAllQuery({
      'client-name': 'generalData',
      'client-version': '0',
      pageSize: 1000,
    })

  useEffect(() => {
    if (!isEmpty(surveyData)) {
      formProvider.reset({
        answerTypeTitle: surveyData.answerTypeTitle,
        answerType: surveyData.answerType,
        name: surveyData.name,
        answerDisplayType: surveyData.answerDisplayType,
        answerDisplayTypeTitle: surveyData.answerDisplayTypeTitle,
        iconCategoryTypeName: surveyData.iconCategoryTypeName,
        iconCategoryTypeId: surveyData.iconCategoryTypeId,
        usageType: surveyData.usageType,
        usageTypeTitle: surveyData.usageTypeTitle,
        minCountSelectCharacter: surveyData.minCountSelectCharacter,
        maxCountSelectCharacter: surveyData.maxCountSelectCharacter,
        stateCode: surveyData.stateCode,
      })
    }
  }, [surveyData])

  const handleSubmit = async (
    values: GetSurveyQueryResult & {
      [key: string]: { title?: string; value?: string; id?: string }
    },
  ) => {
    const serverData = values
    Object.keys(serverData).forEach((key: string) => {
      if (typeof serverData[key] === 'object' && serverData[key] !== null) {
        serverData[key as keyof GetSurveyQueryResult] =
          serverData[key]?.id || serverData[key]?.value
      }
    })

    const body = {
      ...serverData,
      iconCategoryTypeId: serverData?.iconCategoryTypeId || null,
    }

    if (!id) {
      createSurvey({
        'client-name': 'create-survey',
        'client-version': '1.0.0',
        createSurveyModel: body,
      })
        .unwrap()
        .then((res: GetSurveyQueryResultApiResult) => {
          if (res?.success) {
            openToast({
              message: formatMessage(surveyMessages.surveyAddedSuccessfully),
              type: 'success',
            })
            router.replace(`/survey/edit/${res.data?.id}`)
          }
        })
    } else {
      updateSurvey({
        'client-name': 'update-survey',
        'client-version': '1.0.0',
        id,
        updateSurveyModel: body,
      })
        .unwrap()
        .then((res: GetSurveyQueryResultApiResult) => {
          if (res?.success) {
            openToast({
              message: formatMessage(surveyMessages.surveyUpdatedSuccessfully),
              type: 'success',
            })
            refetchSurvey()
          }
        })
    }
  }

  return (
    <Box>
      <HBForm<GetSurveyQueryResult>
        onSubmit={handleSubmit}
        formProviderProps={formProvider}
        sx={{ background: (theme) => theme.palette.background.paper, padding: 4, borderRadius: 1 }}
      >
        <SurveyQuestionsFormItems
          iconCategoryData={iconCategoryData}
          answerTypeCodes={answerTypeCodes}
          answerDisplayTypeCodes={answerDisplayTypeCodes}
          usageTypeCodes={usageTypeCodes}
          refetchSurvey={refetchSurvey}
        />
      </HBForm>
    </Box>
  )
}
export default SurveyQuestionsTypes
