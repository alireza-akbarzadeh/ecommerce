import { Box } from '@mui/material'
import React from 'react'

export default function Color({ color }: { color: string }) {
  return <Box sx={{ width: 20, height: 20, backgroundColor: color, borderRadius: '50%' }} />
}
