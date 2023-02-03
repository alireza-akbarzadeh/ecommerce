import { Divider, List, ListItem, Typography } from '@mui/material'
import { Box } from '@mui/system'
type propetiesType = { name: string; desc: string; children?: propetiesType[] }

type customListProps = {
  properties: propetiesType[]
}
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
                  <Box sx={{ pl: 6, mb: 3 }}>
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

const ruleProperties: propetiesType[] = [
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
const mainProperties: propetiesType[] = [
  {
    name: 'value',
    desc: 'این پارامتر اجباری بوده و بر اساس مفدار این پارامتر می توان validate صورت پذیرد.',
  },
  {
    name: 'rules',
    desc: 'این فیلد به صورت آرایه بوده و باید شامل موارد زیر باشد. به تعداد index های موجود در این آرایه متن نمایش داده خواهد شد.',
    children: ruleProperties,
  },
]
const HBValidatorFieldDoc = () => {
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

export default HBValidatorFieldDoc
