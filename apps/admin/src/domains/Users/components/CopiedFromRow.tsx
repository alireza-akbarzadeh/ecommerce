import { HBIcon } from '@hasty-bazar/core'
import { Box, Typography } from '@mui/material'
import { spacing } from '@mui/system'
import { ICellRendererParams } from 'ag-grid-community'
import React from 'react'

type IStatusFinancial = ICellRendererParams

const StatusFinancial = ({ value }: IStatusFinancial) => {
  return (
    <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 1, color: 'info.main' }}>
      <Typography variant={'body1'} component={'span'}>
        ردیف یک
      </Typography>
      <HBIcon sx={{ mt: spacing({ mt: 1 }) }} type={'copyAlt'} />
    </Box>
  )
}

export default StatusFinancial
