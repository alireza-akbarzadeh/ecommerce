import { Typography } from '@mui/material'

const HBChipDoc = () => {
  return (
    <div>
      <Typography variant="h4" component="h1">
        محتوای مستند
      </Typography>
      <Typography variant="body1" component="p">
        کامپوننت تگ دارای چهار پراپرتی می باشد
      </Typography>

      <dl>
        <dt>
          <Typography variant="subtitle1" component="p">
            color
          </Typography>
        </dt>
        <dd>
          <Typography variant="subtitle2" component="p">
            رنگ تگ را مشخص می کند
          </Typography>
        </dd>
        <dt>
          <Typography variant="subtitle1" component="p">
            text
          </Typography>
        </dt>
        <dd>
          <Typography variant="subtitle2" component="p">
            متن قابل نمایش در تگ
          </Typography>
        </dd>
        <dt>
          <Typography variant="subtitle1" component="p">
            leftIcon
          </Typography>
        </dt>
        <dd>
          <Typography variant="subtitle2" component="p">
            آیکون قابل نمایش در چپ
          </Typography>
        </dd>
        <dt>
          <Typography variant="subtitle1" component="p">
            rightIcon
          </Typography>
        </dt>
        <dd>
          <Typography variant="subtitle2" component="p">
            آیکون قابل نمایش در راست
          </Typography>
        </dd>
      </dl>
    </div>
  )
}

export default HBChipDoc
