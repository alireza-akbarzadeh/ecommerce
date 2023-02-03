import { Box, Typography } from '@mui/material'
import React from 'react'

export type SummaryItemProps = {
  title: string
  value: number
  suffix?: string
}
export default function SummaryItem({ title, value, suffix }: SummaryItemProps) {
  return (
    <Box
      bgcolor="grey.100"
      p={[8, 4]}
      borderRadius={2}
      display="flex"
      justifyContent="center"
      alignItems="center"
      gap={2}
    >
      <Typography variant="subtitle1" color="primary.main">
        {title}
      </Typography>
      <Typography variant="subtitle1" color="common.black">
        {value && value?.toLocaleString()}
      </Typography>
      {suffix && (
        <Typography variant="subtitle1" color="common.black">
          {suffix}
        </Typography>
      )}
    </Box>
  )
}
