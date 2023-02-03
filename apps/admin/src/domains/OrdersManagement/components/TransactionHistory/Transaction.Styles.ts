import { Theme } from '@mui/material'
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

export { Typo, inlineItem }
