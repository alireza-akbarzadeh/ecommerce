import { HBClassesType } from '@hasty-bazar/core'
import { SxProps, Theme } from '@mui/material'

const switchClass: SxProps = {
  display: 'inline-flex',
  gap: 4,
  alignItems: 'center',
}
const sx: SxProps = {
  height: 41,
}

const TomanClass: SxProps = {
  background: (theme: Theme) => theme.palette.grey['200'],
  p: 2,
  mr: (theme: Theme) => (theme.direction === 'rtl' ? theme.spacing(-3.5) : theme.spacing(3.5)),
  color: 'text.secondary',
}

type HBPageClassNames = 'labelChip' | 'statusChip1' | 'statusChip2'

const classes: HBClassesType<HBPageClassNames> = {
  labelChip: ({ palette }) => ({
    backgroundColor: palette.grey['200'],
    color: palette.grey['500'],
  }),
  statusChip1: ({ palette }) => ({
    backgroundColor: palette.error.light,
    color: palette.error.dark,
  }),
  statusChip2: ({ palette }) => ({
    backgroundColor: palette.success.light,
    color: palette.success.dark,
  }),
}

export { sx, TomanClass, switchClass, classes }
