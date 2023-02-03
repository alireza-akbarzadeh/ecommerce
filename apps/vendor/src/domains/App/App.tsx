import createCache from '@emotion/cache'
import { useStore } from '@hasty-bazar/admin-shared/core/redux/store'
import { SnackbarUtilsConfiguration } from '@hasty-bazar/core'
import { CustomStyledProvider, MaterialProvider } from '@hasty-bazar/material-provider'
import { SessionProvider } from 'next-auth/react'
import { AppProps } from 'next/app'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { SnackbarProvider } from 'notistack'
import { FC, StrictMode, useMemo } from 'react'
import { Provider } from 'react-redux'
import rtlPlugin from 'stylis-plugin-rtl'
import { Layout as DefaultLayout } from '../../layout'
import { LanguageProvider, YupProvider } from './providers'

// Create rtl cache
export const createEmotionCache = (isRtl?: boolean) => {
  return createCache({
    key: isRtl ? 'muirtl' : 'muiltr',
    stylisPlugins: isRtl ? [rtlPlugin] : [],
    prepend: true,
  })
}

const App: FC<AppProps> = ({ Component, pageProps }: any) => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //@ts-ignore
  const Layout = Component.layout || DefaultLayout
  const { locale } = useRouter()

  const store = useStore(pageProps.initialReduxState)

  const clientSideEmotionCache = useMemo(() => createEmotionCache(locale === 'fa'), [locale])
  return (
    <StrictMode>
      <SessionProvider session={pageProps.session} refetchInterval={60} refetchOnWindowFocus={true}>
        <Provider store={store}>
          <MaterialProvider theme={(themeOptions) => ({ ...themeOptions })}>
            <LanguageProvider>
              <YupProvider />
              <SnackbarProvider
                maxSnack={2}
                css={{
                  wordWrap: 'break-word',
                  whiteSpace: 'pre-line',
                }}
                preventDuplicate
                disableWindowBlurListener
              >
                <CustomStyledProvider cache={clientSideEmotionCache}>
                  <SnackbarUtilsConfiguration />
                  <Head>
                    <meta charSet="utf-8" />
                    <meta
                      name="viewport"
                      content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no"
                    />
                  </Head>
                  <Layout {...pageProps}>
                    {/* <AuthProvider> */}
                    <Component {...pageProps} />
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
