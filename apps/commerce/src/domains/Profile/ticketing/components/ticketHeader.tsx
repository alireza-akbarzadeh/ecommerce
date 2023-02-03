import { HBButton, HBIcon, HBIconProps } from '@hasty-bazar/core'
import { Stack, Theme, Typography, useMediaQuery } from '@mui/material'

interface TicketHeaderProps {
  title: string
  buttonText?: string
  icon?: HBIconProps['type']
  onButtonClick?: () => void
}
function TicketHeader({ title, buttonText, icon, onButtonClick }: TicketHeaderProps) {
  const breakpointSmDown = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'))

  return (
    <Stack
      px={4}
      py={2}
      bgcolor={'grey.100'}
      display={'flex'}
      flexDirection={'row'}
      alignItems={'center'}
      borderRadius={2}
      justifyContent="space-between"
    >
      <Typography variant={breakpointSmDown ? 'subtitle2' : 'h6'}>{title}</Typography>
      {buttonText && (
        <HBButton
          variant="outlined"
          color="secondary"
          onClick={onButtonClick}
          sx={{
            display: 'flex',
            gap: 3,
            width: 102,
            minWidth: 102,
            alignItems: 'center',
          }}
        >
          {icon && (
            <HBIcon
              sx={{
                color: 'grey.700',
                display: 'flex',

                alignItems: 'center',
              }}
              type={icon}
            />
          )}

          <Typography variant="subtitle2" color="grey.700">
            {buttonText}
          </Typography>
        </HBButton>
      )}
    </Stack>
  )
}

export default TicketHeader
