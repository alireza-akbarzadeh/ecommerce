import { HBButton, HBIcon, HBIconProps } from '@hasty-bazar/core'
import { Typography } from '@mui/material'

interface TicketHeaderProps {
  title: string
  icon: HBIconProps['type']
  onClick: () => void
}
function TicketType({ title, icon, onClick }: TicketHeaderProps) {
  return (
    <HBButton
      onClick={onClick}
      variant="outlined"
      sx={{
        display: 'flex',
        gap: 2.5,
        justifyContent: 'flex-start',
        flexDirection: 'row',
        width: 260,
        px: 4.5,
        py: 3,
      }}
      color={'secondary'}
    >
      <HBIcon type={icon} sx={{ color: 'grey.300' }} />
      <Typography variant="h4" color="text.primary" fontSize={18}>
        {title}
      </Typography>
    </HBButton>
  )
}

export default TicketType
