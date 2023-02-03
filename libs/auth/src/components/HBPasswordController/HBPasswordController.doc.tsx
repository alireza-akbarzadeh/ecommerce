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

const mainProperties: propetiesType[] = [
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
]

const HBPasswordControllerDoc = () => {
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

export default HBPasswordControllerDoc
