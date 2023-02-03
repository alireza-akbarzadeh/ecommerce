import { Typography } from '@mui/material'
import { ICellRendererParams } from 'ag-grid-community'
import { ProductStage } from '../../enum/StatusStage'

export default function ProductStatus({ value, data }: ICellRendererParams) {
  const { stateCode } = data
  return (
    stateCode && (
      <Typography
        p={2}
        color={
          stateCode == ProductStage.draft
            ? 'grey.600'
            : stateCode == ProductStage.release
            ? 'success.main'
            : 'error.main'
        }
        bgcolor={
          stateCode == ProductStage.draft
            ? 'grey.200'
            : stateCode == ProductStage.release
            ? 'success.light'
            : 'error.light'
        }
        borderRadius={(theme) => theme.spacing(2)}
        component="span"
        variant={'subtitle2'}
      >
        {value}
      </Typography>
    )
  )
}
