import { CommerceIconButton, HBLink } from '@hasty-bazar-commerce/components'
import { HBIcon } from '@hasty-bazar/core'
import { Box, Divider, Stack, styled, Theme, useMediaQuery } from '@mui/material'
import { useRouter } from 'next/router'
import { FC, ReactNode } from 'react'
import { useIntl } from 'react-intl'
import { SavedHeader } from './components'
import { SavedVendorPages } from './containers'
import SavedSearchPage from './containers/SavedSearchPage'
import SavedMessages from './saved.messages'

export const SavedWrapper = styled(Stack)(({ theme }) => ({
  padding: theme.spacing(6),
  backgroundColor: theme.palette.common.white,
  [theme.breakpoints.between('sm', 'md')]: {
    borderRadius: theme.spacing(4),
    margin: `${theme.spacing(6)}!important`,
    padding: theme.spacing(0, 6, 6),
  },
  [theme.breakpoints.only('xs')]: {
    padding: theme.spacing(0, 4, 4),
  },
  marginBottom: `${theme.spacing(6)}!important`,
}))

export const params = ['search', 'vendor'] as const
export type paramKey = typeof params[number]

export interface SavedPageProps {
  param: paramKey
}

const pages: Record<paramKey, ReactNode> = {
  search: <SavedSearchPage />,
  vendor: <SavedVendorPages />,
}

const SavedPage: FC<SavedPageProps> = (props) => {
  const { back, asPath } = useRouter()
  const isSmallScreen = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'))
  const isMobileScreen = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'))
  const splitPath = asPath.slice(0, -1).split('/')
  const param = splitPath[splitPath.length - 1] as paramKey
  const { formatMessage } = useIntl()
  return (
    <Stack
      spacing={!isMobileScreen ? 6 : 1}
      sx={{ maxWidth: (theme) => theme.breakpoints.values.lg, width: '100%' }}
    >
      {isSmallScreen && (asPath === '/saved/vendor/' || asPath === '/saved/search/') && (
        <Stack
          sx={{
            backgroundColor: 'common.white',
            height: 48,
            p: 4,
            paddingLeft: { sm: '50%' },
          }}
          direction="row"
          alignItems="center"
        >
          <Stack direction="row" spacing={2}>
            <Stack direction="row" spacing={0.5}>
              <Box>
                <HBLink href="/" sx={{ display: 'flex' }}>
                  <Box
                    component="img"
                    sx={{ objectFit: 'contain' }}
                    src="/assets/logo.png"
                    height={32}
                    width={32}
                    alt={formatMessage(SavedMessages.hastiBazaarText)}
                  />
                </HBLink>
              </Box>
              <Divider sx={{ borderColor: 'grey.300' }} orientation="vertical" flexItem />
            </Stack>
            <CommerceIconButton
              onClick={() => back()}
              icon={<HBIcon type="arrowRight" sx={{ color: 'common.black' }} />}
            />
          </Stack>
        </Stack>
      )}

      <SavedWrapper spacing={6}>
        <SavedHeader param={param} />
        <Box>{pages[param]}</Box>
      </SavedWrapper>
    </Stack>
  )
}

export default SavedPage
