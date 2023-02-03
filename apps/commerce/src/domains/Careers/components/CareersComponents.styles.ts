import { Box, Grid, List, ListItem, styled } from '@mui/material'

export const WrapperStyle = styled(Grid)(({ theme }) => ({
  padding: theme.spacing(4, 0, 0),
  marginBottom: theme.spacing(17.5),
  [theme.breakpoints.down('md')]: {
    marginBottom: theme.spacing(3),
  },
}))

export const AdvantagesItem = styled(Box)(({ theme }) => ({
  width: 100,
  height: 90,
  borderRadius: 8,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(1),
  border: `1px solid ${theme.palette.grey[300]}`,
  margin: theme.spacing(0.5, 0),
}))

export const WizardList = styled(List)(({ theme }) => ({
  position: 'relative',
  overflow: 'hidden',
  counterReset: 'wizard',
}))

export const WizardListItem = styled(ListItem)(({ theme }) => ({
  position: 'relative',
  float: 'left',
  width: 'calc(100% / 6)',
  fontSize: theme.typography.subtitle2.fontSize,
  [theme.breakpoints.down('md')]: {
    width: 'calc(100% / 3)',
    fontSize: theme.typography.caption.fontSize,
  },
  [theme.breakpoints.down('sm')]: {
    width: 'calc(100% / 2)',
  },
  textAlign: 'center',
  paddingBottom: theme.spacing(6),
  color: theme.palette.text.primary,
  '&:before': {
    counterIncrement: 'wizard',
    content: 'counter(wizard)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.palette.common.white,
    border: `1px solid ${theme.palette.primary.main}`,
    color: theme.palette.primary.main,
    width: 36,
    height: 36,
    borderRadius: 50,
    position: 'relative',
    left: '50%',
    zIndex: 1,
  },
  '& span': {
    position: 'absolute',
    bottom: theme.spacing(-1.5),
    width: '100%',
    textAlign: 'center',
  },
  '& + li': {
    '&:after': {
      content: "''",
      display: 'block',
      width: '100%',
      border: `1px dashed ${theme.palette.primary.main}`,
      height: 1,
      position: 'absolute',
      left: '-50%',
      top: 25,
      zIndex: 0,
    },
  },
}))
