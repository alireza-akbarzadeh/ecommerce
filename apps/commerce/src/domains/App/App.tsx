import createCache from '@emotion/cache'
import { wrapper } from '@hasty-bazar-commerce/core/redux/store'
import HeadLayout from '@hasty-bazar-commerce/layout/HeadLayout'
import { SnackbarUtilsConfiguration } from '@hasty-bazar/core'
import { CustomStyledProvider, MaterialProvider } from '@hasty-bazar/material-provider'
import { BreakpointsOptions } from '@mui/system'
import { SessionProvider } from 'next-auth/react'
import { AppProps } from 'next/app'
import { useRouter } from 'next/router'
import { SnackbarProvider } from 'notistack'
import { FC, StrictMode, useEffect, useMemo } from 'react'
import TagManager from 'react-gtm-module'
import { Provider } from 'react-redux'
import rtlPlugin from 'stylis-plugin-rtl'
import { DefaultLayout } from '../../layout'
import { LanguageProvider, YupProvider } from './providers'

const tagManagerArgs = {
  gtmId: 'GTM-M6DHM83',
}

// Create rtl cache
export const createEmotionCache = (isRtl?: boolean) => {
  return createCache({
    key: isRtl ? 'muirtl' : 'muiltr',
    stylisPlugins: isRtl ? [rtlPlugin] : [],
    prepend: true,
  })
}

const breakpoints: BreakpointsOptions = {
  values: {
    xs: 0,
    sm: 600,
    md: 960,
    lg: 1128,
    xl: 1600,
  },
}

const App: FC<AppProps> = ({ Component, ...rest }: any) => {
  const { store, props } = wrapper.useWrappedStore(rest)
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //@ts-ignore
  const Layout = Component.layout || DefaultLayout
  const { locale } = useRouter()
  const clientSideEmotionCache = useMemo(() => createEmotionCache(locale === 'fa'), [locale])

  useEffect(() => {
    TagManager.initialize(tagManagerArgs)
  }, [])

  return (
    <StrictMode>
      <SessionProvider
        session={props.pageProps?.session}
        refetchInterval={60}
        refetchOnWindowFocus={true}
      >
        <Provider store={store}>
          <MaterialProvider theme={(themeOptions) => ({ ...themeOptions, breakpoints })}>
            <LanguageProvider>
              <YupProvider />
              <SnackbarProvider maxSnack={5} preventDuplicate disableWindowBlurListener>
                <CustomStyledProvider cache={clientSideEmotionCache}>
                  <SnackbarUtilsConfiguration />
                  <HeadLayout />
                  <Layout {...props.pageProps}>
                    {/* <AuthProvider> */}
                    <Component {...props.pageProps} />
                    {/* </AuthProvider> */}
                  </Layout>
                </CustomStyledProvider>
              </SnackbarProvider>
            </LanguageProvider>
          </MaterialProvider>
        </Provider>
      </SessionProvider>
    </StrictMode>
  )
}

export default App
