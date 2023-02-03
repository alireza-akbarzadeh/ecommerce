import { HBClassesType } from '@hasty-bazar/core'
import { outlinedInputClasses } from '@mui/material'
import { HBPageClassnames } from '../../types/SearchTreeProps'

export const searchTreeClasses: HBClassesType<HBPageClassnames> = {
  root: ({ palette }) => ({
    backgroundColor: palette.grey[200],
    p: 4,
    display: 'flex',
  }),
  angleIcon: ({ palette, spacing }) => ({
    mr: 2,
    color: palette.grey[700],
    background: palette.common.white,
    borderRadius: spacing(2),
    width: 45,
    height: 40,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }),
  input: ({ palette, spacing }) => ({
    backgroundColor: palette.common.white,
    borderRadius: spacing(2),
    [`& .${outlinedInputClasses.root}`]: {
      '& > fieldset': { borderColor: palette.grey[200] },
    },
    [`& .${outlinedInputClasses.root}.${outlinedInputClasses.focused}`]: {
      '& > fieldset': {
        borderRadius: spacing(2),
      },
    },
    [`& .${outlinedInputClasses.root}:hover`]: {
      '& > fieldset': {
        borderRadius: spacing(2),
      },
    },
  }),
}
