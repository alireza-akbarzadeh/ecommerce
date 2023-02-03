import { Box, Paper, styled } from '@mui/material'
import ListItemText from '@mui/material/ListItemText'
import MenuItem, { menuItemClasses } from '@mui/material/MenuItem'
import MenuList from '@mui/material/MenuList'
import Typography from '@mui/material/Typography'
import { useIntl } from 'react-intl'
import CommentMessages from '../CommentPage.messages'

const HBMenuItem = styled(MenuItem)(({ theme }) => ({
  [`&.${menuItemClasses.root}`]: {
    borderRadius: theme.spacing(4),
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  [`&.${menuItemClasses.selected}`]: {
    border: `1px solid ${theme.palette.primary.main}`,
    backgroundColor: 'transparent',
  },
  [`&.${menuItemClasses.gutters}`]: {
    padding: theme.spacing(3, 4),
  },
}))

function CommentCategoryList() {
  const { formatMessage } = useIntl()

  return (
    <Paper
      sx={{
        maxWidth: '100%',
        borderRadius: ({ spacing }) => spacing(4),
        border: 1,
        borderColor: 'grey.200',
        p: 6,
      }}
      elevation={0}
    >
      <MenuList>
        <Box
          sx={{
            backgroundColor: ({ palette }) => palette.primary.main,
            py: 3,
            px: 4,
            borderRadius: ({ spacing }) => spacing(4),
            color: 'common.white',
          }}
        >
          <Typography variant="body2">
            {formatMessage(CommentMessages.commentsCategories)}
          </Typography>
        </Box>
        <HBMenuItem selected>
          <ListItemText>
            <Typography variant="body2">{formatMessage(CommentMessages.product)}</Typography>
          </ListItemText>
          <Typography variant="body2" color="text.secondary"></Typography>
        </HBMenuItem>
      </MenuList>
    </Paper>
  )
}

export default CommentCategoryList
