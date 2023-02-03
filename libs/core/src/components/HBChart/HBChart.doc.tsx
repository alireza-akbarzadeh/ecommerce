import {
  Box,
  Link,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material'

type TableRowItemProps = {
  name: string
  type: string
  defaultText?: string
  description?: string
}

const TableRowItem = ({ name, type, defaultText, description }: TableRowItemProps) => {
  return (
    <TableRow>
      <TableCell>{name}</TableCell>
      <TableCell>{type}</TableCell>
      <TableCell>{defaultText}</TableCell>
      <TableCell>{description}</TableCell>
    </TableRow>
  )
}

const HBChartDoc = () => {
  return (
    <Box>
      <Typography variant="h4" component="h1">
        محتوای مستند
      </Typography>
      <Typography variant="body1" component="p">
        اطلاعات مربوط به چارت
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Type</TableCell>
            <TableCell>Default</TableCell>
            <TableCell>Description</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRowItem
            name={'chartType'}
            type="line | bar | pie | area"
            description="Type of chart"
            defaultText="line"
          />
          <TableRowItem
            name={'chartTheme'}
            type="light | dark"
            description="Chart theme"
            defaultText="light"
          />
          <TableRowItem
            name={'onCategoryClick'}
            type="(params: any, chart: any) => void"
            description="Chart category click event"
            defaultText=""
          />
          <TableRowItem
            name={'chartStyle'}
            type="CSSProperties"
            description="Chart style"
            defaultText="height: '100%', width: '100%'"
          />
        </TableBody>
      </Table>
      <Box mt={2}>
        <Typography variant="h5">
          با توجه به گسترده بودن پراپرتی ها می توانید از لینک زیر برای دریافت مستندات استفاده کنید:
        </Typography>
        <Link href="https://echarts.apache.org/handbook/en/get-started/" target="_blank">
          https://echarts.apache.org/handbook/en/get-started/
        </Link>
      </Box>
    </Box>
  )
}

export default HBChartDoc
