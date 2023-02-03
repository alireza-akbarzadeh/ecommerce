import Typography from '@mui/material/Typography'

const HBUploaderDoc = () => {
  return (
    <div>
      <Typography variant="h4" component="h1">
        محتوای مستند
      </Typography>

      <dl>
        <dt>accept</dt>
        <dd>
          <Typography variant="subtitle1" component="span">
            پسوند فایل های مجاز
          </Typography>
        </dd>
        <dt>maxFiles</dt>
        <dd>
          <Typography variant="subtitle1" component="span">
            حداکثر فایل قابل دریافت
          </Typography>
        </dd>
        <dt>maxSize</dt>
        <dd>
          <Typography variant="subtitle1" component="span">
            حداکثر حجم فایل
          </Typography>
        </dd>
        <dt>minSize</dt>
        <dd>
          <Typography variant="subtitle1" component="span">
            حداقل حجم فایل
          </Typography>
        </dd>
        <dt>noClick</dt>
        <dd>
          <Typography variant="subtitle1" component="span">
            آیا باکلیک فایل انتخاب گردد؟
          </Typography>
        </dd>
        <dt>noKeyboard</dt>
        <dd>
          <Typography variant="subtitle1" component="span">
            آیا کیبورد فعال باشد؟
          </Typography>
        </dd>
        <dt>noDrag</dt>
        <dd>
          <Typography variant="subtitle1" component="span">
            آیا با کشیدن فایل انتخاب گردد؟
          </Typography>
        </dd>
      </dl>

      <Typography variant="body1" component="p">
        شما می توانید از طریق لینک زیر مستندات مربوط به آپلود کامپوننت را مشاهده نمایید
      </Typography>

      <div>
        <a href="https://react-dropzone.js.org/#src" target="_blank" rel="noreferrer">
          <Typography variant="subtitle2" component="h1">
            مشاهده مستندات آپلود کامپوننت
          </Typography>
        </a>
      </div>
    </div>
  )
}

export default HBUploaderDoc
