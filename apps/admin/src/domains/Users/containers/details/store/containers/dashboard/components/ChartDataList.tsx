import { Box, Divider, Stack, SxProps, Theme, Typography } from '@mui/material'
import React from 'react'
import { useIntl } from 'react-intl'
import dashboardMessages from '../Dashboard.messages'

export type ChartGroupProps = {
  data: {
    count?: number
    percent?: number
    title?: string | null
  }[]
  sx?: SxProps<Theme>
}

export default function ChartDataList({ data, sx }: ChartGroupProps) {
  const { formatMessage } = useIntl()

  return (
    <Box sx={{ ...sx }}>
      {data?.map((item) => (
        <Stack direction="row" key={item.title} justifyContent="space-between" mb={4}>
          <Typography variant="subtitle1" color="primary.main">
            {item.title}
          </Typography>
          <Typography variant="subtitle1" color="info.main">
            {item.count}
          </Typography>
        </Stack>
      ))}
      <Divider sx={{ color: (theme) => theme.palette.grey[300] }} />
      <Stack direction="row" justifyContent="space-between" my={4}>
        <Typography variant="subtitle1" color="info.main">
          {formatMessage(dashboardMessages.total)}
        </Typography>
        <Typography variant="subtitle1" color="info.main">
          {data?.reduce((acc, item) => acc + item.count!, 0)}
        </Typography>
      </Stack>
    </Box>
  )
}
