import { CommerceLoading } from '@hasty-bazar-commerce/components'
import HBCommerceAccordion from '@hasty-bazar-commerce/components/HBCommerceAccordion'
import { HBInfiniteScroll } from '@hasty-bazar-commerce/components/HBInfiniteScroll'
import { ApiConstants } from '@hasty-bazar-commerce/core/constants'
import useClientSession from '@hasty-bazar-commerce/core/hook/useClientSession'
import {
  GetAllQuestionsQueryResult,
  useLazyGetWebCatalogFaqsQuestionGetAllQuery,
  usePutWebCatalogFaqsQuestionSyncPartyIdByPartyIdAndClientSessionIdMutation,
} from '@hasty-bazar-commerce/services/catalogApi.generated'
import { Stack, Typography, useTheme } from '@mui/material'
import { useSession } from 'next-auth/react'
import { FC, useCallback, useEffect, useState } from 'react'
import { useIntl } from 'react-intl'
import { QuestionsItemResult } from '../components'
import { useFaqContext } from '../context/FaqContext'
import faqMessage from '../faq.message'

const QuestionsList: FC = () => {
  const { formatMessage } = useIntl()
  const [expandedPreview, setExpandedPreview] = useState<number>(-1)
  const [questions, setQuestions] = useState<GetAllQuestionsQueryResult[]>([])
  const theme = useTheme()
  const { categoryId, searchParam } = useFaqContext()
  const [totalCount, setTotalCount] = useState(0)
  const [customPageNumber, setPageNumber] = useState(1)
  const pageSize = 10

  const { data } = useSession()
  const partyId = data?.user.partyId || ''
  const clientSessionId = useClientSession()

  const [refetch, { data: questionsList, isFetching: questionFetching }] =
    useLazyGetWebCatalogFaqsQuestionGetAllQuery()

  const [syncLogedInUserPartyId] =
    usePutWebCatalogFaqsQuestionSyncPartyIdByPartyIdAndClientSessionIdMutation()

  useEffect(() => {
    if (partyId && clientSessionId) {
      syncLogedInUserPartyId({
        ...ApiConstants,
        partyId,
        clientSessionId: clientSessionId || '',
      })
    }
  }, [partyId, clientSessionId])

  const getItems = useCallback(
    async (
      pageNumber: number,
      questionsState: GetAllQuestionsQueryResult[],
      customCategory?: string,
      customSearchParam?: string,
    ) => {
      let filter = 'PanelTypeCode.Contains(--PanelTypeCode)'
      if (customSearchParam)
        filter +=
          ' && QuestionText.Contains(--QuestionText) || ShortAnswer.Contains(--QuestionText)'
      try {
        const questionsRes = await refetch({
          ...ApiConstants,
          questionCategoryId: customCategory,
          questionText: customSearchParam ?? '',
          shortAnswer: customSearchParam ?? '',
          panelTypeCode: '1010003',
          partyId,
          clientSessionId: clientSessionId!,
          filter,
          pageSize,
          pageNumber,
        })
        setTotalCount(questionsRes.data?.data!.totalItems || 0)

        if (pageNumber === 1) {
          questionsRes.data?.data!.items && setQuestions([...questionsRes.data?.data!.items])
        } else {
          questionsRes.data?.data!.items &&
            setQuestions([...questionsState, ...questionsRes.data?.data!.items])
        }
        setPageNumber(pageNumber + 1)
      } catch (error) {}
    },
    [],
  )

  useEffect(() => {
    if (categoryId) {
      getItems(1, [], categoryId, searchParam)
    }
  }, [categoryId, getItems])

  useEffect(() => {
    getItems(1, [], categoryId, searchParam)
  }, [searchParam])

  return (
    <>
      {questionFetching && <CommerceLoading />}
      <Stack direction="row" alignItems="center" mb={6} mt={3}>
        <Typography variant="h4" color="info.dark">
          {formatMessage(faqMessage.asks)}
        </Typography>
        <Typography variant="h4" color="primary.main">
          {formatMessage(faqMessage.common)}
        </Typography>
      </Stack>

      <HBInfiniteScroll
        allCount={totalCount}
        refetchCallback={(pageNumber: number) =>
          getItems(customPageNumber, questions, categoryId, searchParam)
        }
      >
        {questions
          ?.slice()
          .sort((a, b) => (a.sortOrderIndexInFaq || 0) - (b.sortOrderIndexInFaq || 0))
          ?.map((item: GetAllQuestionsQueryResult, index: number) => (
            <HBCommerceAccordion
              title={item.questionText}
              arrowStyle={{
                border: `1px solid ${theme.palette.grey[300]}`,
                borderRadius: theme.spacing(2),
              }}
              headerStyle={{ marginTop: theme.spacing(0.5) }}
              reverseSummary
              expanded={expandedPreview === index}
              onChange={() => {
                setExpandedPreview(index)
              }}
            >
              <QuestionsItemResult {...{ item }} />
            </HBCommerceAccordion>
          ))}
      </HBInfiniteScroll>
    </>
  )
}

export default QuestionsList
