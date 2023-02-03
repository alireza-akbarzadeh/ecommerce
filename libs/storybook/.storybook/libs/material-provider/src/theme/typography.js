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
    '@media (max-width:1600px)': {},
    '@media (max-width:1280px)': {},
    '@media (max-width:960px)': {},
  },
  h2: {
    fontWeight: fontWeightBold,
    fontSize: pxToRem(48),
    lineHeight: '60px',
    '@media (max-width:1600px)': {},
    '@media (max-width:1280px)': {},
    '@media (max-width:960px)': {},
  },
  h3: {
    fontWeight: fontWeightBold,
    fontSize: pxToRem(32),
    lineHeight: '40px',
    '@media (max-width:1600px)': {},
    '@media (max-width:1280px)': {},
    '@media (max-width:960px)': {},
  },
  h4: {
    fontWeight: fontWeightBold,
    fontSize: pxToRem(24),
    lineHeight: '30px',
    '@media (max-width:1600px)': {},
    '@media (max-width:1280px)': {},
    '@media (max-width:960px)': {},
  },
  h5: {
    fontWeight: fontWeightMedium,
    fontSize: pxToRem(20),
    lineHeight: '25px',
    '@media (max-width:1600px)': {},
    '@media (max-width:1280px)': {},
    '@media (max-width:960px)': {},
  },
  h6: {
    fontWeight: fontWeightRegular,
    fontSize: pxToRem(18),
    lineHeight: '23px',
    '@media (max-width:1600px)': {},
    '@media (max-width:1280px)': {},
    '@media (max-width:960px)': {},
  },
  subtitle1: {
    fontWeight: fontWeightMedium,
    fontSize: pxToRem(16),
    lineHeight: '20px',
    '@media (max-width:1600px)': {},
    '@media (max-width:1280px)': {},
    '@media (max-width:960px)': {},
  },
  subtitle2: {
    fontWeight: fontWeightRegular,
    fontSize: pxToRem(14),
    lineHeight: '18px',
    '@media (max-width:1600px)': {},
    '@media (max-width:1280px)': {},
    '@media (max-width:960px)': {},
  },
  body1: {
    fontWeight: fontWeightLight,
    fontSize: pxToRem(16),
    lineHeight: '20px',
    '@media (max-width:1600px)': {},
    '@media (max-width:1280px)': {},
    '@media (max-width:960px)': {},
  },
  body2: {
    fontWeight: fontWeightLight,
    fontSize: pxToRem(14),
    lineHeight: '18px',
    '@media (max-width:1600px)': {},
    '@media (max-width:1280px)': {},
    '@media (max-width:960px)': {},
  },
  button: {
    fontWeight: fontWeightLight,
    fontSize: pxToRem(16),
    lineHeight: '24px',
    '@media (max-width:1600px)': {},
    '@media (max-width:1280px)': {},
    '@media (max-width:960px)': {},
  },
  caption: {
    fontWeight: fontWeightRegular,
    fontSize: pxToRem(12),
    lineHeight: '15px',
    '@media (max-width:1600px)': {},
    '@media (max-width:1280px)': {},
    '@media (max-width:960px)': {},
  },
  overline: {
    fontWeight: fontWeightMedium,
    fontSize: pxToRem(12),
    lineHeight: '15px',
    '@media (max-width:1600px)': {},
    '@media (max-width:1280px)': {},
    '@media (max-width:960px)': {},
  },
}
const typography = Object.assign(
  Object.assign({ htmlFontSize, fontFamily, fontSize }, fontWeights),
  typographyHeadings,
)
export default typography
//# sourceMappingURL=typography.js.map
