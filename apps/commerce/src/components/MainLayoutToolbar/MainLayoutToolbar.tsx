import { HBHamburgerMenu } from '@hasty-bazar-commerce/containers/HBHamburgerMenu'
import { SectionByContentQueryResult } from '@hasty-bazar-commerce/services/cmsApi.generated'
import { HBIcon } from '@hasty-bazar/core'
import { Box, Stack, styled, Theme, useMediaQuery } from '@mui/material'
import { useEffect, useRef, useState } from 'react'
import { useIntl } from 'react-intl'
import { MainLayoutToolbarSearch } from '.'
import HBLink from '../HBLink'
import MainLayoutToolbarMessages from './MainLayoutToolbar.messages'

const WrapperStyle = styled(Stack)(({ theme }) => ({
  padding: theme.spacing(2, 0),
  margin: '0 auto',
  [theme.breakpoints.up('lg')]: {
    width: `${theme.breakpoints.values.lg}px`,
  },
  [theme.breakpoints.between('md', 1163)]: {
    width: `calc(100% - ${theme.spacing(12)})`,
  },
}))
export type toolbarScrollStatus = 'relax' | 'goUp'

type MainLayoutToolbarProps = {
  sections: SectionByContentQueryResult[] | null
}

const MainLayoutToolbar = ({ sections }: MainLayoutToolbarProps) => {
  const { formatMessage } = useIntl()
  const [openMenu, setOpenMenu] = useState(false)
  const breakpointUpMd = useMediaQuery((theme: Theme) => theme.breakpoints.up('md'))
  const refToolbar = useRef<HTMLDivElement>()

  const calcHeaderHeight = () => {
    setTimeout(() => {
      const adsHeaderElement = document.querySelector('#ads-header')
      const refHeader = refToolbar?.current?.parentElement
      const refParentHeader = refHeader?.parentElement
      if (!!refHeader && !!adsHeaderElement) {
        refParentHeader?.setAttribute(
          'style',
          `height: ${refHeader?.clientHeight! + 16 + adsHeaderElement.clientHeight}px`,
        )
        refHeader?.setAttribute('style', `top: ${adsHeaderElement.clientHeight}px`)
      } else if (refHeader)
        refParentHeader?.setAttribute('style', `height: ${refHeader?.clientHeight! + 16}px`)
    }, 300)
  }

  useEffect(() => {
    calcHeaderHeight()
    window.addEventListener('resize', () => calcHeaderHeight())
  }, [breakpointUpMd])

  return (
    <Box
      sx={{
        bgcolor: 'common.white',
        zIndex: 5,
        px: { xs: 4, md: 0 },
        mb: -0.25,
        borderBottom: (theme) => `1px solid ${theme.palette.grey[100]}`,
      }}
      ref={refToolbar}
      order={2}
    >
      <WrapperStyle spacing={{ xs: 1, md: 6 }} direction="row" alignItems="center">
        <Box
          sx={{
            display: {
              md: 'none',
            },
            zIndex: 100,
            position: 'absolute',
            left: (theme) => theme.spacing(3.5),
            bgcolor: 'common.white',
          }}
          id="before-search-box-in-header"
        />

        <Stack spacing={{ xs: 0, md: 10 }} direction="row" alignItems="center">
          {!breakpointUpMd && (
            <Box onClick={() => setOpenMenu(true)} mr={1}>
              <HBIcon type="bars" size="medium" />
            </Box>
          )}
          <HBLink href="/" sx={{ display: 'flex' }}>
            <Box
              component="img"
              sx={{ objectFit: 'contain', mx: breakpointUpMd ? 'unset' : 2.5 }}
              src={breakpointUpMd ? '/assets/logo.png' : '/assets/logoResponsive.png'}
              height={breakpointUpMd ? 64 : 'unset'}
              width={breakpointUpMd ? 64 : 'unset'}
              alt={formatMessage(MainLayoutToolbarMessages.hastiBazaarText)}
            />
          </HBLink>
        </Stack>
        <MainLayoutToolbarSearch sections={sections} />
        <Box
          sx={{
            display: {
              md: 'none',
            },
          }}
          id="after-search-box-in-header"
        />
      </WrapperStyle>
      {!breakpointUpMd && openMenu && (
        <HBHamburgerMenu open={openMenu} onClose={() => setOpenMenu(false)} />
      )}
    </Box>
  )
}

export default MainLayoutToolbar
