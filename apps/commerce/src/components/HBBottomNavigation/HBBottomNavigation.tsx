import useGetMinimal from '@hasty-bazar-commerce/core/hook/useGetMinimal'
import { HBIcon } from '@hasty-bazar/core'
import {
  Badge,
  badgeClasses,
  BadgeProps,
  BottomNavigation,
  BottomNavigationAction,
  bottomNavigationActionClasses,
  styled,
} from '@mui/material'
import { useRouter } from 'next/router'
import { FC, useState } from 'react'
import { FormattedMessage } from 'react-intl'
import ComponentsMessages from '../Components.message'

const BottomNavigationStyle = styled(BottomNavigation)(() => ({
  boxShadow: '0px -4px 16px rgb(0 0 0 / 4%)',
}))

const BottomNavigationActionStyles = styled(BottomNavigationAction)(() => ({
  '&:after': {
    content: "''",
    width: '100%',
    height: 2,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    marginBottom: -4,
  },
}))

const bottomNavigationOptions = {
  '/': 0,
  '/megaMenu': 1,
  '/basket': 2,
  '/profile': 3,
}

const StyledBadge = styled(Badge)<BadgeProps>(({ theme }) => ({
  [`& .${badgeClasses.badge}`]: {
    top: 6,
    border: `2px solid ${theme.palette.background.paper}`,
    padding: `0 ${theme.spacing(1)}`,
    lineHeight: 'inherit',
  },
}))

const HBBottomNavigation: FC = () => {
  const router = useRouter()

  const bottomTabIsActive = (path: string): boolean => {
    return (
      bottomNavigationValue ===
      bottomNavigationOptions[path as keyof typeof bottomNavigationOptions]
    )
  }

  const { data: minimalBasket } = useGetMinimal()

  const [bottomNavigationValue, setBottomNavigationValue] = useState(
    bottomNavigationOptions[router.pathname as keyof typeof bottomNavigationOptions],
  )

  return (
    <BottomNavigationStyle
      showLabels
      value={bottomNavigationValue}
      onChange={(event, newValue) => {
        setBottomNavigationValue(newValue)
      }}
    >
      <BottomNavigationActionStyles
        label={<FormattedMessage {...ComponentsMessages.home} />}
        icon={<HBIcon type="estate" />}
        onClick={() => router.replace('/')}
        sx={{
          '&:after': {
            backgroundColor: bottomTabIsActive('/') ? 'primary.main' : 'transparent',
          },
        }}
      />
      <BottomNavigationActionStyles
        label={<FormattedMessage {...ComponentsMessages.category} />}
        icon={<HBIcon type="layerGroup" />}
        onClick={() => router.replace('/megaMenu')}
        sx={{
          '&:after': {
            backgroundColor: bottomTabIsActive('/megaMenu') ? 'primary.main' : 'transparent',
          },
          [`& .${bottomNavigationActionClasses.label}`]: {
            whiteSpace: 'nowrap',
          },
        }}
      />
      <BottomNavigationActionStyles
        label={<FormattedMessage {...ComponentsMessages.basket} />}
        icon={
          <StyledBadge
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            max={999}
            badgeContent={minimalBasket?.totalCount}
            color="error"
          >
            <HBIcon type="shoppingCart" />
          </StyledBadge>
        }
        onClick={() => router.replace('/basket')}
        sx={{
          '&:after': {
            backgroundColor: bottomTabIsActive('/basket') ? 'primary.main' : 'transparent',
          },
        }}
      />
      <BottomNavigationActionStyles
        label={<FormattedMessage {...ComponentsMessages.profile} />}
        icon={<HBIcon type="user" />}
        onClick={() => router.replace('/profile')}
        sx={{
          '&:after': {
            backgroundColor: bottomTabIsActive('/profile') ? 'primary.main' : 'transparent',
          },
        }}
      />
    </BottomNavigationStyle>
  )
}
export default HBBottomNavigation
