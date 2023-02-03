import { HBIcon, HBIconProps, hexToRgb } from '@hasty-bazar/core'
import { Stack, Typography } from '@mui/material'

interface InfoCardProps {
  icon: HBIconProps['type']
  title: string
  description: string
}
function InfoCard({ icon, title, description }: InfoCardProps) {
  return (
    <Stack
      sx={{
        border: 1,
        p: 2,
        borderColor: 'grey.300',
        borderRadius: 2,
        display: 'flex',
        width: 213,
        height: 70,
        gap: 3,
        flexDirection: 'row',
      }}
    >
      <Stack
        sx={{
          bgcolor: ({ palette: { info } }) => hexToRgb(info.light, 0.16),
          width: 32,
          borderRadius: '50%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: 32,
        }}
      >
        <Stack
          sx={{
            bgcolor: ({ palette: { info } }) => hexToRgb(info.light, 0.32),
            width: 26,
            height: 26,
            borderRadius: '50%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <HBIcon
            type={icon}
            sx={{
              color: 'info.main',
              fontSize: (theme) => theme.spacing(3.4),
              display: 'flex',
            }}
          />
        </Stack>
      </Stack>
      <Stack>
        <Typography mb={3} variant="subtitle1">
          {title}
        </Typography>
        <Typography color={'text.secondary'} variant="subtitle2">
          {description}
        </Typography>
      </Stack>
    </Stack>
  )
}

export default InfoCard
