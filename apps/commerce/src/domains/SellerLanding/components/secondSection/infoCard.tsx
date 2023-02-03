import { HBIcon, HBIconProps, hexToRgb } from '@hasty-bazar/core'
import { pxToRem } from '@hasty-bazar/material-provider'
import { Stack, Typography } from '@mui/material'

export interface InfoCardProps {
  icon: HBIconProps['type']
  title: string
  description: string
}
function InfoCard({ icon, title, description }: InfoCardProps) {
  return (
    <Stack display="flex" flexDirection="column" gap={2}>
      <Stack
        sx={{
          width: 40,
          height: 40,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: '50%',
          bgcolor: ({ palette: { info } }) => hexToRgb(info.light, 0.12),
        }}
      >
        <Stack
          sx={{
            width: 33,
            height: 33,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: '50%',
            bgcolor: ({ palette: { info } }) => hexToRgb(info.light, 0.32),
          }}
        >
          <HBIcon
            type={icon}
            size="small"
            sx={{
              color: 'info.main',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          />
        </Stack>
      </Stack>
      <Typography variant="h6" sx={{ fontSize: pxToRem(16) }}>
        {title}
      </Typography>
      <Typography variant="subtitle2" color="text.secondary" sx={{ lineHeight: pxToRem(20) }}>
        {description}
      </Typography>
    </Stack>
  )
}

export default InfoCard
