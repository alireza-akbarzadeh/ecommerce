import { HBIcon, HBIconProps } from '@hasty-bazar/core'
import { Stack, Typography } from '@mui/material'

export interface InfoCardProps {
  icon: HBIconProps['type']
  title: string
  description: string
}

export default function InfoCard({ icon, title, description }: InfoCardProps) {
  return (
    <Stack
      sx={{
        bgcolor: 'grey.100',
        width: '100%',
        display: 'flex',
        justifyContent: 'start',
        alignItems: 'center',
        height: 207,
        flexDirection: 'column',
        px: 10,
        py: 4,
        borderRadius: 2,
      }}
    >
      <HBIcon type={icon} />
      <Typography variant="h6" sx={{ mt: 2.5, mb: 4 }}>
        {title}
      </Typography>
      <Typography
        variant="subtitle2"
        color="text.secondary"
        sx={{ lineHeight: (theme) => theme.spacing(5), textAlign: 'center' }}
      >
        {description}
      </Typography>
    </Stack>
  )
}
