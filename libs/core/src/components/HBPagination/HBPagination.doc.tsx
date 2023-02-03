import { Box, Link, Typography } from '@mui/material'
const HBGridPaginationDoc = () => {
  return (
    <Box>
      <Typography variant="h4" component="h1">
        محتوای مستند
      </Typography>
      <Typography variant="subtitle1" component="p">
        این کامپوننت برای استفاده در گرید کاستوم شده ، البته می توان از آن در جاهای دیگر نیز استفاده
        کرد
      </Typography>
      <Typography variant="subtitle1" component="p">
        برای دیدن مستندات بیشتر می توانید از لینک زیر استفاده نمایید
      </Typography>

      <Link href="https://mui.com/material-ui/api/pagination/" target={'_blank'}>
        مستندات استفاده از Pagination
      </Link>
    </Box>
  )
}

export default HBGridPaginationDoc
