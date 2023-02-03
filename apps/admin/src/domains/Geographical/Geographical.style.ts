import { HBClassesType } from '@hasty-bazar/core'

type HBPageClassNames =
  | 'toolsContainer'
  | 'mainContainer'
  | 'productsColumn'
  | 'optionsColumn'
  | 'mainOptions'
  | 'selectComponentWidth'
  | 'container'

export const classes: HBClassesType<HBPageClassNames> = {
  container: {
    width: '100%',
    height: 'calc(100vh - 120px)',
    display: 'flex',
    flexDirection: 'column',
  },
  toolsContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  mainContainer: {
    flexGrow: '1',
    display: 'flex',
    flexDirection: { xs: 'column', sm: 'row' },
    gap: 2,
    alignItems: 'flex-start',
    position: 'relative',
  },

  productsColumn: ({ spacing }) => ({
    width: { xs: '100%', sm: spacing(125) },
    borderRadius: spacing(1),
    p: 6,
    overflow: 'scroll',
  }),

  optionsColumn: { width: { xs: '100%', sm: '100%' }, mb: 10 },

  mainOptions: { p: 6, borderRadius: 4 },

  selectComponentWidth: { width: '100%' },
}
