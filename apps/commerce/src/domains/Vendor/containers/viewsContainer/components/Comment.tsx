import { CommentRecommendation, HBLink, TextWithHBIcon } from '@hasty-bazar-commerce/components'
import { HBLoginChecker, recommendationTypeItems } from '@hasty-bazar-commerce/containers'
import { ApiConstants } from '@hasty-bazar-commerce/core/constants'
import VendorMessages from '@hasty-bazar-commerce/domains/Vendor/Vendor.messages'
import {
  GetAllSellerPageCommentsQueryResult,
  usePostWebSocialCommentsByCommentIdCommentReactionMutation,
} from '@hasty-bazar-commerce/services/socialApi.generated'
import { HBIcon, openToast } from '@hasty-bazar/core'
import { Box, Stack, Theme, Typography, useMediaQuery } from '@mui/material'
import Image from 'next/image'
import { useMemo } from 'react'
import { useIntl } from 'react-intl'

type CommentProps = {
  commentData: GetAllSellerPageCommentsQueryResult
  refetch?: () => void
}

const baseUrl = process.env.NEXT_PUBLIC_CDN

function Comment({ commentData, refetch }: CommentProps) {
  const { formatMessage } = useIntl()
  const breakpointSmUp = useMediaQuery((theme: Theme) => theme.breakpoints.up('sm'))

  const recommendation = useMemo(
    () =>
      recommendationTypeItems.find((item) => {
        return item.value === commentData?.recommendationType
      }),
    [commentData],
  )
  const [reactionMutation] = usePostWebSocialCommentsByCommentIdCommentReactionMutation()

  const handleCommentReaction = async (type: boolean) => {
    try {
      await reactionMutation({
        ...ApiConstants,
        commentId: commentData.id!,
        addToCommentReactionModel: {
          entityTypeId: 1,
          like: type,
        },
      }).unwrap()
      refetch?.()
    } catch (error) {
      openToast({
        message:
          error?.data?.messages?.[0]?.message ?? formatMessage(VendorMessages.connectionError),
        type: 'error',
        vertical: 'top',
      })
    }
  }
  return (
    <Box
      sx={{
        border: 1,
        borderColor: 'grey.200',
        borderRadius: 4,
        p: 4,
        my: 4,
        overflowX: 'hidden',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: 1,
          borderBottomColor: ({ palette }) => palette.grey[200],
          pb: 4,
          mb: 4,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box
            display={'flex'}
            justifyContent={'center'}
            gap={1}
            alignItems={'baseline'}
            sx={{
              backgroundColor: ({ palette }) => palette.warning.lighter,
              p: ({ spacing }) => spacing(1, 2),
              color: ({ palette }) => palette.warning.dark,
            }}
            borderRadius={2}
          >
            <Typography variant="caption" color={'warning.main'}>
              {commentData?.rate}
            </Typography>
            <HBIcon
              sx={{
                fontSize: 12.5,
                color: 'warning.main',
              }}
              type="star"
            />
          </Box>
          <Typography variant="subtitle1">{commentData?.registerBy}</Typography>
        </Box>
        <Box>
          <Typography variant="caption" sx={{ color: 'grey.500' }}>
            {new Date(commentData?.registerOn!).toLocaleDateString('fa-IR')}
          </Typography>
        </Box>
      </Box>

      <Stack flexDirection={breakpointSmUp ? 'row' : 'column'} gap={4}>
        <Box flex={'1'} display={'flex'} flexDirection={'column'} gap={2}>
          <Typography variant="caption">{commentData?.comment}</Typography>
          {commentData?.buyer && (
            <TextWithHBIcon
              text={formatMessage(VendorMessages.buyer)}
              customVariant="subtitle2"
              iconType="user"
              size="small"
              textColor="text.secondary"
              iconColor="grey.300"
            />
          )}

          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              color: ({ palette }) => palette.grey[500],
            }}
          >
            {recommendation && <CommentRecommendation content={recommendation} />}
          </Box>
        </Box>
        <Box sx={{ textAlign: 'center' }} maxWidth={'25%'}>
          <HBLink target="_blank" href={`/product/${commentData?.hsin}/${commentData?.slug}`}>
            <Box sx={{ textAlign: 'center' }} width={80} mx={'auto'}>
              <Image
                src={baseUrl + commentData?.productImage!}
                layout="responsive"
                style={{ borderRadius: 16 }}
                width={80}
                height={80}
                alt={commentData?.productName || ''}
              />
            </Box>
            <Typography
              variant="caption"
              sx={{ mt: 1, mb: 5, color: ({ palette }) => palette.info.main }}
            >
              {commentData?.productName}
            </Typography>
          </HBLink>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              gap: 5,
              justifyContent: 'center',
              mt: 4,
            }}
          >
            <Stack direction="row" columnGap={2} alignItems="flex-end">
              <Typography color="text.secondary" variant="button">
                {commentData?.like}
              </Typography>
              <HBLoginChecker onSignedInAction={() => handleCommentReaction(true)}>
                <Image
                  width={15}
                  height={15}
                  src={`/assets/svg/${commentData?.hasPartyLike ? 'liked' : 'like'}.svg`}
                />
              </HBLoginChecker>
            </Stack>

            <Stack direction="row" columnGap={2} alignItems="flex-end">
              <Typography color="text.secondary" variant="button">
                {commentData?.dislike}
              </Typography>
              <HBLoginChecker onSignedInAction={() => handleCommentReaction(false)}>
                <Image
                  width={15}
                  height={15}
                  src={`/assets/svg/${commentData?.hasPartyDisLike ? 'disLiked' : 'disLike'}.svg`}
                />
              </HBLoginChecker>
            </Stack>
          </Box>
        </Box>
      </Stack>
    </Box>
  )
}

export default Comment
