import createCache from '@emotion/cache'
import { CacheProvider } from '@emotion/react'
import { CssBaseline } from '@mui/material'
import { createTheme, StyledEngineProvider, ThemeProvider } from '@mui/material/styles'
import { useMemo } from 'react'
import { Fragment as _Fragment, jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime'
import { prefixer } from 'stylis'
import rtlPlugin from 'stylis-plugin-rtl'
import { themeOptions } from '../theme'
// import '../styles/fontfaces.css';
// Create rtl cache
const cacheRtl = createCache({
  key: 'muirtl',
  stylisPlugins: [prefixer, rtlPlugin],
  prepend: true,
})
const CustomStyledProvider = ({ isRtl, children }) => {
  if (!isRtl) {
    return _jsx(_Fragment, { children: children })
  }
  return _jsx(
    StyledEngineProvider,
    Object.assign(
      { injectFirst: true },
      { children: _jsx(CacheProvider, Object.assign({ value: cacheRtl }, { children: children })) },
    ),
  )
}
const MaterialProvider = ({ theme, children }) => {
  const innerTheme = theme === null || theme === void 0 ? void 0 : theme(themeOptions)
  const usedTheme = useMemo(
    () => createTheme(innerTheme !== null && innerTheme !== void 0 ? innerTheme : themeOptions),
    [innerTheme],
  )
  return _jsxs(
    ThemeProvider,
    Object.assign(
      { theme: usedTheme },
      {
        children: [
          _jsx('link', {
            rel: 'stylesheet',
            href: 'https://unicons.iconscout.com/release/v4.0.0/css/line.css',
          }),
          _jsx('link', { rel: 'stylesheet', href: 'https://cdn-dev.hasti.co/fontfaces.css' }),
          _jsxs(
            CustomStyledProvider,
            Object.assign(
              {
                isRtl:
                  (innerTheme === null || innerTheme === void 0 ? void 0 : innerTheme.direction) ===
                  'rtl'
                    ? true
                    : false,
              },
              { children: [_jsx(CssBaseline, {}), children] },
            ),
          ),
        ],
      },
    ),
  )
}
export default MaterialProvider
//# sourceMappingURL=MaterialProvider.js.map
