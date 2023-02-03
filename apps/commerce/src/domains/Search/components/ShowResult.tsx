import { EmotionJSX } from '@emotion/react/types/jsx-namespace'
import { HBInfiniteScroll } from '@hasty-bazar-commerce/components/HBInfiniteScroll'
import { CircularProgress, Grid } from '@mui/material'
import { FC } from 'react'

interface IProps {
  pageSize: number
  handlePagination(page: number, p?: 'infinite' | 'pagination'): void
  totalResultQty: number
  page: number
  paginationMode: 'infinite' | 'pagination'
  resultMapping: EmotionJSX.Element[] | undefined
}
const ShowResult: FC<IProps> = ({
  pageSize,
  handlePagination,
  totalResultQty,
  page,
  paginationMode,
  resultMapping,
}) => {
  return (
    <Grid
      container
      rowGap={{ xs: 5, sm: 10 }}
      sx={{
        p: { md: 4 },
        px: { xs: 4, md: 5 },
        mt: { xs: 0, md: 'unset' },
      }}
    >
      {paginationMode === 'pagination' ? (
        <>{resultMapping}</>
      ) : (
        <HBInfiniteScroll
          allCount={+totalResultQty}
          refetchCallback={(p) => handlePagination(p)}
          customLoading={<CircularProgress />}
          scrollUntilPage={+totalResultQty > pageSize ? 3 : 1}
          pageNum={page}
        >
          {resultMapping}
        </HBInfiniteScroll>
      )}
    </Grid>
  )
}

export default ShowResult
