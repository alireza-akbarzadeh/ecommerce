import { Link, Typography } from '@mui/material'

const HBSelectDoc = () => {
  return (
    <div>
      <Typography component="h1" variant="h4">
        محتوای مستند
      </Typography>
      <Typography component="p">
        مرجع:
        <Link href="https://mui.com/material-ui/react-select/" target="_blank">
          Select
        </Link>
      </Typography>
    </div>
  )
}

export default HBSelectDoc
