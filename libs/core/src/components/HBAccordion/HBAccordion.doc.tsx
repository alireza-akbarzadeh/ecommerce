import { Link, Typography } from '@mui/material'

const HBAccordionDoc = () => {
  return (
    <div>
      <Typography component={'h1'} variant="h4">
        محتوای مستند
      </Typography>
      <Typography component={'p'}>
        این کامپوننت دو تا پراپ میگیرد یکی برای عنوان (summary) و یکی هم برای جزئیات (detail)
      </Typography>
      <Typography component={'p'}>
        برای اینکه به طور همزمان فقط یکی از آکاردئون ها باز باشد، باید از onChange استفاده کرد.
        <Link
          target="_blank"
          href="https://mui.com/material-ui/react-accordion/#controlled-accordion"
        >
          Controlled accordion
        </Link>
      </Typography>
      <Typography component={'p'}>
        مرجع: <Link href="https://mui.com/material-ui/react-accordion/">Accordion</Link>
      </Typography>
    </div>
  )
}

export default HBAccordionDoc
