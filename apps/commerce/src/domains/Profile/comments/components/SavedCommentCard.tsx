import {
  CommentRecommendation,
  HBLink,
  RateChip,
  TextWithHBIcon,
} from '@hasty-bazar-commerce/components'
import { CommentDialog, recommendationTypeItems } from '@hasty-bazar-commerce/containers'
import { ApiConstants } from '@hasty-bazar-commerce/core/constants'
import { CommentState } from '@hasty-bazar-commerce/core/enums'
import { useDeleteWebSocialCommentsByIdMutation } from '@hasty-bazar-commerce/Service-Enhancers/CommentApi.enhances'
import { GetAllPartyCommentsQueryResult } from '@hasty-bazar-commerce/services/socialApi.generated'
import { HBChip, HBDialog, HBIconButton, HBMenu, openToast } from '@hasty-bazar/core'
import {
  Box,
  Divider,
  Grid,
  Stack,
  styled,
  Theme,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import Image from 'next/image'
import { stringify } from 'query-string'
import { FC, useEffect, useMemo, useState } from 'react'
import { FormattedDate, FormattedMessage, useIntl } from 'react-intl'
import CommentsMessages from '../Comments.messages'

interface ISavedCommentCard {
  commentItem: GetAllPartyCommentsQueryResult
}

const FullWidthDivider = styled(Divider)(({ theme }) => ({
  color: theme.palette.background.default,
  width: '100%',
  [theme.breakpoints.down('sm')]: {
    width: `calc(100% + ${theme.spacing(8)})`,
    marginLeft: theme.spacing(-4),
  },
}))

const SavedCommentCard: FC<ISavedCommentCard> = ({ commentItem }) => {
  const isSmall = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'))
  const { spacing } = useTheme()
  const { formatMessage } = useIntl()
  const [showRemoveDialog, setShowRemoveDialog] = useState(false)
  const [showAddCommentDialog, setShowAddCommentDialog] = useState(false)
  const [deleteCommentMutation, { isLoading }] = useDeleteWebSocialCommentsByIdMutation()
  const [src, setSrc] = useState<string>('/assets/svg/image-error.svg')
  const {
    id,
    recommendationType,
    subject,
    body,
    productImage,
    createOn,
    like,
    rate,
    storeName,
    status,
    productId,
    productName,
    statusCode,
    description,
    rejectedReson,
    storeId,
    hsin,
    slug,
  } = commentItem

  useEffect(() => {
    setSrc(`${process.env.NEXT_PUBLIC_CDN}${productImage}`)
  }, [commentItem])

  const recommendation = useMemo(
    () =>
      recommendationTypeItems.find((item) => {
        return item.value === recommendationType
      }),
    [commentItem],
  )

  const handleRemoveComment = async () => {
    try {
      if (id) {
        const payload = await deleteCommentMutation({
          ...ApiConstants,
          id,
        }).unwrap()

        if (payload.success) {
          openToast({
            message: formatMessage(CommentsMessages.deleteCommentSuccess),
            type: 'success',
            vertical: 'top',
          })
        }
      }
    } finally {
      setShowRemoveDialog(false)
    }
  }

  const selectStateColor: Partial<Record<number, { bgcolor: string; color: string }>> = {
    [CommentState.draft]: { bgcolor: 'warning.lighter', color: 'warning.main' },
    [CommentState.published]: { bgcolor: 'success.lighter', color: 'success.main' },
    [CommentState.rejected]: { bgcolor: 'error.lighter', color: 'error.main' },
  }

  return (
    <>
      <Stack
        spacing={4}
        sx={{
          border: ({ palette }) => `1px solid ${palette.grey[200]}`,
          borderRadius: 2,
          p: { xs: 4, sm: 6 },
        }}
      >
        <Grid container gap={4} alignItems="baseline" justifyContent="space-between">
          <Grid item xs="auto">
            <Typography variant="subtitle1">{subject}</Typography>
          </Grid>
          <Grid
            item
            container
            gap={{ xs: 2, sm: 4 }}
            xs={12}
            sm
            flexWrap="nowrap"
            justifyContent="space-between"
          >
            <Grid container item xs="auto" sm={4} columnGap={4} alignItems="center">
              <Grid item>
                <RateChip label={`${rate}`} icon="star" />
              </Grid>
              <Grid item>
                <Typography variant="caption" color="text.secondary">
                  <FormattedDate value={createOn ?? ''} />
                </Typography>
              </Grid>
            </Grid>
            <Grid container item xs="auto" direction="row" columnGap={4} alignItems="center">
              {status && statusCode && (
                <HBChip
                  text={status}
                  variant="caption"
                  sx={{
                    bgcolor: selectStateColor[+statusCode]?.bgcolor,
                    borderRadius: 2,
                    color: selectStateColor[+statusCode]?.color,
                    whiteSpace: 'nowrap',
                    px: 4,
                    py: 0.2,
                  }}
                />
              )}
              <HBMenu
                menuItemSx={{ pr: 20 }}
                buttonProps={{
                  variant: 'text',
                  disableRipple: true,
                  disabled: !!(statusCode && statusCode === `${CommentState.draft}`),
                  sx: {
                    minWidth: 'fit-content',
                    p: 0,
                    m: 0,
                    '&:disabled': {
                      cursor: 'not-allowed !important',
                      opacity: 0.5,
                    },
                  },
                }}
                content={
                  <HBIconButton
                    icon="ellipsisH"
                    iconSize="small"
                    sx={{
                      minHeight: 'auto',
                      minWidth: 'auto',
                      height: 24,
                      width: 24,
                      bgcolor: 'grey.100',
                      borderRadius: 1.5,
                      border: ({ palette }) => `1px solid ${palette.grey[200]}`,
                      '&:hover': { bgcolor: 'grey.100', color: 'grey.500' },
                    }}
                  />
                }
                menus={[
                  {
                    content: (
                      <TextWithHBIcon
                        text={formatMessage(CommentsMessages.edit)}
                        iconType="editAlt"
                        size="small"
                      />
                    ),
                    onClick: () => {
                      setShowAddCommentDialog(true)
                    },
                  },
                  {
                    content: (
                      <TextWithHBIcon
                        text={formatMessage(CommentsMessages.remove)}
                        iconType="trashAlt"
                        iconColor="error.main"
                        size="small"
                      />
                    ),
                    onClick: () => {
                      setShowRemoveDialog(true)
                    },
                  },
                ]}
              />
            </Grid>
          </Grid>
          <FullWidthDivider />
        </Grid>

        <Grid container gap={4} justifyContent="space-between">
          <Grid item xs={8} sm={9}>
            <Stack spacing={4} divider={<Divider variant="middle" sx={{ color: 'grey.200' }} />}>
              {rejectedReson && (
                <TextWithHBIcon
                  size="small"
                  iconType="exclamationCircle"
                  iconColor="error.main"
                  textColor="error.main"
                  text={`${rejectedReson} ${description ? ':' + description : ''}`}
                />
              )}
              <Stack spacing={2}>
                <Typography variant="body2" sx={{ wordBreak: 'break-word', userSelect: 'text' }}>
                  {body}
                </Typography>
                {recommendation && <CommentRecommendation content={recommendation} />}
              </Stack>
              {!isSmall && (
                <Stack direction="row" columnGap={4}>
                  <TextWithHBIcon
                    customVariant="subtitle2"
                    text={
                      <FormattedMessage
                        {...CommentsMessages.commentsLikeCount}
                        values={{ count: like ?? 0 }}
                      />
                    }
                    size="small"
                    iconType="thumbsUp"
                  />
                  {storeName && (
                    <HBLink
                      underline="none"
                      href={`/vendor/?${stringify({
                        baseFilter: JSON.stringify({ vendors: [storeId] }),
                      })}`}
                    >
                      <TextWithHBIcon
                        customVariant="subtitle2"
                        text={storeName}
                        iconType="store"
                        size="small"
                        iconColor="info.main"
                        textColor="info.main"
                      />
                    </HBLink>
                  )}
                </Stack>
              )}
            </Stack>
          </Grid>
          <Grid item xs={3} sm={2.5}>
            <HBLink target="_blank" href={`/product/${hsin}/${slug}`}>
              <Stack spacing={2} alignItems="center">
                <Box
                  sx={{
                    width: { xs: 85, sm: 120 },
                    height: { xs: 85, sm: 120 },
                    position: 'relative',
                  }}
                >
                  <Image
                    style={{ borderRadius: spacing(2) }}
                    src={src}
                    layout="fill"
                    objectFit="contain"
                    onError={() => setSrc('/assets/svg/image-error.svg')}
                    alt="image-error"
                  />
                </Box>
                <Typography
                  color="info.main"
                  sx={{
                    display: '-webkit-box',
                    '-webkit-line-clamp': '2',
                    lineClamp: '2',
                    '-webkit-box-orient': 'vertical',
                    textOverflow: 'ellipsis',
                    overflow: 'hidden',
                  }}
                >
                  {commentItem.productName}
                </Typography>
              </Stack>
            </HBLink>
          </Grid>

          {isSmall && (
            <Grid item container xs={12} rowGap={4}>
              <FullWidthDivider />
              <Grid item>
                <Stack direction="row" columnGap={4} rowGap={2} flexWrap="wrap">
                  <TextWithHBIcon
                    customVariant="subtitle2"
                    text={
                      <FormattedMessage
                        {...CommentsMessages.commentsLikeCount}
                        values={{ count: like ?? 0 }}
                      />
                    }
                    size="small"
                    iconType="thumbsUp"
                  />
                  {storeName && (
                    <HBLink underline="none" href={'#'}>
                      <TextWithHBIcon
                        customVariant="subtitle2"
                        text={storeName}
                        iconType="store"
                        size="small"
                        iconColor="info.main"
                        textColor="info.main"
                      />
                    </HBLink>
                  )}
                </Stack>
              </Grid>
            </Grid>
          )}
        </Grid>
      </Stack>

      {showRemoveDialog && (
        <HBDialog
          maxWidth="xs"
          fullWidth
          open
          title={formatMessage(CommentsMessages.removeComment)}
          onClose={() => setShowRemoveDialog(false)}
          onBackdropClick={() => setShowRemoveDialog(false)}
          acceptBtn={formatMessage(CommentsMessages.remove)}
          rejectBtn={formatMessage(CommentsMessages.cancel)}
          onReject={() => setShowRemoveDialog(false)}
          onAccept={handleRemoveComment}
          loading={isLoading}
        >
          <Typography variant="subtitle2" color="text.secondary">
            <FormattedMessage {...CommentsMessages.removeCommentMessage} />
          </Typography>
        </HBDialog>
      )}
      {showAddCommentDialog && productId && (
        <CommentDialog
          entityId={productId}
          comment={commentItem}
          onClose={() => setShowAddCommentDialog(false)}
        />
      )}
    </>
  )
}

export default SavedCommentCard
