import Typography from '@mui/material/Typography'
const HBSkeletonDoc = () => {
  return (
    <div>
      <Typography variant="h4" component="h1">
        محتوای مستند
      </Typography>
      <Typography variant="h5" component="h2">
        Skeleton
      </Typography>
      <Typography variant="subtitle1" component="p">
        مستندات موجود برای این کامپوننت در لینک زیر موجود است
      </Typography>
      <Typography variant="subtitle2" component="p">
        <a href="https://mui.com/material-ui/api/skeleton/" target="_blank" rel="noreferrer">
          مستندات کامپوننت
        </a>
      </Typography>
    </div>
  )
}

export default HBSkeletonDoc
