import { HBIcon, HBIconProps, HBIconType } from '@hasty-bazar/core'
import { StepIconProps, styled } from '@mui/material'

const StepIconRoot = styled('div')<{
  ownerState: { completed?: boolean; active?: boolean }
}>(({ theme: { palette } = {}, ownerState }) => ({
  zIndex: 1,
  color: palette?.grey[500],
  backgroundColor: 'transparent',
  width: 50,
  height: 50,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  ...(ownerState.active && {
    fontWeight: 'bold',
    color: palette?.common.black,
  }),
  ...(ownerState.completed && {
    color: palette?.success.main,
  }),
}))

function StepIcon(
  props: StepIconProps & {
    icon: HBIconType
    completed: boolean
  },
) {
  const { active, icon, className, completed } = props
  const iconName: HBIconProps['type'] = completed ? 'checkCircle' : (icon as unknown as HBIconType)
  return (
    <StepIconRoot
      sx={{
        cursor: 'pointer',
      }}
      ownerState={{ completed, active }}
      className={className}
    >
      <HBIcon type={iconName} />
    </StepIconRoot>
  )
}

export default StepIcon
