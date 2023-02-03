import { HBClassesType } from '@hasty-bazar/core'

type HBPageClassNames =
  | 'selectComponentWidth'
  | 'gridSection'
  | 'currentState'
  | 'switchMainContainer'

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
  switchMainContainer: {
    display: 'flex',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
}
