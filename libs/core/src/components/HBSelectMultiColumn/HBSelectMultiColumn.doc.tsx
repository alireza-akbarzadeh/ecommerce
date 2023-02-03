import { Divider, Link, List, ListItem } from '@mui/material'
import Typography from '@mui/material/Typography'
import { Box } from '@mui/system'

const HBSelectMultiColumnDoc = () => {
  return (
    <Box>
      <Typography variant="h4" component="h1">
        محتوای مستند
      </Typography>
      <Typography variant="h5" component="h2">
        SelectMultiColumn Properties
      </Typography>

      <Typography variant="h6" component="h3">
        پراپرتی های کامپوننت
      </Typography>
      <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
        <ListItem>
          <Typography variant="h5" component="h5">
            items
          </Typography>
        </ListItem>
        <Divider />
        <ListItem>
          <Typography variant="h5" component="h5">
            columnDefs
          </Typography>
        </ListItem>
        <Divider />
        <ListItem>
          <Typography variant="h5" component="span">
            label
          </Typography>
        </ListItem>
        <Divider />
        <ListItem>
          <Typography variant="h5" component="span">
            totalItems
          </Typography>
        </ListItem>
        <Divider />
        <ListItem>
          <Typography variant="h5" component="span">
            pageSize
          </Typography>
        </ListItem>
        <Divider />
        <ListItem>
          <Typography variant="h5" component="span">
            loadNextPage
          </Typography>
        </ListItem>
        <Divider />
        <ListItem>
          <Typography variant="h5" component="span">
            placeholder
          </Typography>
        </ListItem>
        <Divider />
      </List>
      <Typography variant="subtitle1" component="h4">
        مستندات بیشتر کامپوننت
      </Typography>
      <Link href="https://mui.com/material-ui/api/autocomplete/" target="_blank" rel="noreferrer">
        <Typography variant="subtitle1" component="div">
          مستندات autocomplete
        </Typography>
      </Link>
    </Box>
  )
}

export default HBSelectMultiColumnDoc
