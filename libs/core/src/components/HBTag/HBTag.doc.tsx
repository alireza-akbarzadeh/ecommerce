import { Link, Typography } from '@mui/material'

const HBTagDoc = () => {
  return (
    <div>
      <Typography variant="h4" component="h1">
        HBTag محتوای مستند
      </Typography>
      <Typography variant="h5" component="h2">
        HBTag
      </Typography>
      <Typography variant="h6" component="h3">
        کامپوننت
        <br />
        chip
        <br />
        متریال میباشد و همه ی پراپس های آن را پشتیبانی میکند و نسبت به طرح تغییر کرده است
      </Typography>
      <Typography variant="body1" component="p">
        این محتوا در صفحه مستندات موجود است.
      </Typography>

      <Link href="https://mui.com/material-ui/react-chip/#main-content/" target="_blank">
        Chip
      </Link>
    </div>
  )
}

export default HBTagDoc
