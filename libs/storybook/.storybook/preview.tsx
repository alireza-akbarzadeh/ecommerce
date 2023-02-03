import useDirection from '@brightlayer-ui/storybook-rtl-addon/useDirection'
import createCache from '@emotion/cache'
import { CustomStyledProvider, MaterialProvider } from '@hasty-bazar/material-provider'
import { ThemeOptions } from '@mui/material/styles'
import { DecoratorFn } from '@storybook/react'
import { useCallback, useMemo } from 'react'
import { useDarkMode } from 'storybook-dark-mode'
import stylisRTLPlugin from 'stylis-plugin-rtl'

// Create rtl cache
export const createEmotionCache = (isRtl?: boolean) => {
  return createCache({
    key: isRtl ? 'muirtl' : 'muiltr',
    stylisPlugins: isRtl ? [stylisRTLPlugin] : [],
    prepend: true,
  })
}

export const decorators: DecoratorFn[] = [
  (Story) => {
    const direction = useDirection()
    const mode = useDarkMode()
    const theme = useCallback(
      (options: ThemeOptions) =>
        ({
          ...options,
          direction,
          palette: {
            mode: mode ? 'dark' : 'light',
            ...options.palette,
          },
        } as Partial<ThemeOptions>),
      [direction, mode],
    )
    const clientSideEmotionCache = useMemo(
      () => createEmotionCache(direction === 'rtl'),
      [direction],
    )
    return (
      <MaterialProvider theme={theme}>
        <CustomStyledProvider cache={clientSideEmotionCache}>
          <Story />
        </CustomStyledProvider>
      </MaterialProvider>
    )
  },
]

export const parameters = {
  options: {
    storySort: (a: any, b: any) => {
      /*
        Changes order comparison to story name (Storybook v6)
        Removed "readme" from the name and returns the comparison
        this ensures stories with readme comes first
      */
      const aPath = a[0].replace(/readme$/, '')
      const bPath = b[0].replace(/readme$/, '')
      return aPath.localeCompare(bPath)
    },
  },
}
