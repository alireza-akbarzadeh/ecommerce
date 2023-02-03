import { Typography } from '@mui/material'

const HBAutoCompleteDoc = () => {
  return (
    <div>
      <Typography variant="h4" component="h1">
        محتوای مستند
      </Typography>
      <dl>
        <dt>Options</dt>
        <dd>یک آرایه شامل مقادیر ورودی کامپوننت می باشد</dd>
        <dt>label</dt>
        <dd>عنوان نمایشی داخل کامپوننت</dd>
      </dl>
      <Typography variant="subtitle1" component="h4">
        مستندات بیشتر کامپوننت
      </Typography>
      <a href="https://mui.com/material-ui/api/autocomplete/" target="_blank" rel="noreferrer">
        <Typography variant="subtitle1" component="div">
          مستندات autocomplete
        </Typography>
      </a>
    </div>
  )
}

export default HBAutoCompleteDoc
