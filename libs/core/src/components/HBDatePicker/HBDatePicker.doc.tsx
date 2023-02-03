import { Link, Typography } from '@mui/material'

const HBDatePickerDoc = () => {
  return (
    <div>
      <Typography component="h1" variant="h4">
        محتوای مستند
      </Typography>
      <Typography component="p">برای استفاده طبق داکیونت عمل شود</Typography>

      <Typography>
        منبع:
        <Link
          href="https://mui.com/x/react-date-pickers/date-picker/#jalali-calendar-system"
          target={'_blank'}
        >
          DatePicker
        </Link>
      </Typography>
    </div>
  )
}

export default HBDatePickerDoc
