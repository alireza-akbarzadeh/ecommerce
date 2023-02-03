import { Box, Card, CardContent, Divider, Grid, Link, List, ListItem } from '@mui/material'
import Typography from '@mui/material/Typography'
import { IconTypes } from './HBIcon.data'

const HBSwitchDoc = () => {
  return (
    <Box>
      <Typography variant="h4" component="h1">
        محتوای مستند
      </Typography>
      <Typography variant="h5" component="h2">
        Icons
      </Typography>
      <Typography variant="h6" component="h3">
        برای تغییر سایز آیکون می توانید از پراپرتی size استفاده کرد ، این پراپرتی در سه سایز تعریف
        شده است.
      </Typography>
      <Typography variant="body1" component="p">
        برای استفاده از نوع آیکون می توانید از پراپرتی type استفاده کنید ، مقادیر این پراپرتی در
        لینک انتهای توضیحات موجود است
      </Typography>
      <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
        <ListItem>
          <Typography variant="h5" component="h5">
            Size
          </Typography>
        </ListItem>
        <Divider />
        <ListItem>
          <Typography variant="subtitle1" component="span">
            small
          </Typography>
        </ListItem>
        <ListItem>
          <Typography variant="subtitle1" component="span">
            medium
          </Typography>
        </ListItem>
        <ListItem>
          <Typography variant="subtitle1" component="span">
            large
          </Typography>
        </ListItem>
        <Divider />
        <ListItem>
          <Typography variant="subtitle1" component="span">
            برای مشاهده Type های آیکون می توانید از لینک زیر استفاده نمایید
          </Typography>
        </ListItem>
        <Divider />
        <ListItem>
          <Link href="https://iconscout.com/unicons/explore/line" target="_blank" rel="noreferrer">
            <Typography variant="subtitle1" component="p">
              مشاهده مستندات بیشتر
            </Typography>
          </Link>
        </ListItem>
      </List>
      <Grid container spacing={2} sx={{ marginTop: 2 }}>
        {IconTypes.map((item) => (
          <Grid item xs={6} md={3} xl={2}>
            <Card>
              <CardContent>
                <Typography variant="subtitle2" component="span" key={item}>
                  {item}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  )
}

export default HBSwitchDoc
