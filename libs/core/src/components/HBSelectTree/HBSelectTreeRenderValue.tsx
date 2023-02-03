import { Typography } from '@mui/material'
import React from 'react'
import { HBSelectTreeDataProps } from './HBSelectTree'

export type HBSelectTreeRenderValueProps = {
  value: string | string[] | unknown
  treeItemSelect: HBSelectTreeDataProps[]
  label: string
}

export default function HBSelectTreeRenderValue({
  value,
  treeItemSelect,
  label,
}: HBSelectTreeRenderValueProps) {
  if (value && typeof value === 'string') {
    return <Typography variant="button">{treeItemSelect?.[0]?.label}</Typography>
  } else if (value && Array.isArray(value) && value.length > 0) {
    return (
      <Typography
        variant="button"
        sx={{
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          width: '98%',
        }}
      >
        {treeItemSelect.map((item) => item.label).join(', ')}
      </Typography>
    )
  } else {
    return null
  }
}
