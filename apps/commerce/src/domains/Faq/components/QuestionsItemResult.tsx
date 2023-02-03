import { ApiConstants } from '@hasty-bazar-commerce/core/constants'
import {
  GetAllQuestionsQueryResult,
  usePutWebCatalogFaqsQuestionNumberOfViewByIdMutation,
} from '@hasty-bazar-commerce/services/catalogApi.generated'
import { HBIcon } from '@hasty-bazar/core'
import { Box, Typography } from '@mui/material'
import { useRouter } from 'next/router'
import { FC } from 'react'
import { useIntl } from 'react-intl'
import { ReactionConst } from '../containers/QuestionsDetailComment'
import faqMessage from '../faq.message'

interface IProps {
  item: GetAllQuestionsQueryResult
}

const QuestionsItemResult: FC<IProps> = ({ item }) => {
  const { formatMessage } = useIntl()
  const router = useRouter()
  const [updateNumberOfViews] = usePutWebCatalogFaqsQuestionNumberOfViewByIdMutation()

  const callNumberOfView = () => {
    updateNumberOfViews({
      ...ApiConstants,
      id: item.id!,
    }).then((res: any) => {
      const commentResult = item.hasPartyLike
        ? ReactionConst.liked
        : item.hasPartyDislike
        ? ReactionConst.disLiked
        : ReactionConst.noSelected
      if (router.query.from === 'footerPage') {
        item.isUseful &&
          router.push(
            `faq/${item.id}/${item.isUseful}?from=footerPage&commentResult=${commentResult}`,
          )
        !item.isUseful &&
          router.push(`faq/${item.id}?from=footerPage&commentResult=${commentResult}`)
        return
      }
      item.isUseful && router.push(`faq/${item.id}/${item.isUseful}?commentResult=${commentResult}`)
      !item.isUseful && router.push(`faq/${item.id}?commentResult=${commentResult}`)
    })
  }

  return (
    <>
      <Typography
        variant="subtitle2"
        dangerouslySetInnerHTML={{ __html: item.shortAnswer?.replace(/\n/g, '<br />') || '' }}
      ></Typography>
      {item.isSeeAdditionalInformation && (
        <Typography
          variant="subtitle2"
          color="info.main"
          mt={3}
          display="flex"
          alignItems="center"
          sx={{ cursor: 'pointer' }}
          onClick={() => callNumberOfView()}
        >
          {formatMessage(faqMessage.viewAdditionalDetails)}
          <Box color="info.main">
            <HBIcon type="angleLeft" />
          </Box>
        </Typography>
      )}
    </>
  )
}

export default QuestionsItemResult
