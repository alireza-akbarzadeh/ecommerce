import { CommentRecommendation, RateChip, TextWithHBIcon } from '@hasty-bazar-commerce/components'
import { HBLoginChecker, recommendationTypeItems } from '@hasty-bazar-commerce/containers'
import { ApiConstants } from '@hasty-bazar-commerce/core/constants'
import { usePostWebSocialCommentsByCommentIdCommentReactionMutation } from '@hasty-bazar-commerce/Service-Enhancers/CommentApi.enhances'
import { GetAllProductCommentsQueryResult } from '@hasty-bazar-commerce/services/socialApi.generated'
import { openToast } from '@hasty-bazar/core'
import { Divider, Stack, Typography } from '@mui/material'
import Image from 'next/image'
import { FC, useMemo } from 'react'
import { FormattedDate, FormattedMessage, useIntl } from 'react-intl'
import ProductionDetailMessages from '../../productDetail.messages'

type ICommentCard = {
  comment: GetAllProductCommentsQueryResult
}

const CommentCard: FC<ICommentCard> = ({ comment }) => {
  const { formatMessage } = useIntl()
  const {
    rate,
    body,
    createDate,
    disLikeCount,
    id,
    likeCount,
    subject,
    hasPartyDisLike,
    hasPartyLike,
    recommendationType,
    buyer,
    partyName,
  } = comment

  const [reactionMutation] = usePostWebSocialCommentsByCommentIdCommentReactionMutation()

  const handleCommentReaction = async (type: boolean) => {
    try {
      await reactionMutation({
        ...ApiConstants,
        commentId: id!,
        addToCommentReactionModel: {
          entityTypeId: 1,
          like: type,
        },
      }).unwrap()
    } catch (error) {
      openToast({
        message:
          error?.data?.messages?.[0]?.message ??
          formatMessage(ProductionDetailMessages.connectionError),
        type: 'error',
        vertical: 'top',
      })
    }
  }

  const recommendation = useMemo(
    () =>
      recommendationTypeItems.find((item) => {
        return item.value === recommendationType
      }),
    [comment],
  )

  return (
    <Stack
      p={4}
      spacing={4}
      sx={{
        border: ({ palette }) => `1px solid ${palette.grey[200]}`,
        borderRadius: 4,
      }}
    >
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Stack direction="row" alignItems="center" spacing={2}>
          <RateChip icon="star" label={`${rate ?? 0}`} />
          <Typography variant="subtitle1">{subject}</Typography>
        </Stack>
        <Stack direction="row" spacing={2}>
          {partyName && (
            <Typography variant="caption" color="text.secondary">
              {partyName}
            </Typography>
          )}
          <Typography variant="caption" color="text.secondary">
            <FormattedDate value={createDate ?? ''} />
          </Typography>
        </Stack>
      </Stack>
      <Divider variant="middle" sx={{ color: 'grey.200' }} />
      <Typography variant="caption" sx={{ wordBreak: 'break-word' }}>
        {body}
      </Typography>

      {buyer && (
        <TextWithHBIcon
          text={formatMessage(ProductionDetailMessages.buyer)}
          customVariant="subtitle2"
          iconType="user"
          size="small"
          textColor="text.secondary"
          iconColor="grey.300"
        />
      )}
      {recommendation && <CommentRecommendation content={recommendation} />}

      <Stack direction="row" columnGap={4} pt={4} alignItems="center" justifyContent="flex-end">
        <Typography variant="subtitle2" color="text.secondary">
          <FormattedMessage {...ProductionDetailMessages.commentReactionMessage} />
        </Typography>
        <Stack direction="row" columnGap={2} alignItems="flex-end">
          <Typography color="text.secondary" variant="button">
            {likeCount}
          </Typography>
          <HBLoginChecker onSignedInAction={() => handleCommentReaction(true)}>
            <Image
              width={15}
              height={15}
              src={`/assets/svg/${hasPartyLike ? 'liked' : 'like'}.svg`}
            />
          </HBLoginChecker>
        </Stack>
        <Stack direction="row" columnGap={2} alignItems="flex-end">
          <Typography color="text.secondary" variant="button">
            {disLikeCount}
          </Typography>
          <HBLoginChecker onSignedInAction={() => handleCommentReaction(false)}>
            <Image
              width={15}
              height={15}
              src={`/assets/svg/${hasPartyDisLike ? 'disLiked' : 'disLike'}.svg`}
            />
          </HBLoginChecker>
        </Stack>
      </Stack>
    </Stack>
  )
}

export default CommentCard
