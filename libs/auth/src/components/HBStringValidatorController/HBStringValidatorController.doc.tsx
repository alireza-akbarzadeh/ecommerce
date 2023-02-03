import { Divider, List, ListItem, Typography } from '@mui/material'
import { Box } from '@mui/system'

type PropTypes = { name: string; desc: string; children?: PropTypes[] }

type customListProps = {
  properties: PropTypes[]
}
const CustomList = ({ properties }: customListProps) => {
  return (
    <List
      sx={{
        width: '100%',
        bgcolor: 'background.paper',
      }}
    >
      {properties.map(({ name, desc, children }, key) => {
        return (
          <Box key={key}>
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
          </Box>
        )
      })}
    </List>
  )
}

const ruleProperties: PropTypes[] = [
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
const mainProperties: PropTypes[] = [
  {
    name: 'formName',
    desc: 'عبارت مورد استفاده در کامپوننت فورم. این نام در خروجی state فرم دریافت خواهد شد.',
  },
  {
    name: 'label',
    desc: 'لیبل textField می باشد.',
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

const HBChangePasswordControllerDoc = () => {
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

export default HBChangePasswordControllerDoc
