import { HBIcon, HBIconType } from '@hasty-bazar/core'
import { Box, Typography, useTheme } from '@mui/material'
import { ICellRendererParams } from 'ag-grid-community'
import React from 'react'

export type PasswordElementProps = {
  icon: HBIconType
  title?: string
  color: string
}

const PasswordElement = ({ icon, title, color }: PasswordElementProps) => {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <HBIcon type={icon} style={{ color }} size="small" sx={{ mt: 1 }} />
      <Typography variant="subtitle2">{title}</Typography>
    </Box>
  )
}

export interface PasswordParamsValueType extends ICellRendererParams {
  success?: string
  expired?: string
  notSet?: string
}

export default function PasswordStatus({
  value,
  success,
  expired,
  notSet,
}: PasswordParamsValueType) {
  const { palette } = useTheme()
  if (value === 1)
    return <PasswordElement icon="check" title={success} color={palette.success.main} />
  else if (value === 2)
    return <PasswordElement icon="clockNine" title={expired} color={palette.warning.main} />
  else if (value === 0)
    return <PasswordElement icon="timesCircle" title={notSet} color={palette.error.main} />
  return <div>{value}</div>
}
