import { Theme, Typography } from '@mui/material'
import { styled } from '@mui/material/styles'
import { SxProps } from '@mui/system'

const inlineItem: SxProps = {
  display: 'flex',
  alignItems: 'center',
  gap: 1,
}
const Typo: SxProps = {
  color: (theme: Theme) => theme.palette.text.secondary,
  fontSize: (theme: Theme) => theme.typography.body2,
}
const Label = styled(Typography)(({ theme }) => ({}))

export { Typo, inlineItem, Label }
