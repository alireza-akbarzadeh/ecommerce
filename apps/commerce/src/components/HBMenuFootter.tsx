import { ApiConstants } from '@hasty-bazar-commerce/core/constants'
import {
  GetMenuItemsQueryResult,
  useGetWebCmsMenugroupsByPlatformTypeAndMenuTypeQuery,
} from '@hasty-bazar-commerce/services/cmsApi.generated'
import { HBAccordion } from '@hasty-bazar/core'
import {
  accordionClasses,
  Box,
  collapseClasses,
  Stack,
  styled,
  Theme,
  Typography,
  useMediaQuery,
} from '@mui/material'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useMemo } from 'react'
import HBLink from './HBLink'

const FotterWrapperStyle = styled(Stack)(({ theme }) => ({
  maxWidth: theme.breakpoints.values.lg,
  width: '100%',
}))

const FooterSubMenuStyle = styled(Stack)(({ theme }) => ({
  marginBottom: theme.spacing(3),
}))

const HBMenuFootter = () => {
  const { data: footerData } = useGetWebCmsMenugroupsByPlatformTypeAndMenuTypeQuery({
    ...ApiConstants,
    platformType: 1021001,
    menuType: 1023002,
  })
  const { asPath } = useRouter()
  const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'))
  const isSmallScreen = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'))
  const parents = useMemo(
    () => footerData?.data?.menuItems?.filter((_) => !_.parentId),
    [footerData?.data?.menuItems],
  )

  const finalData = useMemo(
    () =>
      parents?.map((parent) => {
        return {
          ...parent,
          children: footerData?.data?.menuItems?.filter(
            (item: GetMenuItemsQueryResult) => item.parentId === parent.id,
          ),
        }
      }),
    [parents],
  )

  const socialsInMobile = useMemo(() => {
    if (isMobile && !!finalData?.length && finalData?.length > 3)
      return finalData[finalData?.length - 1]
    return null
  }, [isMobile, finalData])

  if (asPath === '/basket/' && isSmallScreen) return null
  return (
    <Stack sx={{ width: '100%', bgcolor: 'common.white' }} alignItems="center">
      <FotterWrapperStyle
        sx={{ p: { sm: 10, xs: 4 } }}
        direction="row"
        justifyContent="space-between"
        flexWrap="wrap"
      >
        {finalData?.map((parent, index) =>
          !isMobile ? (
            <FooterSubMenuStyle
              spacing={4}
              key={parent.id}
              sx={{
                mt: { sm: parent!.children![0]?.images ? 20 : 'unset', md: 'unset' },
                alignItems: {
                  sm: parent!.children![0]?.images ? 'center' : 'unset',
                  md: 'unset',
                },
                flexGrow: { sm: 1, md: 'unset' },
                flexBasis: { sm: `calc(100% / ${finalData?.length - 1})`, md: 'unset' },
                px: { sm: 4, md: 0 },
              }}
            >
              <Typography variant={'subtitle1'} color="text.primary">
                {parent.title}
              </Typography>
              <Stack
                spacing={parent!.children![0]?.images ? 8 : 4}
                direction={parent!.children![0]?.images ? 'row' : 'column'}
              >
                {parent!.children!.map((child) => (
                  <HBLink
                    sx={{
                      textDecoration: 'none',
                      cursor: child?.url ? 'pointer !important' : 'default !important',
                    }}
                    href={child?.url || '/'}
                    key={child.id}
                  >
                    {child?.images ? (
                      <Box
                        component="img"
                        src={`${process.env.NEXT_PUBLIC_CDN}${
                          child?.images && child?.images[0].imageUrl
                        }`}
                        width={24}
                        height={24}
                        sx={{
                          filter: 'grayscale(1)',
                          '&:hover': child?.url
                            ? { filter: 'unset', transitionDelay: '0.25s' }
                            : {},
                        }}
                      />
                    ) : (
                      <Typography variant={'body1'} color="text.secondary">
                        {child.title}
                      </Typography>
                    )}
                  </HBLink>
                ))}
              </Stack>
            </FooterSubMenuStyle>
          ) : (
            index !== finalData?.length - 1 && (
              <HBAccordion
                summary={
                  <Typography variant="subtitle1" color="text.primary">
                    {parent?.title}
                  </Typography>
                }
                detail={
                  <Stack spacing={4}>
                    {parent?.children?.map((child) => (
                      <Link passHref href={child?.url || '/'}>
                        <Typography variant="body1" color="text.secondary">
                          {child.title}
                        </Typography>
                      </Link>
                    ))}
                  </Stack>
                }
                sx={{
                  width: '100%',
                  boxShadow: 'unset',
                  [`&.${accordionClasses.expanded}`]: {
                    my: 0,
                  },
                  [`& .${collapseClasses.root}`]: {
                    ml: 2,
                  },
                }}
              />
            )
          ),
        )}
        {isMobile && !!socialsInMobile && (
          <Stack alignItems="center" spacing={6} width="100%" mt={8}>
            <Typography variant="subtitle1" color="text.primary">
              {socialsInMobile?.title}
            </Typography>
            <Stack direction="row" spacing={8.5}>
              {socialsInMobile?.children?.map((child: any) => (
                <HBLink
                  sx={{
                    textDecoration: 'none',
                  }}
                  href={child?.url || '/'}
                  key={child.id}
                >
                  <Box
                    component="img"
                    src={
                      `${process.env.NEXT_PUBLIC_CDN}${child?.images && child?.images[0].imageUrl}`!
                    }
                    width={24}
                    height={24}
                    sx={{
                      filter: 'grayscale(1)',
                      '&:hover': child?.url ? { filter: 'unset', transitionDelay: '0.25s' } : {},
                    }}
                  />
                </HBLink>
              ))}
            </Stack>
          </Stack>
        )}
      </FotterWrapperStyle>
    </Stack>
  )
}

export default HBMenuFootter
