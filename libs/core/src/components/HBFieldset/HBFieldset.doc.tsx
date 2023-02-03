import { List, ListItem } from '@mui/material'
import Typography from '@mui/material/Typography'
import { Box } from '@mui/system'
const HBSwitchDoc = () => {
  return (
    <Box>
      <Typography variant="h4" component="h1">
        محتوای مستند
      </Typography>
      <Typography variant="h5" component="h2">
        HBFieldset Properties
      </Typography>

      <Typography variant="h6" component="h3">
        پراپرتی های کامپوننت
      </Typography>
      <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
        <ListItem>
          <Typography variant="h5" component="h5">
            title
          </Typography>
        </ListItem>
      </List>
    </Box>
  )
}

export default HBSwitchDoc
