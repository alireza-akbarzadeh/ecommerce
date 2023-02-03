import { Theme } from '@mui/material'
import { makeStyles, Styles, WithStylesOptions } from '@mui/styles'
import ThemeConstants from './constants'

const { htmlFontSize } = ThemeConstants

export const pxToRem = (px: number, baseFontSize: number = htmlFontSize) =>
  `${(px / baseFontSize).toFixed(3)}rem`

export const remToPx = (rem: number, baseFontSize: number = htmlFontSize) =>
  `${(rem * baseFontSize).toFixed(0)}px`

function makeHBStyles<
  // eslint-disable-next-line @typescript-eslint/ban-types
  Props extends object = {},
  ClassKey extends string = string,
>(styles: Styles<Theme, Props, ClassKey>, options: Omit<WithStylesOptions<Theme>, 'withTheme'>) {
  return makeStyles(styles, options)
}

export default makeHBStyles
