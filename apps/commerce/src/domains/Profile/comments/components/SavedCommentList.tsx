import { CommerceLoading, Nothing } from '@hasty-bazar-commerce/components'
import { ApiConstants } from '@hasty-bazar-commerce/core/constants'
import { CommentState } from '@hasty-bazar-commerce/core/enums'
import { useGetWebSocialCommentsPartyCommentsQuery } from '@hasty-bazar-commerce/Service-Enhancers/CommentApi.enhances'
import { HBPagination } from '@hasty-bazar/core'
import {
  Box,
  CircularProgress,
  FormControlLabel,
  Grid,
  paginationClasses,
  Radio,
  RadioGroup,
  Stack,
  Typography,
} from '@mui/material'
import { FC, useEffect, useState } from 'react'
import { useIntl } from 'react-intl'
import CommentsMessages from '../Comments.messages'
import SavedCommentCard from './SavedCommentCard'

const SavedCommentList: FC = () => {
  const pageSize = 5
  const { formatMessage } = useIntl()
  const [pageNumber, setPageNumber] = useState(1)
  const [totalPage, setTotalPage] = useState<number>(1)
  const [activeFilter, setActiveFilter] = useState<number>(0)

  const filterItems = [
    { title: formatMessage(CommentsMessages.allComments), value: 0 },
    { title: formatMessage(CommentsMessages.publishedComments), value: CommentState.published },
    { title: formatMessage(CommentsMessages.rejectedComments), value: CommentState.rejected },
    { title: formatMessage(CommentsMessages.draftComments), value: CommentState.draft },
  ]

  const {
    data: content,
    refetch,
    isLoading,
    isFetching,
  } = useGetWebSocialCommentsPartyCommentsQuery({
    ...ApiConstants,
    pageSize,
    pageNumber,
    statusCode: activeFilter ? activeFilter.toString() : undefined,
    filter: activeFilter ? 'StatusCode_Equal_--StatusCode' : undefined,
  })

  useEffect(() => {
    refetch()
  }, [pageNumber, activeFilter])

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
      <RadioGroup
        onChange={(_, value) => {
          setActiveFilter(+value)
        }}
        value={activeFilter}
      >
        <Stack
          direction="row"
          gap={2}
          sx={{
            position: { xs: 'initial', md: 'absolute' },
            top: { md: -35 },
            right: { md: 0 },
            pb: { xs: 6, md: 0 },
            flexWrap: 'wrap',
          }}
        >
          {filterItems.map((item) => {
            return (
              <FormControlLabel
                sx={{ m: 0 }}
                control={<Radio sx={{ display: 'none' }} />}
                label={
                  <Typography
                    variant="button"
                    sx={{
                      borderRadius: 10,
                      border: ({ palette }) => `1px solid ${palette.primary.main}`,
                      py: 0,
                      px: 4,
                      height: 'fit-content',
                      bgcolor: item.value === activeFilter ? 'primary.main' : 'unset',
                      color: item.value === activeFilter ? 'common.white' : 'primary.main',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {item.title}
                  </Typography>
                }
                value={item.value}
              />
            )
          })}
        </Stack>
      </RadioGroup>
      {content?.data?.items && content.data.items.length > 0 ? (
        isFetching ? (
          <CircularProgress sx={{ m: '0 auto', display: 'block' }} />
        ) : (
          <Box sx={{ flexGrow: 1 }}>
            <Grid container direction="column" rowGap={4}>
              {content.data.items.map((item) => {
                return (
                  <Grid item key={item.id}>
                    <SavedCommentCard commentItem={item} />
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
          </Box>
        )
      ) : (
        <Nothing />
      )}
    </>
  )
}

export default SavedCommentList
