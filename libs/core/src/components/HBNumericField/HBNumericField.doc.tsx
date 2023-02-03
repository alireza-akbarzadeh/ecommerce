import { Link, Typography } from '@mui/material'

const HBNumericField = () => {
  return (
    <div>
      <Typography component={'h1'} variant="h4">
        محتوای مستند
      </Typography>

      <Typography component={'p'}>
        در فایل اصلی :
        <br />
        برای نمایش دادن فیلد عددی به همراه جداککنده اعداد مورد استفاده قرار میگیرد.
      </Typography>
      <div>
        سایت مرجع:
        <Link href="https://s-yadav.github.io/react-number-format/docs/intro/" target="_blank">
          Numeric field
        </Link>
      </div>
    </div>
  )
}

export default HBNumericField
