import { CommentDialog, HBLoginChecker } from '@hasty-bazar-commerce/containers'
import { CommentState } from '@hasty-bazar-commerce/core/enums'
import { PartyProductCommentResult } from '@hasty-bazar-commerce/services/socialApi.generated'
import { HBButton, HBRating, openToast } from '@hasty-bazar/core'
import { Box, Stack, Typography, useMediaQuery, useTheme } from '@mui/material'
import Image from 'next/image'
import { FC, useMemo, useState } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import ProductDetailMessages from '../../productDetail.messages'
import { useProductDetail } from '../../ProductDetailContext'

interface IRateCard {
  empty?: boolean
  avgRate?: number
  sumRate?: number
  total?: number
  userComment?: PartyProductCommentResult
}

const EmptyCard = () => {
  return (
    <Stack alignItems="center" spacing={6}>
      <Typography variant="caption" color="text.secondary">
        <FormattedMessage {...ProductDetailMessages.emptyRateMessage} />
      </Typography>
      <Box>
        <Image src="/assets/svg/commentsEmpty.svg" width={125} height={105} />
      </Box>
    </Stack>
  )
}
const ContentFullCard = ({ avgRate, sumRate }: { avgRate: number; sumRate: number }) => {
  return (
    <Stack alignItems="flex-start" spacing={2}>
      <Typography variant="subtitle2" color="warning.light">
        {`${avgRate} / ۵`}
      </Typography>
      <Typography variant="caption" color="text.secondary">
        <FormattedMessage
          {...ProductDetailMessages.totalCommentCount}
          values={{ totalCommentCount: `${sumRate}` }}
        />
      </Typography>
      <HBRating readOnly size="medium" value={avgRate} sx={{ color: 'warning.light' }} />
    </Stack>
  )
}

const RateCard: FC<IRateCard> = ({ empty, avgRate, sumRate, total, userComment }) => {
  const { activeUniqueProduct } = useProductDetail()
  const { formatMessage } = useIntl()
  const theme = useTheme()
  const isSmall = useMediaQuery(theme.breakpoints.down('sm'))
  const [showAddComment, setShowAddComment] = useState(false)

  const draftComment = useMemo(
    () => userComment?.stateCode === `${CommentState.draft}`,
    [userComment],
  )

  const handleAddComment = () => {
    if (draftComment)
      return openToast({
        type: 'info',
        message: formatMessage(ProductDetailMessages.draftCommentMessage),
        vertical: 'top',
      })
    setShowAddComment(true)
  }

  return (
    <>
      <Stack alignItems={empty ? 'center' : 'flex-start'} spacing={6}>
        {empty ? <EmptyCard /> : <ContentFullCard avgRate={avgRate ?? 0} sumRate={sumRate ?? 0} />}
        <HBLoginChecker
          onSignedInAction={handleAddComment}
          sx={{ width: !isSmall && !!total ? '100%' : empty ? 'max-content' : '100%' }}
        >
          <HBButton variant="outlined" fullWidth={isSmall || (!isSmall && !!total) || !empty}>
            <FormattedMessage {...ProductDetailMessages.saveCommentButton} />
          </HBButton>
        </HBLoginChecker>
      </Stack>
      {showAddComment && activeUniqueProduct?.id && (
        <CommentDialog
          entityId={activeUniqueProduct.id}
          comment={!draftComment ? userComment : undefined}
          onClose={() => setShowAddComment(false)}
        />
      )}
    </>
  )
}

export default RateCard
