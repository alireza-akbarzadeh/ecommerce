import { styled, SxProps, Tab, tabClasses } from '@mui/material'
import { FC, ReactNode } from 'react'

interface CommerceTabProps {
  label: ReactNode
  sx?: SxProps
}
export const CommerceTabStyle = styled(Tab)(({ theme: { palette } }) => ({
  [`&.${tabClasses.selected}`]: {
    background: palette.common.white,
    color: palette.primary.main,
  },
})) as typeof Tab

const CommerceTab: FC<CommerceTabProps> = (props) => {
  return <CommerceTabStyle {...props} />
}

export default CommerceTab
