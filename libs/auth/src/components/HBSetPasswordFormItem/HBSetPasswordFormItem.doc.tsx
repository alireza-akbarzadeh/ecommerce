import { Divider, List, ListItem, Typography } from '@mui/material'
import { Box } from '@mui/system'

type PropsTypes = { name: string; desc: string; children?: PropsTypes[] }

type customListProps = {
  properties: PropsTypes[]
}

const ruleProperties: PropsTypes[] = [
  {
    name: 'isActive',
    desc: 'این ورودی از جنس boolean بوده و اگر برابر با true باشد نوشته به رنگ سبز خواهد بود.',
  },
  {
    name: 'text',
    desc: 'متن مورد نظر جهت نمایش به کاربر می باشد.',
  },
  {
    name: 'validator',
    desc: 'این ورودی باید از جنس regexp باشد و در صورتی که این ورودی مقدار دهی شود پارامتر isActive لحاظ نخواهد شد.',
  },
]
const mainProperties: PropsTypes[] = [
  {
    name: 'headerTitle',
    desc: 'هدر اصلی فورم می باشد و به صورت رشته ای می باشد',
  },
  {
    name: 'headerSubTitle',
    desc: 'نوشته زیر هدر می باشد. می توان جهت نمایش توضیحات استفاده گردد. ورودی به صورت رشته می باشد.',
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
  {
    name: 'sx',
    desc: 'استایل ها در این پراپرتی ارسال می گردد.',
  },
  {
    name: 'validatorFieldRules',
    desc: 'این فیلد به صورت آرایه بوده و باید شامل موارد زیر باشد. به تعداد index های موجود در این آرایه متن نمایش داده خواهد شد.',
    children: ruleProperties,
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

const HBChangePasswordFormItemDoc = () => {
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

export default HBChangePasswordFormItemDoc
