import { Stack, styled } from '@mui/material'

export const SellerRegistrationRoot = styled(Stack)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  gap: theme.spacing(6),
  backgroundColor: theme.palette.grey[100],
  marginTop: theme.spacing(12),
  position: 'relative',
  paddingRight: theme.spacing(10),
  paddingLeft: theme.spacing(6),
  paddingTop: theme.spacing(12.5),
  paddingBottom: theme.spacing(6),
  borderRadius: theme.spacing(2),
  userSelect: 'none',
  zIndex: 0,
  [theme.breakpoints.down('md')]: {
    height: 626,
  },
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column-reverse',
    padding: theme.spacing(6, 4, 4, 6),
    height: 634,
  },
}))

export const FirstSquare = styled(Stack)(({ theme }) => ({
  position: 'absolute',
  backgroundColor: theme.palette.primary.main,
  right: 0,
  top: theme.spacing(6),
  width: 178,
  height: 242,
  borderRadius: theme.spacing(2),
  [theme.breakpoints.down('md')]: {
    top: 0,
  },
  [theme.breakpoints.down('sm')]: {
    right: 'auto',
    left: theme.spacing(31),
    top: 0,
  },
}))

export const SecondSquare = styled(Stack)(({ theme }) => ({
  position: 'absolute',
  backgroundColor: theme.palette.primary.main,
  left: theme.spacing(6),
  top: 16,
  width: 34.5,
  height: 32.5,
  borderRadius: theme.spacing(0.75),
  [theme.breakpoints.down('md')]: {
    zIndex: 2,
    top: theme.spacing(36.75),
    left: theme.spacing(6),
  },
  [theme.breakpoints.down('sm')]: {
    zIndex: 2,
    top: theme.spacing(41.5),
    left: 0,
  },
}))

export const ThirdSquare = styled(Stack)(({ theme }) => ({
  position: 'absolute',
  backgroundColor: theme.palette.primary.lighter,
  left: 46,
  top: 36,
  width: 25,
  height: 25,
  zIndex: -1,
  borderRadius: theme.spacing(0.75),
  [theme.breakpoints.down('md')]: {
    zIndex: 1,
    top: theme.spacing(41.75),
    left: theme.spacing(11.5),
  },
  [theme.breakpoints.down('sm')]: {
    zIndex: 1,
    top: theme.spacing(46.5),
    left: theme.spacing(5.5),
  },
}))

export const ImageSection = styled(Stack)(({ theme }) => ({
  position: 'relative',
  width: 302,
  height: 281,
  img: { borderRadius: theme.spacing(2) },
  [theme.breakpoints.down('md')]: {
    position: 'absolute',
    width: 338.5,
    height: 315,
    top: theme.spacing(7.25),
    right: theme.spacing(11),
    span: {
      height: `${theme.spacing(78.75)} !important`,
    },
  },
  [theme.breakpoints.down('sm')]: {
    position: 'absolute',
    width: 243,
    height: 226,
    top: theme.spacing(5.25),
    left: theme.spacing(5.75),
    right: 'auto',
    span: {
      height: '226px !important',
    },
  },
}))

export const FormSectionWrapperStyle = styled(Stack)(({ theme }) => ({
  flex: 1,
  [theme.breakpoints.down('md')]: {
    position: 'absolute',
    top: theme.spacing(44.25),
    zIndex: 1,
    left: theme.spacing(13.75),
    marginRight: theme.spacing(2.5),
    width: theme.spacing(96.25),
  },
  [theme.breakpoints.down('sm')]: {
    position: 'absolute',
    top: theme.spacing(48.75),
    zIndex: 1,
    left: theme.spacing(8),
    marginRight: theme.spacing(2.5),
    width: `calc(100% - ${theme.spacing(12)})`,
  },
}))

export const FormSectionStyle = styled(Stack)(({ theme }) => ({
  backgroundColor: theme.palette.common.white,
  height: '100%',
  padding: theme.spacing(6),
  borderRadius: theme.spacing(2),
}))

export const RowSection = styled(Stack)(({ theme, mb }) => ({
  flexDirection: 'row',
  gap: theme.spacing(6),
  [theme.breakpoints.down('sm')]: {
    marginBottom: theme.spacing(6),
    flexDirection: 'column',
  },
  [theme.breakpoints.down('md')]: {
    marginBottom: theme.spacing(7),
    flexDirection: 'column',
    gap: theme.spacing(8),
  },
}))
