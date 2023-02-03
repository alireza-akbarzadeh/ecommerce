import { Divider, Link, List, ListItem, Typography } from '@mui/material'

type propetiesType = { name: string; desc: string; link?: string }
const properties: propetiesType[] = [
  {
    name: 'sx',
    desc: 'حهت اعمال استایل به کامپوننت از این پراپرتی استفاده میگردد.',
  },
  {
    name: 'formName',
    desc: 'عبارت مورد استفاده در کامپوننت فورم. این نام در خروجی state فرم دریافت خواهد شد.',
  },
  {
    name: 'errorMessage',
    desc: 'با توجه به اینکه کامپوننت جهت بررسی ایمیل یا شماره تلفن ایجاد شده است در صورتی که پارامتر ورودی شامل موارد ذکر شده نباشد این متن در پروایدر فرم بازمی گردد.',
  },
  {
    name: 'label',
    desc: 'لیبل textField می باشد.',
  },
  {
    name: 'verificationCodeTime',
    desc: 'مدت زمانی که تایمر به صورت معکوس میشمارد تا به صفر برسد.',
  },
  {
    name: 'timeoutText',
    desc: 'عبارتی که پس از اتمام تایمر به کاربر نمایش داده میشود.',
  },
  {
    name: 'timeoutBtnCallBack',
    desc: 'عملیاتی که پس از کلیک بر روی دکمه timeoutText انجام میگردد در این پراپرتی قرار میگیرد.',
  },
  {
    name: 'extraTimerText',
    desc: 'این عبارت در زمانی که تایمر در حال شمارش است به انتهای تایمر افزوده می شود.',
  },
  {
    name: 'formRules',
    desc: 'این پراپرتی جهت اعمال قوانین جهت فیلد ورودی می باشد. و از react-hook-form برای این مورد استفاده شده است.',
    link: 'https://react-hook-form.com/api/useform/register#options',
  },
]

const HBAuthenticationControllerDoc = () => {
  return (
    <div>
      <Typography component="h1" variant="h4">
        محتوای مستند
      </Typography>
      <Typography component="p">برای استفاده طبق داکیونت عمل شود</Typography>

      <Typography>
        این کامپوننت حتما باید به صورت wrap شده زیر کامپوننت HBForm یا FormProvider کتابخانه
        react-hook-form استفاده شود.
      </Typography>
      <Divider sx={{ mt: 3 }} />

      <List
        sx={{
          width: '100%',
          bgcolor: 'background.paper',
        }}
      >
        {properties.map(({ name, desc, link }) => {
          return (
            <>
              <ListItem>
                <Typography variant="h6" component="span">
                  {name}
                </Typography>
              </ListItem>
              {link && <Link href={link}>لینک ارتباطی</Link>}
              <Typography variant="subtitle1" component="h5" color={'gray'}>
                {desc}
              </Typography>
              <Divider />
            </>
          )
        })}
      </List>
    </div>
  )
}

export default HBAuthenticationControllerDoc
