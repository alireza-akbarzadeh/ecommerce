import { Divider, List, ListItem, Typography } from '@mui/material'
import { Box } from '@mui/system'

type propetiesType = { name: string; desc: string; children?: propetiesType[] }

type customListProps = {
  properties: propetiesType[]
}

const mainProperties: propetiesType[] = [
  {
    name: 'headerTitle',
    desc: 'هدر اصلی فورم می باشد و به صورت رشته ای می باشد',
  },
  {
    name: 'headerSubTitle',
    desc: 'نوشته زیر هدر می باشد. می توان جهت نمایش توضیحات استفاده گردد. ورودی به صورت رشته می باشد.',
  },
  {
    name: 'emailFormName',
    desc: 'نام فرم ایمیل می باشد و در خروجی فرم مقدار این فیلد با این باز می گردد',
  },
  {
    name: 'emailFormLabel',
    desc: 'لیبل textField ایمیل می باشد.',
  },
  {
    name: 'emailFormErrorMessage',
    desc: 'رشته ورودی جهت نمایش به کاربر در صورت بروز خطا',
  },
  {
    name: 'passwordFormName',
    desc: 'نام فرم پسورد می باشد و در خروجی فرم مقدار این فیلد با این باز می گردد',
  },
  {
    name: 'passwordFormLabel',
    desc: 'لیبل textField پسورد می باشد.',
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
  {
    name: 'firstLinkText',
    desc: 'رشته لینک اصلی',
  },

  {
    name: 'secondLinkText',
    desc: 'رشته لینگ فرعی',
  },
  {
    name: 'firstLinkOnclick',
    desc: 'تابع ورودی لینک اصلی',
  },
  {
    name: 'secondLinkOnclick',
    desc: 'تابع ورودی لینک دوم',
  },
  {
    name: 'sx',
    desc: 'استایل ها در این پراپرتی ارسال می گردد.',
  },
]

const CustomList = ({ properties }: customListProps) => {
  return (
    <List
      sx={{
        width: '100%',
        bgcolor: 'background.paper',
      }}
    >
      {properties.map(({ name, desc, children }) => {
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
            {children && (
              <Typography sx={{ m: 2 }}>این پراپرتی باید شامل موارد زیر باشد.</Typography>
            )}
            {children &&
              children.map(({ name, desc }) => {
                return (
                  <Box sx={{ pr: 6, mb: 3 }}>
                    <Typography sx={{ m: 2 }}>{name}</Typography>
                    <Typography sx={{ m: 2 }}>{desc}</Typography>
                  </Box>
                )
              })}
            <Divider />
          </>
        )
      })}
    </List>
  )
}

const HBLoginFormItemDoc = () => {
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
      <Typography>این کامپوننت دارای 2 وردی می باشد.</Typography>
      <Divider sx={{ mt: 3 }} />
      <CustomList properties={mainProperties} />
    </div>
  )
}

export default HBLoginFormItemDoc
