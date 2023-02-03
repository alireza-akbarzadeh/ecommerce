import { ApiConstants } from '@hasty-bazar-commerce/core/constants'
import {
  GetMenuItemsQueryResult,
  useGetWebCmsMenugroupsByPlatformTypeQuery,
} from '@hasty-bazar-commerce/services/cmsApi.generated'
import { HBIcon, useScrollDirection, useWindowScrollPosition } from '@hasty-bazar/core'
import {
  Box,
  Collapse,
  collapseClasses,
  Container,
  Divider,
  Stack,
  styled,
  Theme,
  Typography,
  useMediaQuery,
} from '@mui/material'
import { ScrollDirection } from 'libs/core/src/hooks/useScrollDirection'
import { stringify } from 'query-string'
import { FC, PropsWithChildren, useEffect, useMemo, useRef, useState } from 'react'
import { FormattedMessage } from 'react-intl'
import ComponentsMessages from '../Components.message'
import HBLink from '../HBLink'
import HBMegaMenuCategory from './components/HBMegaMenuCategory'
import HBProductGroupMenu from './components/HBProductGroupMenu'
import MegaMenuMessages from './MegaMenu.messages'

export enum RecallTypeCodeEnum {
  Collection = 1032001,
  Page = 1032002,
  ProductCatalog = 1032003,
  None = 1032004,
  DirectLink = 1032005,
}

export interface MegaMenuItemType {
  title: string
  link: string
  type: string
  items?: { title: string; link: string }[]
  favorites?: { title: string; link: string }[]
  bannerUrl?: string
}

export type megaMenuScrollStatus = 'relax' | 'goUp' | 'goUpLevel2'

const ItemMenuStyle = styled(Box)(({ theme }) => ({
  padding: theme.spacing(1.5, 0),
  display: 'flex',
  alignItems: 'center',
  // color: theme.palette.text.secondary,
  // '&  a': {
  //   color: theme.palette.text.secondary,
  // },
  // height: 43,
  '&:hover > div': {
    color: theme.palette.secondary.main,
    backgroundColor: theme.palette.secondary.lighter,
    borderRadius: theme.spacing(2),
    '& > div': { display: 'block' },
  },
}))
const ItemMenuInnerStyle = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  color: theme.palette.text.secondary,
  padding: theme.spacing(2.5, 4),
  '&  a': {
    color: theme.palette.text.secondary,
  },
}))

const BoxMenuPopupStyle = styled(Box)(({ theme }) => ({
  width: '100%',
  backgroundColor: theme.palette.common.white,
  position: 'absolute',
  display: 'none',
  paddingTop: theme.spacing(12.5),
  right: 0,
  filter: 'drop-shadow(0px 16px 32px rgba(0, 0, 0, 0.08))',
  top: theme.spacing(1.4),
  zIndex: -1,
  borderBottomLeftRadius: theme.spacing(2),
  borderBottomRightRadius: theme.spacing(2),
}))

const ButtonScrollStyle = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  backgroundColor: theme.palette.grey[100],
  borderRadius: theme.spacing(2),
  height: 40,
  padding: theme.spacing(2.5, 4),
  cursor: 'pointer',
  marginLeft: theme.spacing(3),
  '&:hover': {
    backgroundColor: theme.palette.grey[200],
  },
}))

const criticalPoint = 150

const HBMegaMenu = () => {
  const scrollDirection = useScrollDirection(0)
  const windowPosition = useWindowScrollPosition()
  const [showButtonScroll, setShowButtonScroll] = useState<'continue' | 'back' | undefined>()
  const breakpointDownLg = useMediaQuery((theme: Theme) => theme.breakpoints.between('md', 1163))
  const [showMenu, setShowMenu] = useState<boolean>(false)
  const refContainer = useRef<HTMLDivElement | null>(null)
  const { data: menuData } = useGetWebCmsMenugroupsByPlatformTypeQuery({
    ...ApiConstants,
    platformType: 1021001,
  })
  const parentMenu = menuData?.data?.menuItems
    ?.filter((_) => !_.parentId)
    .sort((a, b) => {
      return a.displaySortOrder! - b.displaySortOrder!
    })
    .splice(0, 7) as GetMenuItemsQueryResult[]

  const megaMenuItems = useMemo(() => {
    if (parentMenu) {
      return parentMenu.map((item) => ({
        ...item,
        children: menuData?.data?.menuItems?.filter((_) => _.parentId === item.id),
      }))
    }
  }, [parentMenu])

  const timeout = useRef<NodeJS.Timeout>()

  const handleMouseOver = () => {
    clearTimeout(timeout.current)
    timeout.current = setTimeout(() => {
      setShowMenu(true)
    }, 150)
  }

  const handleMouseLeave = () => {
    clearTimeout(timeout.current)
    setShowMenu(false)
  }

  useEffect(() => {
    if (!!parentMenu?.length && parentMenu?.length > 5 && !showButtonScroll && breakpointDownLg) {
      setShowButtonScroll('continue')
    } else if (!breakpointDownLg && !!showButtonScroll) setShowButtonScroll(undefined)
  }, [parentMenu, breakpointDownLg])

  return (
    <Collapse
      sx={(theme) => ({
        bgcolor: 'common.white',
        [`& .${collapseClasses.wrapperInner}`]: {
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          maxWidth: theme.breakpoints.values.lg,
          margin: 'auto',
          [theme.breakpoints.down(1163)]: {
            width: `calc(100% - ${theme.spacing(12)})`,
          },
        },
        order: 3,
      })}
      in={
        !((windowPosition?.y || 0) > criticalPoint) ||
        ((scrollDirection === ScrollDirection.up && windowPosition?.y) || 0) > criticalPoint
      }
      timeout={1000}
    >
      <Container
        maxWidth="lg"
        sx={(theme) => ({
          overflowX: 'auto',
          [theme.breakpoints.down(1163)]: {
            // '-ms-overflow-style': 'none',
            msOverflowStyle: 'none',
            scrollbarWidth: 'none',
            '&::-webkit-scrollbar': {
              display: 'none',
            },
          },
        })}
        ref={refContainer}
      >
        <Stack
          direction="row"
          sx={{ width: 'max-content' }}
          onMouseOver={() => handleMouseOver()}
          onMouseLeave={handleMouseLeave}
        >
          <ItemMenuStyle pl={'0 !important'}>
            <ItemMenuInnerStyle>
              <HBIcon type="bars" size="small" sx={{ color: 'grey.500', mr: 2 }} />
              <Typography
                variant="caption"
                component="label"
                display="flex"
                alignItems="center"
                color="text.secondary"
                sx={{ cursor: 'pointer' }}
              >
                <FormattedMessage {...MegaMenuMessages.all} />
              </Typography>
              <BoxMenuPopupStyle>
                <Divider sx={{ borderColor: 'grey.200' }} />
                <HBProductGroupMenu />
              </BoxMenuPopupStyle>
            </ItemMenuInnerStyle>
          </ItemMenuStyle>
          <HBLink sx={{ textDecoration: 'unset' }} href="/saved/vendor">
            <ItemMenuStyle sx={{ cursor: 'pointer' }}>
              <ItemMenuInnerStyle>
                <HBIcon type="bookmark" size="small" sx={{ color: 'grey.500', mr: 2 }} />
                <Typography
                  variant="caption"
                  component="label"
                  display="flex"
                  alignItems="center"
                  color="text.secondary"
                  sx={{ cursor: 'pointer' }}
                >
                  <FormattedMessage {...MegaMenuMessages.saved} />
                </Typography>
              </ItemMenuInnerStyle>
            </ItemMenuStyle>
          </HBLink>
          {megaMenuItems?.map((menu) => (
            <ItemMenuStyle key={menu.id}>
              <ItemMenuInnerStyle>
                <Typography
                  component="label"
                  display="flex"
                  alignItems="center"
                  variant="caption"
                  color="text.secondary"
                >
                  <MegaMenuLink menu={menu}>{menu.title}</MegaMenuLink>
                </Typography>
                {showMenu && (
                  <BoxMenuPopupStyle>
                    <>
                      <Divider sx={{ borderColor: 'grey.200' }} />
                      <HBMegaMenuCategory data={menu} />
                    </>
                  </BoxMenuPopupStyle>
                )}
              </ItemMenuInnerStyle>
            </ItemMenuStyle>
          ))}
        </Stack>
      </Container>
      {!!showButtonScroll && breakpointDownLg && (
        <ButtonScrollStyle
          onClick={() => {
            setShowButtonScroll((val) => (val === 'back' ? 'continue' : 'back'))
            refContainer.current?.scrollTo({
              left: showButtonScroll === 'continue' ? -refContainer?.current?.scrollWidth : 0,
              behavior: 'smooth',
            })
          }}
        >
          <Typography variant="subtitle2" color="grey.700">
            <FormattedMessage
              {...ComponentsMessages[showButtonScroll === 'back' ? 'back' : 'continue']}
            />
          </Typography>
          <HBIcon
            type={showButtonScroll === 'continue' ? 'arrowLeft' : 'arrowRight'}
            size="small"
            sx={{ color: 'grey.700', mt: 1, ml: 1 }}
          />
        </ButtonScrollStyle>
      )}
    </Collapse>
  )
}

export default HBMegaMenu

interface MegaMenuLinkProps {
  menu: GetMenuItemsQueryResult
}

export const MegaMenuLink: FC<PropsWithChildren<MegaMenuLinkProps>> = (props) => {
  const { menu, children } = props
  if (menu.recallType === RecallTypeCodeEnum.Collection)
    return (
      <HBLink href={`/collection/?collectionId=${menu.queryId}`} passHref>
        {children}
      </HBLink>
    )
  if (menu.recallType === RecallTypeCodeEnum.ProductCatalog)
    return (
      <HBLink
        href={`/collection/?${stringify({
          baseFilter: JSON.stringify({ categories: menu?.productCategories?.split(',') }),
        })}`}
        passHref
      >
        {children}
      </HBLink>
    )

  if (menu.recallType === RecallTypeCodeEnum.Page)
    return <HBLink href={`/category/${menu.originName}`}>{children}</HBLink>

  if (menu.recallType === RecallTypeCodeEnum.DirectLink)
    return (
      <HBLink href={menu.url!} target="_blank">
        {children}
      </HBLink>
    )

  return <>{children}</>
}
