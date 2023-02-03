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

const HBAgGridDoc = () => {
  return (
    <Box>
      <Typography variant="h4" component="h1">
        محتوای مستند
      </Typography>
      <Typography variant="body1" component="p">
        کامپوننت AG Grid دارای پراپرتی های گوناگونی است ، برای اطلاع از مستندات بیشتر می توانید از
        لینک زیر استفاده کنید
      </Typography>
      <Typography variant="body1" component="p">
        <Link href="https://www.ag-grid.com/react-data-grid/" target="_blank">
          مستندات Ag Grid
        </Link>
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
            name={'columnDefs'}
            type="array"
            description="Each Column Definition results in one Column"
          />
          <TableRowItem
            name={'defaultColDef'}
            type="array"
            description="Default Column Properties"
          />
          <TableRowItem
            name={'rowSelection'}
            type="string"
            description="Options - allows click selection of rows"
          />
          <TableRowItem
            name={'enableRangeSelection'}
            type="boolean"
            description="Range Selection is enabled using the following grid option"
          />
          <TableRowItem
            name={'suppressRowClickSelection'}
            type="boolean"
            description="rows won't be selected when clicked. "
          />
          <TableRowItem
            name={'rowDragManaged'}
            type="boolean"
            description="Managed dragging is enabled with the property"
          />
          <TableRowItem
            name={'pagination'}
            type="boolean"
            description="To enable pagination set the grid property"
          />
          <TableRowItem
            name={'paginationPageSize'}
            type="number"
            description="A dropdown to change the page size dynamically is available. "
          />
          <TableRowItem
            name={'cacheBlockSize'}
            type="number"
            description="it will load each pagination page on demand as the user goes to the next page"
          />
          <TableRowItem
            name={'sideBar'}
            type="string | array | SideBarDef"
            description="The side bar is configured using the grid property"
          />
          <TableRowItem
            name={'toolbarActions'}
            type="MenuItemProps[]"
            description="Adjust the action buttons at the top of the grid"
          />
          <TableRowItem
            name={'totalRows'}
            type="number"
            description="Total number of rows in the table"
          />
          <TableRowItem
            name={'rowModelType'}
            type="clientSide | infinite | viewport | serverSide"
            description="Sets the row model type."
          />
          <TableRowItem
            name={'serverSideStoreType'}
            type="full | partial"
            description="Whether to use Full Store or Partial Store for storing rows"
          />
          <TableRowItem
            name={'onGridReady'}
            type="function"
            description="The grid API and column API are provided to you via the onGridReady() event callback."
          />
        </TableBody>
      </Table>
    </Box>
  )
}

export default HBAgGridDoc
