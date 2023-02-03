import { styled, Tooltip, tooltipClasses, TooltipProps } from '@mui/material'

export const HBToolTipRootStyle = styled(({ className, classes, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className, ...classes }} />
))(({ theme }) => ({
  [`&.${tooltipClasses.popper}`]: {
    backgroundColor: 'transparent',
  },
}))
