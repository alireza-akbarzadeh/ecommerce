import { Divider, Link, List, ListItem } from '@mui/material'
import Typography from '@mui/material/Typography'
import { Box } from '@mui/system'
const HBSwitchDoc = () => {
  return (
    <Box>
      <Typography variant="h4" component="h1">
        محتوای مستند
      </Typography>
      <Typography variant="h5" component="h2">
        Snackbar Properties
      </Typography>

      <Typography variant="h6" component="h3">
        پراپرتی های کامپوننت
      </Typography>
      <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
        <ListItem>
          <Typography variant="h5" component="h5">
            messageType
          </Typography>
        </ListItem>
        <Divider />
        <ListItem>
          <Typography variant="subtitle1" component="span">
            success
          </Typography>
        </ListItem>
        <ListItem>
          <Typography variant="subtitle1" component="span">
            warning
          </Typography>
        </ListItem>
        <ListItem>
          <Typography variant="subtitle1" component="span">
            error
          </Typography>
        </ListItem>
        <ListItem>
          <Typography variant="subtitle1" component="span">
            info
          </Typography>
        </ListItem>
        <Divider />
        <ListItem>
          <Typography variant="h5" component="h5">
            message
          </Typography>
        </ListItem>
        <Divider />
        <ListItem>
          <Typography variant="h5" component="h5">
            open
          </Typography>
        </ListItem>
        <Divider />
        <ListItem>
          <Typography variant="h5" component="h5">
            vertical
          </Typography>
        </ListItem>
        <Divider />
        <ListItem>
          <Typography variant="subtitle1" component="span">
            top
          </Typography>
        </ListItem>
        <ListItem>
          <Typography variant="subtitle1" component="span">
            bottom
          </Typography>
        </ListItem>
        <ListItem>
          <Typography variant="h5" component="h5">
            horizontal
          </Typography>
        </ListItem>
        <Divider />
        <ListItem>
          <Typography variant="subtitle1" component="span">
            right
          </Typography>
        </ListItem>
        <ListItem>
          <Typography variant="subtitle1" component="span">
            center
          </Typography>
        </ListItem>
        <ListItem>
          <Typography variant="subtitle1" component="span">
            left
          </Typography>
        </ListItem>
      </List>
      <Link href="https://mui.com/material-ui/api/snackbar/" target="_blank" rel="noreferrer">
        <Typography variant="subtitle1" component="p">
          مشاهده مستندات بیشتر Snakbar
        </Typography>
      </Link>
    </Box>
  )
}

export default HBSwitchDoc
