import { HBIcon } from '@hasty-bazar/core'
import { ICellRendererParams } from 'ag-grid-community'
import React from 'react'

export default function GridIsDefaultColumn({ value }: ICellRendererParams) {
  if (value) {
    return <HBIcon type="check" sx={{ color: (theme) => theme.palette.success.main }} />
  }
  return <HBIcon type="timesCircle" sx={{ color: (theme) => theme.palette.error.main }} />
}
