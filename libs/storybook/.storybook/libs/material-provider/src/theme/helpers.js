import { makeStyles } from '@mui/styles'
import ThemeConstants from './constants'
const { htmlFontSize } = ThemeConstants
export const pxToRem = (px, baseFontSize = htmlFontSize) => `${(px / baseFontSize).toFixed(3)}rem`
export const remToPx = (rem, baseFontSize = htmlFontSize) => `${(rem * baseFontSize).toFixed(0)}px`
function makeHBStyles(styles, options) {
  return makeStyles(styles, options)
}
export default makeHBStyles
//# sourceMappingURL=helpers.js.map
