import { TypographyOptions } from '@mui/material/styles/createTypography'
import ThemeConstants from './constants'
import { pxToRem } from './helpers'

const {
  htmlFontSize,
  fontFamily,
  fontSize,
  fontWeightLight,
  fontWeightRegular,
  fontWeightMedium,
  fontWeightBold,
} = ThemeConstants

export const fontWeights = {
  fontWeightLight,
  fontWeightRegular,
  fontWeightMedium,
  fontWeightBold,
}
export const typographyHeadings = {
  h1: {
    fontWeight: fontWeightBold,
    fontSize: pxToRem(64),
    lineHeight: '80px',
  },
  h2: {
    fontWeight: fontWeightBold,
    fontSize: pxToRem(48),
    lineHeight: '60px',
  },
  h3: {
    fontWeight: fontWeightBold,
    fontSize: pxToRem(32),
    lineHeight: '40px',
  },
  h4: {
    fontWeight: fontWeightBold,
    fontSize: pxToRem(24),
    lineHeight: '30px',
  },
  h5: {
    fontWeight: fontWeightBold,
    fontSize: pxToRem(20),
    lineHeight: '25px',
  },
  h6: {
    fontWeight: fontWeightBold,
    fontSize: pxToRem(18),
    lineHeight: '23px',
  },

  subtitle1: {
    fontWeight: fontWeightMedium,
    fontSize: pxToRem(16),
    lineHeight: '20px',
  },
  subtitle2: {
    fontWeight: fontWeightRegular,
    fontSize: pxToRem(14),
    lineHeight: '18px',
  },
  body1: {
    fontWeight: fontWeightLight,
    fontSize: pxToRem(16),
    lineHeight: '20px',
  },
  body2: {
    fontWeight: fontWeightLight,
    fontSize: pxToRem(14),
    lineHeight: '18px',
  },
  button: {
    fontWeight: fontWeightMedium,
    fontSize: pxToRem(16),
    lineHeight: '24px',
  },
  caption: {
    fontWeight: fontWeightRegular,
    fontSize: pxToRem(12),
    lineHeight: '15px',
  },
  overline: {
    fontWeight: fontWeightMedium,
    fontSize: pxToRem(12),
    lineHeight: '15px',
  },
}

const typography: TypographyOptions = {
  htmlFontSize,
  fontFamily,
  fontSize,
  ...fontWeights,
  ...typographyHeadings,
}

export default typography
