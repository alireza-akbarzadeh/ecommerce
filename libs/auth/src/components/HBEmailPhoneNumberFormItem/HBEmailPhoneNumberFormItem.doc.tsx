import { Divider, List, ListItem, Typography } from '@mui/material'

type propetiesType = { name: string; desc: string }
const properties: propetiesType[] = [
  {
    name: 'headerTitle',
    desc: 'هدر اصلی فورم می باشد و به صورت رشته ای می باشد',
  },
  {
    name: 'headerSubTitle',
    desc: 'نوشته زیر هدر می باشد. می توان جهت نمایش توضیحات استفاده گردد. ورودی به صورت رشته می باشد.',
  },
  {
    name: 'formError',
    desc: 'اگر مقدار ورودی فرم از قوانین تعیین شده تبعیت نکند این متن در زیر کامپوننت ورودی به رنگ قرمز نمایش داده خواهد شد.',
  },
  {
    name: 'formName',
    desc: 'عبارت مورد استفاده در کامپوننت فورم. این نام در خروجی state فرم دریافت خواهد شد.',
  },
  {
    name: 'formLabel',
    desc: 'لیبل textField می باشد.',
  },
  {
    name: 'firstBtnText',
    desc: 'نوشته داخل دکمه اصلی می باشد',
  },
  {
    name: 'secondBtnText',
    desc: 'نوشته داخل دکمه دوم می باشد',
  },
  {
    name: 'firstBtnOnclick',
    desc: 'در صورتی که دکمه از نوع submit نباشد با این پراپرتی امکان انجام عملیات فراهم می شود',
  },
  {
    name: 'secondBtnOnclick',
    desc: 'جهت انجام عملیات در هنگام کلیک بر روی دکمه دوم',
  },
  {
    name: 'children',
    desc: 'در صورتی که این مقدار بین کاموننت پاس داده شود بین دکمه ها و ورودی نمایش داده خواهد شد.',
  },
]
const HBEmailPhoneNumberDoc = () => {
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
      <Typography>پراپرتی های ورودی به شرح ذیل می باشد.</Typography>
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
      <Typography>این ورودی ها به جهت چند زبانه شدن به پراپس های ورودی اضافه شده اند.</Typography>
    </div>
  )
}

export default HBEmailPhoneNumberDoc
