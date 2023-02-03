import { Link, Typography } from '@mui/material'

const HBInputBaseDoc = () => {
  return (
    <div>
      <Typography component="h1" variant="h4">
        محتوای مستند
      </Typography>
      <Typography component="p">
        یک پکیج است که روی پروژه نصب میشود.
        <Link href="https://mui.com/material-ui/react-text-field/#integration-with-3rd-party-input-libraries">
          برای همگام سازی با متریال مطالعه شود
        </Link>
      </Typography>
      <Typography component="p">
        مرجع:
        <Link href="https://github.com/uNmAnNeR/imaskjs">imaskjs</Link> -
        <Link href="https://github.com/uNmAnNeR/imaskjs/tree/master/packages/react-imask">
          React IMask Plugin
        </Link>
      </Typography>
    </div>
  )
}

export default HBInputBaseDoc
