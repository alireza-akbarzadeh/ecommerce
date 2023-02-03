import BreadCrumbSection from '@hasty-bazar/admin-shared/components/BreadCrumb/BreadCrumbSection'
import { HBIcon } from '@hasty-bazar/core'
import { Box, Grid, Typography } from '@mui/material'
import { useIntl } from 'react-intl'
import CommentMessages from './CommentPage.messages'
import CommentCategoryList from './components/CommentCategoryList'
import CommentGrid from './containers/CommentGrid'

function CommentPage() {
  const { formatMessage } = useIntl()

  const breadcrumbs = [
    {
      url: '/',
      title: formatMessage(CommentMessages.dashboard),
    },
    {
      url: '/comment-review/show',
      title: formatMessage(CommentMessages.commentTitle),
    },
  ]

  return (
    <>
      <Box display={'flex'} alignItems={'center'} justifyContent={'space-between'}>
        <BreadCrumbSection
          title={formatMessage(CommentMessages.commentTitle)}
          breadItems={breadcrumbs}
        />
      </Box>
      <Grid container spacing={2}>
        <Grid item xs={3}>
          <CommentCategoryList />
        </Grid>
        <Grid item xs={9} container spacing={2}>
          <Grid item xs={12}>
            <Box
              bgcolor="common.white"
              p={8}
              borderRadius={({ spacing }) => spacing(4)}
              display={'flex'}
              flexDirection={'column'}
              gap={8}
              sx={{
                border: (theme) => `1px solid ${theme.palette.grey[200]}`,
              }}
              height={`calc(100vh - 200px)`}
            >
              <Typography variant="h4" display={'flex'} gap={2}>
                <HBIcon type="listUiAlt" />
                {formatMessage(CommentMessages.commentList)}
              </Typography>
              <CommentGrid />
            </Box>
          </Grid>
        </Grid>
      </Grid>
    </>
  )
}

export default CommentPage
