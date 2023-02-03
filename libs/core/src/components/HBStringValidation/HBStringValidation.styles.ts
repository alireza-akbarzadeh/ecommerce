import { styled, Typography, TypographyTypeMap } from '@mui/material'
import { OverridableComponent } from '@mui/material/OverridableComponent'
import { HBStringValidationProps } from './HBStringValidation'
type HBStringValidationTextProps = {
  isValid: boolean
}
const transition = 'all 0.5s'
export const HBStringValidationIconStyle = styled('div')<HBStringValidationTextProps>(
  ({ theme, isValid }) => ({
    background: isValid ? theme.palette.secondary.main : theme.palette.grey[500],
    width: 20,
    height: 20,
    borderRadius: '50%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    transition,
  }),
)
export const HBStringValidationTextStyle = styled(Typography)<HBStringValidationTextProps>(
  ({ theme, isValid }) => ({
    color: isValid ? theme.palette.secondary.main : theme.palette.grey[500],
    paddingLeft: theme.spacing(2),
    transition,
  }),
) as OverridableComponent<TypographyTypeMap<HBStringValidationTextProps, 'span'>>

export const HBStringValidationRootStyle = styled('div')<HBStringValidationProps>(({ theme }) => ({
  display: 'flex',
  margin: `${theme.spacing(1)} 0`,
}))
