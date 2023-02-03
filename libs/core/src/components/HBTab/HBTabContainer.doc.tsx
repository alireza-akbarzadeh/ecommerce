import { Link } from '@mui/material'
import Typography from '@mui/material/Typography'

const HBTabContainerDoc = () => {
  return (
    <div>
      <Typography variant="h4" component="h1">
        محتوای مستند
      </Typography>
      <Typography variant="subtitle2" component="p">
        <Link href="https://mui.com/material-ui/react-tabs/">MUI Tabs</Link>
      </Typography>
      <Typography variant="subtitle2" component="p">
        `value` {'=>'} {'{0}'}
      </Typography>
      <Typography variant="subtitle2" component="p">
        `tabTitles` {'=>'} {"['Title1', 'Title2']"}
        {'=>'} {'Array<string>'}
      </Typography>
      <Typography variant="subtitle2" component="p">
        `tabContents` {'=>'} {"['Content1', 'Content2']"}
        {'=>'} {'Array<string | ReactNode>'}
      </Typography>
    </div>
  )
}

export default HBTabContainerDoc
