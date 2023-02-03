import { Divider, List, ListItem, Typography } from '@mui/material'

type propetiesType = { name: string; desc: string }
const properties: propetiesType[] = [
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
]
const HBemailPhoneNumberControllerDoc = () => {
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
      <Typography>این کامپوننت دارای ۳ وردی می باشد.</Typography>
      <Divider sx={{ marginTop: (theme) => theme.spacing(3) }} />

      <List
        sx={{
          width: '100%',
          bgcolor: 'background.paper',
        }}
      >
        {properties.map(({ name, desc }) => {
          return (
            <>
              <ListItem>
                <Typography variant="h6" component="span">
                  {name}
                </Typography>
              </ListItem>
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

export default HBemailPhoneNumberControllerDoc
