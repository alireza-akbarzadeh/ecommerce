const grey = {
  100: '#F4F7FB',
  200: '#F1F4F5',
  300: '#C8D3D9',
  500: '#8798A1',
  700: '#607079',
  900: '#354752',
}
const common = {
  black: grey[900],
  white: '#FFFFFF',
}
const background = {
  default: grey[100],
  paper: common.white,
}
const primary = {
  main: '#D56C0C',
  dark: '#AD5707',
  light: '#FFB067',
  contrastText: common.white,
}
const secondary = {
  main: '#2EBB66',
  dark: '#13743A',
  light: '#ABE4C2',
  contrastText: common.white,
}
const error = {
  main: '#BB2E47',
  light: '#E4ACB6',
  dark: '#BB2E47',
  contrastText: common.white,
}
const warning = {
  main: '#D28E27',
  dark: '#9A671B',
  light: '#D28E27',
  contrastText: common.white,
}
const info = {
  main: '#2780D2',
  light: '#A9CCED',
  dark: '#1C62A1',
  contrastText: common.white,
}
const text = {
  primary: '#354752',
  secondary: '#8798A1',
  disabled: '#C8D3D9',
}
const defaultLightPalette = {
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
  success: secondary,
  divider: 'rgba(0,0,0,0,0.12)',
}
export default defaultLightPalette
//# sourceMappingURL=defaultLightPalette.js.map
