import { Link } from '@mui/material'
import Typography from '@mui/material/Typography'
const HBSliderDoc = () => {
  return (
    <div>
      <Typography variant="h4" component="h1">
        محتوای مستند
      </Typography>
      <Typography variant="h6" component="h2">
        Slider{' '}
      </Typography>
      <Typography variant="subtitle1" component="p">
        برای استفاده از مستندات استفاده از اسلایدر می توانید از لینک زیر استفاده نمایید
      </Typography>
      <Link href="https://mui.com/material-ui/api/slider/" target="_blank" rel="noreferrer">
        Slider API documentation
      </Link>
    </div>
  )
}

export default HBSliderDoc
