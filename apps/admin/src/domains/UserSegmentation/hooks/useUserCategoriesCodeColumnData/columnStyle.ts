import { Box, styled, SxProps, Typography } from '@mui/material'

const CellBoxStyle = styled(Box)(() => ({
  display: 'flex',
  justifyContent: 'flex-start',
  alignItems: 'center',
  height: '100%',
}))

const Status = styled(Typography)(({ theme }) => ({
  textAlign: 'center',
  borderRadius: theme.spacing(2),
  width: 100,
  display: 'block',
}))

const sx: SxProps = { width: 250, height: 40, '& > label': { lineHeight: 0.8 } }

export { CellBoxStyle, sx, Status }
