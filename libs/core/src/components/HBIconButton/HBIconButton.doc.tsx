import { Box, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material'

const HBIconButtonDoc = () => {
  return (
    <Box>
      <Typography variant="h4" component="h1">
        محتوای مستند
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>name</TableCell>
            <TableCell>type</TableCell>
            <TableCell>default</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell>icon</TableCell>
            <TableCell>string | Icon</TableCell>
            <TableCell></TableCell>
          </TableRow>
          <TableRow>
            <TableCell>variant</TableCell>
            <TableCell>text | outlined</TableCell>
            <TableCell>outlined</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>iconSize</TableCell>
            <TableCell>small | medium | large</TableCell>
            <TableCell>small</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>placement</TableCell>
            <TableCell>bottom | left | right | top</TableCell>
            <TableCell>bottom</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>tooltip</TableCell>
            <TableCell>string</TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </Box>
  )
}

export default HBIconButtonDoc
