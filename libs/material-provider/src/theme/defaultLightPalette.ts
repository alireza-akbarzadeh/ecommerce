import { PaletteColor, TypeText } from '@mui/material/styles'
import {
  ColorPartial,
  PaletteColorOptions,
  PaletteOptions,
} from '@mui/material/styles/createPalette'

declare module '@mui/material/styles' {
  interface PaletteColor {
    lighter?: string
    darker?: string
  }

  interface TypeBackground {
    neutral: string
  }
  interface Palette {
    vendorPrimary: Palette['primary']
  }
}

const grey: ColorPartial = {
  100: '#F0F3F5',
  200: '#E1E3E5',
  300: '#ABAFB2',
  500: '#8D9399',
  700: '#676E73',
  900: '#40464D',
}

const common = {
  black: '#2B2F33',
  white: '#FFFFFF',
}

const background = {
  default: '#F2F3F4',
  neutral: '#F2F3F4',
  paper: '#FFFFFF',
}

const primary: PaletteColor = {
  main: '#7D00FF',
  lighter: '#F3E8FF',
  light: '#9F42FF',
  dark: '#4B0099',
  darker: '#190033',
  contrastText: common.white,
}

const secondary: PaletteColor = {
  main: '#FFBE00',
  lighter: '#FFF4D4',
  light: '#FFD761',
  dark: '#E5AB00',
  darker: '#B28500',
  contrastText: common.white,
}

const error: PaletteColor = {
  main: '#CC0056',
  lighter: '#FFD2E5',
  light: '#F43C8B',
  dark: '#66002B',
  contrastText: common.white,
}

const success: PaletteColor = {
  main: '#00CC8F',
  lighter: '#D9FAF0',
  light: '#2EE5AE',
  dark: '#036649',
  contrastText: common.white,
}

const warning: PaletteColor = {
  main: '#CC6214',
  lighter: '#FFF2E5',
  light: '#E5955C',
  dark: '#803D0C',
  contrastText: common.white,
}

const info: PaletteColor = {
  main: '#1474CC',
  lighter: '#D4EBFF',
  light: '#5CA3E5',
  dark: '#0F5799',
  contrastText: common.white,
}

const vendorPrimary: PaletteColor = {
  main: '#9C64A6',
  lighter: '#F3E5F5',
  light: '#E1BEE7',
  dark: '#5C007A',
  contrastText: common.white,
}

const text: TypeText = {
  primary: '#2B2F33',
  secondary: '#4F565C',
  disabled: '#B6BCC2',
}

const defaultLightPalette: Partial<PaletteOptions & { vendorPrimary: PaletteColorOptions }> = {
  mode: 'light',
  primary,
  secondary,
  grey,
  error,
  info,
  warning,
  common,
  background,
  text,
  contrastThreshold: 3,
  tonalOffset: 0.2,
  success,
  vendorPrimary,
  divider: 'rgba(0,0,0,0,0.12)',
}

export default defaultLightPalette
