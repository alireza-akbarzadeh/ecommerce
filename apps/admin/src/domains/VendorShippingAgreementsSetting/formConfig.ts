import { HBClassesType } from '@hasty-bazar/core'
import { HBPageClassNames } from './types'

export const classes: HBClassesType<HBPageClassNames> = {
  selectComponentWidth: { width: '100%' },
  gridSection: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  currentState: {
    display: 'flex',
    alignItems: 'center',
  },
}
