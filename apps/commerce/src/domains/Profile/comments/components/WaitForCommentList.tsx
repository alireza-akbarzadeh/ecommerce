import { CommerceLoading, Nothing } from '@hasty-bazar-commerce/components'
import { ApiConstants } from '@hasty-bazar-commerce/core/constants'
import { useGetWebSocialCommentsPartyWaitingforcommentsQuery } from '@hasty-bazar-commerce/Service-Enhancers/CommentApi.enhances'
import { HBPagination } from '@hasty-bazar/core'
import { Grid, paginationClasses } from '@mui/material'
import { FC, useEffect, useState } from 'react'
import WaitForCommentCard from './WaitForCommentCard'

const WaitForCommentList: FC = () => {
  const pageSize = 10
  const [pageNumber, setPageNumber] = useState(1)
  const [totalPage, setTotalPage] = useState<number>(1)

  const {
    data: content,
    refetch,
    isLoading,
  } = useGetWebSocialCommentsPartyWaitingforcommentsQuery({
    ...ApiConstants,
    pageSize,
    pageNumber,
  })

  useEffect(() => {
    refetch()
  }, [pageNumber])

  useEffect(() => {
    if (content?.data?.totalItems) {
      setTotalPage(Math.floor((content.data.totalItems + pageSize - 1) / pageSize))
    }
  }, [content?.data?.totalItems])

  const handleChangePage = (e: React.ChangeEvent<unknown>, pageNumber: number): void => {
    setPageNumber(pageNumber)
  }

  const handleGotoPage = (pageNumber: number) => {
    setPageNumber(pageNumber)
  }
  if (isLoading) return <CommerceLoading />
  return (
    <>
      {content?.data?.items && content.data.items.length > 0 ? (
        <Grid container columnSpacing={6} rowGap={8}>
          {content.data.items.map((item, index) => {
            return (
              <Grid item xs={12} sm={6} key={index}>
                <WaitForCommentCard cardItem={item} />
              </Grid>
            )
          })}
          <Grid
            item
            xs={12}
            sx={{
              [`& .paginationWrapper`]: {
                flexDirection: { xs: 'column', sm: 'row' },
              },
              [`& .${paginationClasses.ul}`]: {
                flexDirection: 'row !important',
                mt: { xs: 2, sm: 0 },
              },
            }}
          >
            <HBPagination
              count={totalPage}
              page={pageNumber}
              onChange={handleChangePage}
              gotoPage={handleGotoPage}
            />
          </Grid>
        </Grid>
      ) : (
        <Nothing />
      )}
    </>
  )
}

export default WaitForCommentList
