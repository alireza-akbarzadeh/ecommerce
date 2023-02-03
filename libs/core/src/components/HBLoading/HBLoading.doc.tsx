import { Typography } from '@mui/material'

const HBLoadingDoc = () => {
  return (
    <div>
      <Typography variant="h4" component="h1">
        محتوای مستند
      </Typography>
      <Typography variant="subtitle1" component="p">
        کامپوننت لودینگ برای نمایش انتظار استفاده می شود و شامل پراپرتی های زیر است
      </Typography>
      <dl>
        <dt>
          <Typography variant="subtitle1" component="p">
            speed
          </Typography>
        </dt>
        <dd>
          <Typography variant="subtitle2" component="p">
            سرعت چرخش بر حسب میلی ثانیه
          </Typography>
        </dd>
        <dt>
          <Typography variant="subtitle1" component="p">
            countCircle
          </Typography>
        </dt>
        <dd>
          <Typography variant="subtitle2" component="p">
            تعداد دایره قابل نمایش
          </Typography>
        </dd>
      </dl>
    </div>
  )
}

export default HBLoadingDoc
