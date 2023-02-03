import { Divider, Typography } from '@mui/material'

const HBCountDownTimerDoc = () => {
  return (
    <div>
      <Typography component="h1" variant="h4">
        محتوای مستند
      </Typography>
      <Typography component="p">
        این کامپوننت یک span است و بصورت شرطی رندر میشود:
        <br />
        1- اگر زمانه به پایان برسد یک دکمه ی لینک میدهد که میتوانیم از بیرون برای آن متن بفرستیم
        (linkText) و یک onClick و یک mode میگیرد که دارای مقادیر
        <br />
        type Mode = 'day' | 'hours' | 'minutes' | 'seconds'; میباشد
        <br />
        2- در غیر اینصورت تایمر را نمایش میدهد
      </Typography>
      <Divider />

      <Typography component="p">تایمر به صورت days:hours:minutes:seconds ساپورت میشود</Typography>
      <Divider />

      <Typography component="p">
        تایم مورد نظر برای targetDate را باید به
        <strong> دقیقه </strong>
        وارد کنیم
        <br />
        برای تبدیل کردن تایم وارد شده به فرمت نمایشی دلخواه از
        <strong> mode </strong>
        استفاده میکنیم
      </Typography>
      <Divider />

      <Typography component="p" variant="h6">
        نکته! برای این کامپوننت forwardRef حذف شده است
      </Typography>
    </div>
  )
}

export default HBCountDownTimerDoc
