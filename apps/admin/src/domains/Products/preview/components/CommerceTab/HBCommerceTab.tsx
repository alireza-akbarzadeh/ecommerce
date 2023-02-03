import { HBIcon, HBIconType } from '@hasty-bazar/core'
import { Stack, styled, SxProps, Typography } from '@mui/material'
import { FC } from 'react'

const HeaderButtonStyle = styled(Stack)<{ isActive?: boolean }>(({ theme, isActive }) => ({
  color: isActive ? theme.palette.warning.main : theme.palette.grey[700],
  height: 40,
  cursor: 'pointer',
  padding: theme.spacing(1.5, 4),
  ...(isActive && { borderBottom: `1px solid ${theme.palette.warning.main} ` }),
  userSelect: 'none',
}))

export type HBTab = {
  onClick: () => void
  isActive: boolean
  icon?: HBIconType
  text: string
  disable?: boolean
}

interface IHBCommerceTabProps {
  tabs: HBTab[]
  sx?: SxProps
}

const HBCommerceTab: FC<IHBCommerceTabProps> = (props) => {
  const { tabs, sx } = props
  return (
    <Stack direction="row" sx={{ ...sx }}>
      {tabs.map(({ isActive, onClick, text, icon, disable }, index) => {
        return (
          <HeaderButtonStyle
            key={`tab-${index}`}
            onClick={() => {
              !disable && onClick()
            }}
            isActive={isActive}
            spacing={1.5}
            direction="row"
          >
            {icon && <HBIcon type={icon} />}
            <Typography variant="button" whiteSpace="nowrap">
              {text}
            </Typography>
          </HeaderButtonStyle>
        )
      })}
    </Stack>
  )
}

export default HBCommerceTab
