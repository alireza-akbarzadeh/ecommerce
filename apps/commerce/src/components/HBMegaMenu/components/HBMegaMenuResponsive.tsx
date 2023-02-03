import { ApiConstants } from '@hasty-bazar-commerce/core/constants'
import {
  GetMenuItemsQueryResult,
  useGetWebCmsMenugroupsByPlatformTypeQuery,
} from '@hasty-bazar-commerce/services/cmsApi.generated'
import { HBIcon } from '@hasty-bazar/core'
import { Box, Stack, Typography } from '@mui/material'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useMemo, useState } from 'react'
import { MegaMenuLink, RecallTypeCodeEnum } from '../HBMegaMenu'

interface MenuItemResultWithChildren extends GetMenuItemsQueryResult {
  children: GetMenuItemsQueryResult[]
}

const HBMegaMenuResponsive = () => {
  const router = useRouter()
  const [menuSelected, setMenuSelected] = useState<MenuItemResultWithChildren>()
  const { data: menuData } = useGetWebCmsMenugroupsByPlatformTypeQuery({
    ...ApiConstants,
    platformType: 1021001,
  })

  const parentMenu = menuData?.data?.menuItems?.filter(
    (_) => !_.parentId,
  ) as GetMenuItemsQueryResult[]

  const megaMenuItems = useMemo(() => {
    if (parentMenu) {
      return parentMenu.map(
        (item) =>
          ({
            ...item,
            children: menuData?.data?.menuItems?.filter((_) => _.parentId === item.id),
          } as MenuItemResultWithChildren),
      )
    }
  }, [parentMenu])

  if (menuSelected) {
    const image = menuSelected?.images?.[0]?.imageUrl
    const metadata = JSON.parse(menuSelected?.images?.[0]?.metaDataObject!)

    return (
      <Stack sx={{ width: '100%', bgcolor: 'common.white', mt: -4, height: '100vh' }}>
        <Box
          display="flex"
          py={2.5}
          px={{ xs: 4, sm: 6 }}
          alignItems="center"
          onClick={() => setMenuSelected(undefined)}
        >
          <HBIcon type="angleRight" sx={{ color: 'text.secondary' }} />
          <Typography ml={2} variant="subtitle2" color="text.secondary">
            {menuSelected?.title}
          </Typography>
        </Box>
        {menuSelected?.children?.map((child) => (
          <MegaMenuLink menu={child} key={child.id}>
            <Box
              display="flex"
              justifyContent="space-between"
              py={3}
              px={{ xs: 4, sm: 6 }}
              onClick={() =>
                child.recallType === RecallTypeCodeEnum.None ? undefined : router.back()
              }
            >
              <Typography variant="subtitle2" color="text.primary">
                {child.title}
              </Typography>
            </Box>
          </MegaMenuLink>
        ))}
        {image && (
          <Box
            width="calc(100% - 48px)"
            borderRadius={4}
            mx={'auto'}
            position="relative"
            height={300}
            onClick={() => (metadata?.url ? router.push(metadata?.url) : undefined)}
          >
            <Image
              src={process.env.NEXT_PUBLIC_CDN + image}
              layout="fill"
              objectFit="contain"
              objectPosition="center"
              alt={'menu-image'}
            />
          </Box>
        )}
      </Stack>
    )
  }

  return (
    <Stack sx={{ width: '100%', bgcolor: 'common.white', mt: -4, height: '100vh' }}>
      {megaMenuItems?.map((menu) => (
        <Box
          key={menu.id}
          display="flex"
          justifyContent="space-between"
          py={3}
          px={{ xs: 4, sm: 6 }}
        >
          <MegaMenuLink menu={menu} key={menu.id}>
            <Typography variant="subtitle2" color="text.primary">
              {menu.title}
            </Typography>
          </MegaMenuLink>
          <Box onClick={() => setMenuSelected(menu)}>
            <HBIcon type="angleLeft" size="small" sx={{ color: 'text.secondary' }} />
          </Box>
        </Box>
      ))}
    </Stack>
  )
}

export default HBMegaMenuResponsive
