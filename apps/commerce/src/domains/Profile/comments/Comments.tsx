import { CommerceTabs, ICommerceTabItem } from '@hasty-bazar-commerce/components'
import { Box, Typography } from '@mui/material'
import { FC } from 'react'
import { FormattedMessage } from 'react-intl'
import CommentsMessages from './Comments.messages'
import { SavedCommentList, WaitForCommentList } from './components'

const Comments: FC = () => {
  const tabs: ICommerceTabItem[] = [
    {
      tabLabel: (
        <Typography variant="button">
          <FormattedMessage {...CommentsMessages.waiterComments} />
        </Typography>
      ),
      tabPanel: (
        <Box pt={8} sx={{ height: '100%' }}>
          <WaitForCommentList />
        </Box>
      ),
    },
    {
      tabLabel: (
        <Typography variant="button">
          <FormattedMessage {...CommentsMessages.userComments} />
        </Typography>
      ),
      tabPanel: (
        <Box pt={8} sx={{ height: '100%', position: 'relative' }}>
          <SavedCommentList />
        </Box>
      ),
    },
  ]

  return <CommerceTabs tabs={tabs} />
}

export default Comments
