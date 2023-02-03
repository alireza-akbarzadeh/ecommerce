import ShowMore from '@hasty-bazar-commerce/components/ShowMore'
import { ApiConstants } from '@hasty-bazar-commerce/core/constants'
import { CommentsOrderType } from '@hasty-bazar-commerce/core/enums'
import { useGetWebSocialCommentsProductQuery } from '@hasty-bazar-commerce/Service-Enhancers/CommentApi.enhances'
import {
  GetAllProductCommentsQueryResult,
  PagedCollectionGetAllProductCommentsQueryResult,
} from '@hasty-bazar-commerce/services/socialApi.generated'
import { HBSelect } from '@hasty-bazar/core'
import { Box, CircularProgress, Grid, Stack, Typography } from '@mui/material'
import { FC, useCallback, useEffect, useMemo, useState } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import ProductionDetailMessages from '../../productDetail.messages'
import { useProductDetail } from '../../ProductDetailContext'
import { RateCard } from '../components'
import CommentCard from './CommentCard'

const Comments: FC = () => {
  const pageSize = 10
  const { formatMessage } = useIntl()
  const { activeUniqueProduct } = useProductDetail()
  const [commentsData, setCommentsData] = useState<PagedCollectionGetAllProductCommentsQueryResult>(
    {},
  )
  const [commentsItems, setCommentsItems] = useState<GetAllProductCommentsQueryResult[]>([])
  const [pageNumber, setPageNumber] = useState<number>(1)
  const [commentsOrder, setCommentsOrder] = useState<string>(CommentsOrderType.newest)
  const filterItems = [
    {
      title: formatMessage(ProductionDetailMessages.newestComments),
      value: CommentsOrderType.newest,
    },
    { title: formatMessage(ProductionDetailMessages.topComments), value: CommentsOrderType.top },
    { title: formatMessage(ProductionDetailMessages.buyer), value: CommentsOrderType.buyer },
  ]

  const {
    data: comments,
    refetch,
    isLoading,
  } = useGetWebSocialCommentsProductQuery(
    {
      ...ApiConstants,
      productId: activeUniqueProduct?.id!,
      ordering: commentsOrder,
      pageNumber,
      pageSize,
    },
    {
      skip: !activeUniqueProduct?.id,
    },
  )

  const changePageNumber = useCallback(
    (items: GetAllProductCommentsQueryResult[]) => {
      if (pageNumber !== 1) {
        setCommentsItems((prev) => [...prev, ...items])
      } else {
        setCommentsItems(items)
      }
    },
    [pageNumber],
  )

  useEffect(() => {
    if (comments?.data) setCommentsData(comments.data)
    if (comments?.data?.items) {
      const items = comments.data.items
      changePageNumber(items)
    }
  }, [comments])

  useEffect(() => {
    refetch()
  }, [activeUniqueProduct, commentsOrder, pageNumber])

  const hasMoreData = useMemo(
    () =>
      !!(
        comments?.data?.totalItems &&
        pageNumber * pageSize < comments?.data?.totalItems &&
        comments?.data?.totalItems >= commentsItems?.length - 1
      ),
    [pageNumber, comments?.data?.totalItems],
  )

  const userCommentResult = useMemo(() => comments?.data?.partyProductCommentResult, [comments])

  const handleChangeOrder = (order: string) => {
    setPageNumber(1)
    setCommentsOrder(order)
  }
  const handleChangePage = () => {
    if (hasMoreData) {
      setPageNumber((prev) => prev + 1)
    } else {
      setPageNumber(1)
    }
  }

  return (
    <>
      <Stack
        rowGap={4}
        justifyContent="space-between"
        alignItems={{ sm: 'center' }}
        direction={{ xs: 'column', sm: 'row' }}
      >
        <Typography variant="subtitle1">
          <FormattedMessage
            {...ProductionDetailMessages.commentsSectionCount}
            values={{ count: `${commentsData.totalItems ?? 0}` }}
          />
        </Typography>

        {!!commentsData.items?.length && (
          <Stack
            direction="row"
            alignItems="center"
            justifyContent={{ xs: 'space-between' }}
            spacing={2}
          >
            <Typography variant="body2">
              <FormattedMessage {...ProductionDetailMessages.commentsFilterLabel} />
            </Typography>
            <HBSelect
              onChange={(e) => {
                const { value } = e.target
                return handleChangeOrder(value as string)
              }}
              label=""
              size="small"
              sx={{ color: 'text.secondary' }}
              defaultValue={CommentsOrderType.newest}
              menuItem={filterItems}
            />
          </Stack>
        )}
      </Stack>
      {!isLoading ? (
        commentsItems.length ? (
          <Box sx={{ flexGrow: 1 }}>
            <Grid container spacing={10}>
              <Grid item xs={12} sm={4}>
                <RateCard
                  userComment={userCommentResult}
                  empty={!commentsData?.sumRate}
                  avgRate={commentsData?.avgRate}
                  sumRate={commentsData?.sumRate}
                  total={commentsData?.totalItems}
                />
              </Grid>
              <Grid container item direction="column" xs={12} rowGap={4} sm={8}>
                {commentsItems.map((item: GetAllProductCommentsQueryResult) => {
                  return (
                    <Grid item key={item.id}>
                      <CommentCard comment={item} />
                    </Grid>
                  )
                })}
                {comments?.data?.totalItems &&
                  comments?.data?.totalItems > commentsItems?.length &&
                  comments?.data?.totalItems >= pageSize && (
                    <ShowMore expandState={!hasMoreData} onClickHandler={handleChangePage} />
                  )}
              </Grid>
            </Grid>
          </Box>
        ) : (
          <RateCard empty userComment={userCommentResult} />
        )
      ) : (
        <CircularProgress />
      )}
    </>
  )
}

export default Comments
