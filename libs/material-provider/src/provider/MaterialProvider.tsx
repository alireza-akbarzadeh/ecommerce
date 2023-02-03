import { CacheProvider, EmotionCache } from '@emotion/react'
import { CssBaseline } from '@mui/material'
import {
  createTheme,
  StyledEngineProvider,
  ThemeOptions,
  ThemeProvider,
} from '@mui/material/styles'
import { FC, PropsWithChildren, ReactNode, useMemo } from 'react'
import { themeOptions } from '../theme'

export const CustomStyledProvider = ({
  children,
  cache,
}: {
  children?: ReactNode
  cache: EmotionCache
}): JSX.Element => {
  return (
    <StyledEngineProvider injectFirst>
      <CacheProvider value={cache}>{children}</CacheProvider>
    </StyledEngineProvider>
  )
}

const MaterialProvider: FC<
  PropsWithChildren<{
    theme?(themeOptions: ThemeOptions): Partial<ThemeOptions>
  }>
> = ({ theme, children }) => {
  const cdnURL = process.env['NEXT_PUBLIC_CDN']
  const innerTheme = theme?.(themeOptions)

  const usedTheme = useMemo(() => createTheme(innerTheme ?? themeOptions), [innerTheme])
  return (
    <ThemeProvider theme={usedTheme}>
      <link rel="stylesheet" href={`${cdnURL}/cdn/fonts/unicons/css/line.css`} />
      <link rel="stylesheet" href={`${cdnURL}/cdn/fonts/Peyda/fontpayda.css`} />
      <link
        rel="stylesheet"
        href={`${cdnURL}/cdn/fonts/iranyekan/Farsi_numerals/WebFonts/css/fontiran.css`}
      />
      <link rel="stylesheet" href={`${cdnURL}/cdn/fonts/IRanSans/fontiran.css`} />
      <link rel="stylesheet" href={`${cdnURL}/cdn/leaflet.min.css`} />
      <link rel="stylesheet" href={`${cdnURL}/cdn/leaflet.draw.min.css`} />
      <script src={`${cdnURL}/cdn/tinymce/tinymce.min.js`}></script>
      {/* <link rel="stylesheet" href="https://api.mapbox.com/mapbox-gl-js/v1.13.0/mapbox-gl.css" />
      <link
        rel="stylesheet"
        href="https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-draw/v1.2.0/mapbox-gl-draw.css"
        type="text/css"
      /> */}

      {/* <CustomStyledProvider isRtl={innerTheme?.direction === 'rtl' ? true : false}> */}
      <CssBaseline />
      {children}
      {/* </CustomStyledProvider> */}
    </ThemeProvider>
  )
}

export default MaterialProvider
