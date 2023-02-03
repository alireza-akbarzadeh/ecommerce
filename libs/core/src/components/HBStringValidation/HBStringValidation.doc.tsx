import { Box, Divider, List, ListItem, Typography } from '@mui/material'

const HBStringValidationDoc = () => {
  return (
    <Box>
      <Typography variant="h4" component="h1">
        محتوای مستند
      </Typography>
      <Typography variant="h5" component="h2">
        HBStringValidation
      </Typography>
      <Typography variant="h6" component="h3">
        این کامپوننت به جهت اعلام وضعیت های مختلف پارامترهای ورودی به کاربر به کار میرود.
      </Typography>
      <Typography variant="body1" component="p">
        این کامپوننت شامل ۲ پارامتر اجباری در ورودی می باشد
      </Typography>
      <Divider sx={{ marginTop: (theme) => theme.spacing(3) }} />
      <List
        sx={{
          width: '100%',
          // maxWidth: 360,
          bgcolor: 'background.paper',
        }}
      >
        <ListItem>
          <Typography variant="subtitle1" component="span">
            text:{' '}
          </Typography>
        </ListItem>
        <Typography variant="h6" component="h5" color={'green'}>
          متن مورد نظر جهت اعلام وضعیت پارامتر ورودی
        </Typography>
        <Divider />
        <ListItem>
          <Typography variant="subtitle1" component="span">
            isActive:{' '}
          </Typography>
        </ListItem>
        <Typography variant="h6" component="h5" color={'green'}>
          ورودی به صورت boolean جهت تغییر وضعیت متن . در صورتی که شرط برقرار باشد متن به صورت سبز
          رنگ نمایش داده می شود. امکان استفاده از عبارات شرطی و yup وجود دارد.
        </Typography>
      </List>
    </Box>
  )
}

export default HBStringValidationDoc
