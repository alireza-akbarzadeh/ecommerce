import useDirection from '@brightlayer-ui/storybook-rtl-addon/useDirection'
import { MaterialProvider } from '@hasty-bazar/material-provider'
import { useCallback } from 'react'
import { jsx as _jsx } from 'react/jsx-runtime'
import { useDarkMode } from 'storybook-dark-mode'
export const decorators = [
  (Story) => {
    const direction = useDirection()
    const mode = useDarkMode()
    const theme = useCallback(
      (options) =>
        Object.assign(Object.assign({}, options), {
          direction,
          palette: Object.assign({ mode: mode ? 'dark' : 'light' }, options.palette),
        }),
      [direction, mode],
    )
    return _jsx(MaterialProvider, Object.assign({ theme: theme }, { children: _jsx(Story, {}) }))
  },
]
export const parameters = {
  options: {
    storySort: (a, b) => {
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
//# sourceMappingURL=preview.js.map
