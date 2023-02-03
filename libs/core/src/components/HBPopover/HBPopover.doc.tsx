import { Link, Typography } from '@mui/material'

const HBPopoverDoc = () => {
  return (
    <div>
      <Typography component="h1" variant="h4">
        محتوای مستند
      </Typography>
      <Typography component="p">
        محتوای این کامپوننت از بیرون توسط کاربر گرفته میشود و پس از کلیک روی المان مد نظر ظاهر میشود
        <br />
        برای استفاده طبق داکیونت عمل شود
      </Typography>

      <Typography component="p" variant="h5">
        نکته!
        <br />
        در فایل stories به مشکل برمیخورد و ارور میدهد که پراپرتی open داده نشده است. برای حل این
        مشکل بصورت دست یآن را اضافه کردیم
      </Typography>

      <Typography>
        منبع:
        <Link href="https://mui.com/material-ui/react-popover/" target={'_blank'}>
          Popover
        </Link>
      </Typography>
    </div>
  )
}

export default HBPopoverDoc
