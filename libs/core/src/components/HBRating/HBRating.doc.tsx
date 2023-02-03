import { Link, Typography } from '@mui/material'

const HBRatingDoc = () => {
  return (
    <div>
      <Typography component="h1" variant="h4">
        محتوای مستند
      </Typography>
      <Typography component="div">
        مرجع مطلب:
        <Link href="https://mui.com/material-ui/react-rating/" target="_blank">
          Rating
        </Link>
      </Typography>
    </div>
  )
}

export default HBRatingDoc
