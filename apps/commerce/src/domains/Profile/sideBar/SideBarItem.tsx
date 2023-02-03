import { HBLink } from '@hasty-bazar-commerce/components'
import { HBIcon, HBIconType } from '@hasty-bazar/core'
import { fontWeights } from '@hasty-bazar/material-provider'
import {
  Box,
  Divider,
  Stack,
  styled,
  SxProps,
  Theme,
  Typography,
  useMediaQuery,
} from '@mui/material'
import { FC, ReactNode } from 'react'
import { ProfileBodyType } from '../components/ProfileBody'

const ItemWrapper = styled(Stack)(({ theme }) => ({
  cursor: 'pointer',
  flexDirection: 'row',
  alignItems: 'center',
  gap: theme.spacing(1.5),
  padding: theme.spacing(0, 4),
}))

interface ISideBarItemProps {
  active: boolean
  title: ReactNode
  icon: HBIconType
  hasDivider?: boolean
  bodyLink?: ProfileBodyType
  onClick?: () => void
  iconSx?: SxProps
}

const SideBarItemChildren: FC<ISideBarItemProps> = (props) => {
  const { active, icon, title, iconSx } = props
  const breakpointDownMd = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'))

  return (
    <Stack direction="row" justifyContent="space-between" alignItems="center">
      <ItemWrapper>
        <HBIcon type={icon} sx={{ color: !active ? 'grey.500' : 'primary.main', ...iconSx }} />
        <Typography
          variant="button"
          color={!active ? 'grey.700' : 'primary.main'}
          fontWeight={fontWeights.fontWeightRegular}
        >
          {title}
        </Typography>
      </ItemWrapper>

      {breakpointDownMd && (
        <HBIcon type="angleLeft" sx={{ color: !active ? 'grey.500' : 'primary.main', pr: 2 }} />
      )}
    </Stack>
  )
}

const SideBarItem: FC<ISideBarItemProps> = (props) => {
  const { hasDivider, bodyLink, onClick } = props
  return (
    <>
      <Stack>
        {(bodyLink || !onClick) && (
          <HBLink sx={{ textDecoration: 'unset' }} href={`/profile/${bodyLink}`}>
            <SideBarItemChildren {...props} />
          </HBLink>
        )}
        {!!onClick && (
          <Box onClick={onClick}>
            <SideBarItemChildren {...props} />
          </Box>
        )}
      </Stack>
      {hasDivider && <Divider sx={{ borderColor: 'grey.200' }} />}
    </>
  )
}

export default SideBarItem
