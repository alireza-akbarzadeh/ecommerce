import { StateCode } from '@hasty-bazar/admin-shared/core/enums/ReasonMangementType'
import { Typography } from '@mui/material'
import { ICellRendererParams } from 'ag-grid-community'

export default function StateReason({ value, data }: ICellRendererParams) {
  return (
    <Typography
      p={2}
      color={
        value == StateCode.draft
          ? 'grey.600'
          : value == StateCode.active
          ? 'success.main'
          : 'error.main'
      }
      bgcolor={
        value == StateCode.draft
          ? 'grey.200'
          : value == StateCode.active
          ? 'success.light'
          : 'error.light'
      }
      borderRadius={(theme) => theme.spacing(1)}
      component="span"
      variant={'subtitle2'}
    >
      {data?.stateTitle}
    </Typography>
  )
}
