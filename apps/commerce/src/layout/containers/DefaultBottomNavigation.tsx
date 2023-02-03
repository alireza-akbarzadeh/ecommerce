import { HBBottomNavigation } from '@hasty-bazar-commerce/components'
import { Box, Stack } from '@mui/material'
import { useRouter } from 'next/router'
import { FC } from 'react'

const bottomNavigationRoutes = ['/', '/megaMenu/', '/basket/', '/profile/']

const DefaultBottomNavigation: FC = () => {
  const router = useRouter()

  return (
    <Stack
      sx={{
        position: 'fixed',
        width: '100%',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        boxShadow: '0px -16px 16px rgb(0 0 0 / 4%)',
        bgcolor: 'common.white',
      }}
    >
      <Box id="bottom-navigation-top-box" />
      {bottomNavigationRoutes.includes(router.asPath) && <HBBottomNavigation />}
    </Stack>
  )
}

export default DefaultBottomNavigation
