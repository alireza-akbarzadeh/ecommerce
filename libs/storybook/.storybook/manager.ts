import { addons } from '@storybook/addons'
import { create, ThemeVars } from '@storybook/theming'
import 'storybook-addon-designs/register'

const theme: ThemeVars = {
  // colorPrimary: 'red',
  // colorSecondary: 'blue',

  // UI
  // appBg: 'white',
  // appContentBg: 'silver',
  // appBorderColor: 'grey',
  // appBorderRadius: 4,

  // Typography
  fontBase: '"Roboto", sans-serif',
  fontCode: 'monospace',

  // Text colors
  textColor: 'black',
  textInverseColor: 'rgba(255,255,255,0.9)',

  // Toolbar default and active colors
  // barTextColor: 'silver',
  // barSelectedColor: 'black',
  // barBg: 'hotpink',

  // Form colors
  inputBg: 'white',
  inputBorder: 'silver',
  inputTextColor: 'black',
  inputBorderRadius: 4,
  base: 'light',
  brandTitle: 'هستی بازار',
  brandUrl: 'http://localhost/',
  // brandImage:
  //   'https://media-exp1.licdn.com/dms/image/C560BAQGSpKTw-qG1wQ/company-logo_200_200/0/1519884575970?e=1626912000&v=beta&t=_2poslZaH3WNGLkTD7rM3-iPov4LGX5MRGypmjNfmXY',
}

addons.setConfig({
  theme: create(theme),
  options: {
    showPanel: true,
  },
})
