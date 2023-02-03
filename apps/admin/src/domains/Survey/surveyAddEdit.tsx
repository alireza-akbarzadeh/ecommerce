import { useRouter } from 'next/router'
import { FC, ReactNode, useEffect, useState } from 'react'
import { useIntl } from 'react-intl'
import surveyMessages from './survey.messages'
import sideBarMessages from '@hasty-bazar-admin/core/translations/sidebar.messages'
import { HBAdminAccordion } from '@hasty-bazar/admin-shared/components'
import { HBIconType, HBSelectProps } from '@hasty-bazar/core'
import {
  GetBusinessTypeValuesQueryResult,
  useGetAdminGeneralDataBusinessTypeValueGetAllQuery,
  useGetAdminGeneralDataSurveyByIdQuery,
} from '@hasty-bazar/admin-shared/services/generalDataApi.generated'
import { BusinessTypeEnums } from '@hasty-bazar/admin-shared/core/enums'
import { BreadCrumbSection } from '@hasty-bazar/admin-shared/components/BreadCrumb'
import { HBRecordHistory } from '@hasty-bazar/admin-shared/containers'
import { AffectedBy, SurveyQuestionsTypes, ChoicesList } from './containers'

type accordionProps = {
  id: number
  title: string
  icon: HBIconType
  expanded?: boolean
  disabled?: boolean
  children: ReactNode
}

export const AnswerType = { Selective: '1109001', Description: '1109002' }
export const AnswerDisplayType = { Icon: '1110001', List: '1110002', Text: '1110003' }

export type SelectBoxOptionsType = HBSelectProps['menuItem']

const SurveyAddEditPage: FC = () => {
  const router = useRouter()
  const id = router.query.id?.[0] || ''
  const { formatMessage } = useIntl()

  const [
    { AnswerTypeCodes, AnswerDisplayTypeCodes, UsageTypeCodes, EffectivedInCodes },
    setBusinessTypes,
  ] = useState<Record<string, SelectBoxOptionsType>>({
    AnswerTypeCodes: [],
    AnswerDisplayTypeCodes: [],
    UsageTypeCodes: [],
    EffectivedInCodes: [],
  })

  const breadcrumbs = [
    {
      url: '/',
      title: formatMessage(sideBarMessages.dashboard),
    },
    {
      url: '/survey',
      title: formatMessage(sideBarMessages.survey),
    },
    {
      url: '#',
      title: id
        ? formatMessage(surveyMessages.editSurvey)
        : formatMessage(surveyMessages.addSurvey),
    },
  ]

  const { data: { data: surveyData = {} } = {}, refetch: refetchSurvey } =
    useGetAdminGeneralDataSurveyByIdQuery(
      {
        'client-name': 'generalData',
        'client-version': '0',
        id,
      },
      {
        skip: !id,
      },
    )

  const accordions: accordionProps[] = [
    {
      id: 1,
      title: formatMessage(surveyMessages.choicesList),
      icon: 'listUl',
      disabled:
        !id ||
        surveyData.answerType === AnswerType.Description ||
        surveyData.answerDisplayType === AnswerDisplayType.Icon,
      children: id && <ChoicesList />,
    },
    {
      id: 2,
      title: formatMessage(surveyMessages.affectedBy),
      icon: 'star',
      disabled: !id || surveyData.answerType === AnswerType.Description,
      children: id && <AffectedBy effectivedInCodes={EffectivedInCodes} />,
    },
  ]

  const { data } = useGetAdminGeneralDataBusinessTypeValueGetAllQuery({
    'client-name': 'generalData',
    'client-version': '0',
    pageSize: 1000,
  })

  const getBusinessTypes = (businessTypes: GetBusinessTypeValuesQueryResult[]) => {
    const convertToSelectData = (
      data: GetBusinessTypeValuesQueryResult[],
    ): SelectBoxOptionsType => {
      return data.map((item) => ({
        title: String(item.title),
        value: item.id || 0,
      }))
    }
    const AnswerTypeCodes = convertToSelectData(
      businessTypes.filter((item) => item.businessTypeId === BusinessTypeEnums.AnswerType + ''),
    )
    const AnswerDisplayTypeCodes = convertToSelectData(
      businessTypes.filter(
        (item) => item.businessTypeId === BusinessTypeEnums.AnswerDisplayType + '',
      ),
    )
    const UsageTypeCodes = convertToSelectData(
      businessTypes.filter((item) => item.businessTypeId === BusinessTypeEnums.UsageType + ''),
    )
    const EffectivedInCodes = convertToSelectData(
      businessTypes.filter((item) => item.businessTypeId === BusinessTypeEnums.EffectivedIn + ''),
    )
    setBusinessTypes({
      AnswerTypeCodes,
      AnswerDisplayTypeCodes,
      UsageTypeCodes,
      EffectivedInCodes,
    })
  }

  useEffect(() => {
    if (data?.data?.items) {
      getBusinessTypes(data.data.items)
    }
  }, [data])

  return (
    <>
      <BreadCrumbSection
        title={formatMessage(surveyMessages.surveyQuestions)}
        breadItems={breadcrumbs}
      />
      <SurveyQuestionsTypes
        surveyData={surveyData}
        refetchSurvey={refetchSurvey}
        answerTypeCodes={AnswerTypeCodes}
        answerDisplayTypeCodes={AnswerDisplayTypeCodes}
        usageTypeCodes={UsageTypeCodes}
      />
      {accordions.map((accordion: accordionProps) => (
        <HBAdminAccordion
          key={accordion.id}
          title={accordion.title}
          icon={accordion.icon}
          expanded={accordion.expanded}
          disabled={accordion.disabled}
          sx={{ borderRadius: 1 }}
        >
          {accordion.children}
        </HBAdminAccordion>
      ))}
      <HBRecordHistory data={surveyData} isBorder isShowAccordion disabled={!id} />
    </>
  )
}
export default SurveyAddEditPage
