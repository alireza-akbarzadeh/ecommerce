import { fontWeights } from '@hasty-bazar/material-provider'
import { Stack, Typography } from '@mui/material'
import { ReactNode } from 'react'

export interface InfoItemProps {
  title: string
  value: ReactNode
}
function InfoItem({ title, value }: InfoItemProps) {
  return (
    <Stack display="flex" py={1} flexDirection="row" gap={1.5}>
      <Typography variant="subtitle2" color="text.secondary">
        {title}
      </Typography>
      <Typography
        sx={{ wordBreak: 'break-word', userSelect: 'text' }}
        variant="subtitle2"
        fontWeight={fontWeights.fontWeightMedium}
      >
        {value}
      </Typography>
    </Stack>
  )
}

export default InfoItem
