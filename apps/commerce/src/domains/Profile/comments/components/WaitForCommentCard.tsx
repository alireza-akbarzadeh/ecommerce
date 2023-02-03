import { HBLink, TextWithHBIcon } from '@hasty-bazar-commerce/components'
import { CommentDialog } from '@hasty-bazar-commerce/containers'
import { GetAllWatingForCommentsQueryResult } from '@hasty-bazar-commerce/services/socialApi.generated'
import { HBButton } from '@hasty-bazar/core'
import { Grid, Stack, Theme, Typography, useMediaQuery, useTheme } from '@mui/material'
import Image from 'next/image'
import { FC, useEffect, useState } from 'react'
import { FormattedMessage } from 'react-intl'
import CommentsMessages from '../Comments.messages'

interface IWaitForCommentCard {
  cardItem: GetAllWatingForCommentsQueryResult
}

const WaitForCommentCard: FC<IWaitForCommentCard> = ({ cardItem }) => {
  const { spacing } = useTheme()
  const breakpointDownSm = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'))
  const { productName, commentCount, productImage, productId, slug, hsin } = cardItem
  const [showAddComment, setShowAddComment] = useState(false)
  const [src, setSrc] = useState<string>('/assets/svg/image-error.svg')

  useEffect(() => {
    setSrc(`${process.env.NEXT_PUBLIC_CDN}${productImage}`)
  }, [cardItem])

  return (
    <>
      <Stack
        spacing={6}
        justifyContent="space-between"
        sx={{
          border: ({ palette }) => `1px solid ${palette.grey[200]}`,
          borderRadius: 2,
          py: 6,
          px: 4,
          height: '100%',
        }}
      >
        <Grid container columnSpacing={4} justifyContent="space-between" alignItems="flex-start">
          <Grid container item xs={9} direction="column" rowGap={8}>
            <HBLink
              target="_blank"
              underline="none"
              color="inherit"
              href={`/product/${hsin}/${slug}`}
            >
              <Typography variant={breakpointDownSm ? 'subtitle2' : 'subtitle1'}>
                {productName}
              </Typography>
            </HBLink>
            <TextWithHBIcon
              alignItems="flex-start"
              customVariant={breakpointDownSm ? 'caption' : 'subtitle2'}
              text={
                <FormattedMessage
                  {...CommentsMessages.commentsCount}
                  values={{ count: `${commentCount}` }}
                />
              }
              iconType="commentAlt"
              size="small"
            />
          </Grid>
          <Grid item xs={3}>
            <HBLink target="_blank" href={`/product/${hsin}/${slug}`}>
              <Image
                style={{ borderRadius: spacing(2) }}
                src={src}
                width={96}
                height={96}
                objectFit="contain"
                onError={() => setSrc('/assets/svg/image-error.svg')}
                alt="image-error"
              />
            </HBLink>
          </Grid>
        </Grid>
        <HBButton variant="outlined" onClick={() => setShowAddComment(true)}>
          <TextWithHBIcon
            text={<FormattedMessage {...CommentsMessages.addCommentButton} />}
            iconType="commentAlt"
            iconColor="text.secondary"
          />
        </HBButton>
      </Stack>
      {showAddComment && productId && (
        <CommentDialog entityId={productId} onClose={() => setShowAddComment(false)} />
      )}
    </>
  )
}

export default WaitForCommentCard
