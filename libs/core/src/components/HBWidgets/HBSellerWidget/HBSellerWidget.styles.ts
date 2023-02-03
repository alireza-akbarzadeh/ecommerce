import { Box, styled } from '@mui/material'

export const BoxImagesStyle = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  height: 'calc(100% - 87px)',
  padding: theme.spacing(1),
  '& > div:nth-of-type(odd)': { marginRight: theme.spacing(1) },
  '& > div:nth-of-type(-n+2)': {
    marginBottom: theme.spacing(1),
  },
  '& > div:nth-of-type(1) > span': { borderTopLeftRadius: theme.spacing(4) },
  '& > div:nth-of-type(2)> span': { borderTopRightRadius: theme.spacing(4) },
}))

export const FooterCardStyle = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  borderTop: 'unset',
  borderBottomLeftRadius: theme.spacing(4),
  borderBottomRightRadius: theme.spacing(4),
  padding: theme.spacing(6, 4, 4),
}))

export const SaveButtonStyle = styled(Box)(({ theme }) => ({
  paddingTop: 0,
  paddingBottom: 0,
  minWidth: 66,
  color: 'info.main',
  display: 'flex',
  alignItems: 'center',
  cursor: 'pointer',
}))
