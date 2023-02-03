import { Box, Divider, List, ListItem, Typography } from '@mui/material'

type propertiesType = { name: string; desc: string; children?: propertiesType[] }

type customListProps = {
  properties: propertiesType[]
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
            {children?.map(({ name, desc }, key) => {
              return (
                <Box sx={{ pr: 6, mb: 3 }} key={key}>
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

const mainProperties: propertiesType[] = [
  {
    name: 'formName',
    desc: 'عبارت مورد استفاده در کامپوننت فورم. این نام در خروجی state فرم دریافت خواهد شد.',
  },
  {
    name: 'arrayHelperText',
    desc: 'شامل آرایه هایی از helperText ها می باشد با این تفاوت که key برابر با rule فورم ولیدتور و value باید مقدار عبارت مورد نظر باشد.',
  },
  {
    name: 'sx',
    desc: 'استایل ها در این پراپرتی ارسال می گردد.',
  },
  {
    name: 'inputSx',
    desc: 'استایل های مربوط به inputText در این پراپرتی ارسال می گردد.',
  },
]

const HBFormItemTextFieldDoc = () => {
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
      <Typography>
        اگر helperTextType برابر arrayHelperText یا arrayHelperTextByClick باشد جهت عملکرد درست باید
        HBForm با پراپرتی criteriaMode="all" مقدار دهی گردد
      </Typography>

      <Typography>
        این کامپوننت دارای تمامی ورودی های react-hook-form و HBTextfield می باشد.
      </Typography>
      <Typography>
        این کامپوننت دارای یک هوک جهت ولیدتور به صورت debunce میباشد. ورودی این هوک یک فانکشن جهت
        اجرا به صورت debunce و تایم دیبانس می باشد. خروجی مستقیما در validate rule قرار میگیرد.
      </Typography>
      <Divider sx={{ mt: 3 }} />
      <CustomList properties={mainProperties} />
    </div>
  )
}

export default HBFormItemTextFieldDoc
