import { Box, Divider, List, ListItem, Stack, Typography } from '@mui/material'

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
              children.map(({ name, desc }, key) => {
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

const mainProperties: propetiesType[] = [
  {
    name: 'formName',
    desc: 'عبارت مورد استفاده در کامپوننت فورم. این نام در خروجی state فرم دریافت خواهد شد.',
  },
  {
    name: 'linkText',
    desc: 'عبارت روبروی چک باکس می باشد.',
  },
  {
    name: 'linkOnclick',
    desc: 'اجرای عملیات در صورت کلیک بر روی نوشته.',
  },
  {
    name: 'sx',
    desc: 'استایل ها در این پراپرتی ارسال می گردد.',
  },
]

const HBTextFieldControllerDoc = () => {
  return (
    <Stack spacing={4}>
      <Typography component="h1" variant="h4">
        محتوای مستند
        <Typography component="p">برای استفاده طبق داکیونت عمل شود</Typography>
      </Typography>

      <Typography>
        این کامپوننت حتما باید به صورت wrap شده زیر کامپوننت HBForm یا FormProvider کتابخانه
        react-hook-form استفاده شود.
      </Typography>
      <Typography>
        support fa numbers: add optional function utility for fa to en converter in all our input
        controllers.
        <br />
        this converter is active by default, you can turn off digit mapping by passing false to
        digitMapper property.
        <br />
        in number mode added new form rule to allow ۰-۹ characters.
      </Typography>
      <Divider sx={{ mt: 3 }} />
      <CustomList properties={mainProperties} />
    </Stack>
  )
}

export default HBTextFieldControllerDoc
