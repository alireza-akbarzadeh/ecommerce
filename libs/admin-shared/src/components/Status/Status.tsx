import { Box } from '@mui/material'
import { ICellRendererParams } from 'ag-grid-community'
export interface ParamsValueType extends ICellRendererParams {
  active?: string
  inActive?: string
}

export type AlertElementType = {
  value?: string
  status: 'active' | 'inActive' | 'draft'
}

export const AlertElement = ({ value, status }: AlertElementType) => {
  return (
    <Box
      color={
        status === 'active' ? 'success.dark' : status === 'inActive' ? 'error.dark' : 'warning.dark'
      }
      bgcolor={
        status === 'active'
          ? 'success.light'
          : status === 'inActive'
          ? 'error.light'
          : 'warning.light'
      }
      borderRadius={2}
      py={1}
      px={2}
      component="span"
      sx={{
        width: 'fit-content',
      }}
    >
      {value}
    </Box>
  )
}

export default function Status({ value, active, inActive }: ParamsValueType) {
  return (
    <Box>
      {value === 1 || value === true ? (
        <AlertElement value={active} status="active" />
      ) : (
        <AlertElement value={inActive} status="inActive" />
      )}
    </Box>
  )
}
