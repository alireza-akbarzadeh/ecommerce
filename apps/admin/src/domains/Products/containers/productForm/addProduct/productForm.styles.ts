import { HBClassesType } from '@hasty-bazar/core'
type HBPageClassNames =
  | 'mainContainer'
  | 'mainContainerTitleBar'
  | 'mainContainerTitleBarSections'
  | 'statusChip'
  | 'fieldWidth'
  | 'buttonContainer'
  | 'tagsContainer'

export const classes: HBClassesType<HBPageClassNames> = {
  mainContainer: ({ spacing }) => ({
    p: 5,
    borderRadius: spacing(4),
  }),
  mainContainerTitleBar: {
    display: 'flex',
    flexDirection: { sm: 'column', md: 'row' },
    justifyContent: 'space-between',
    alignItems: 'center',
    mb: 6,
  },
  mainContainerTitleBarSections: {
    display: 'flex',
    flexDirection: 'row',
    gap: 3,
    alignItems: 'center',
    mb: 2,
  },
  statusChip: ({ palette }) => ({
    backgroundColor: palette.warning.light,
    color: palette.warning.dark,
  }),
  fieldWidth: { width: '100%' },
  buttonContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    mt: 10,
  },
  tagsContainer: {
    mt: 2,
    display: 'flex',
    flexDirection: 'row',
    gap: 2,
  },
}
