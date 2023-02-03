import { HBClassesType } from '@hasty-bazar/core'
import { treeItemClasses } from '@mui/lab'
import { HBContainerWithTreeClassnames } from './types/HBContainerWithTreeClassnames'

export const HBViewContainerWithTreeClasses: HBClassesType<HBContainerWithTreeClassnames> = {
  container: {
    width: '100%',
    height: 'calc(100vh - 120px)',
    display: 'flex',
    flexDirection: 'column',
  },
  toolsContainer: {
    display: 'flex',
    flexDirection: { xs: 'column', sm: 'row' },
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    mb: 2,
  },
  pageTitleBar: {
    alignSelf: 'flex-end',
  },
  mainContainer: {
    flexGrow: '1',
    display: 'flex',
    flexDirection: { xs: 'column', sm: 'row' },
    gap: 2,
    alignItems: 'flex-start',
    position: 'relative',
  },
  treeColumn: ({ spacing }) => ({
    width: { xs: '100%', sm: spacing(94) },
    borderRadius: spacing(4),
    minWidth: spacing(94),
    overflow: 'auto',
  }),
  treeItems: ({ spacing }) => ({
    p: spacing(3, 6),
    [`.${treeItemClasses.group} li .${treeItemClasses.content}`]: {
      position: 'relative',
      '.bullet': {
        top: 0,
      },
    },
  }),
  optionsColumn: { width: { xs: '100%', sm: '100%' }, overflowX: 'auto' },
  dataNotFound: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 'calc(100vh - 270px)',
  },
  displayAddChildrenButton: {
    '.icon-wrapper': {
      opacity: 0,
      transition: 'all .3s',
    },
    '&:hover .icon-wrapper': {
      opacity: 1,
    },
  },
  bullet: ({ spacing }) => ({
    position: 'absolute',
    backgroundColor: '#2E7D3273',
    width: spacing(2),
    height: spacing(2),
    left: 0,
    top: spacing(2),
    borderRadius: '50%',
  }),
}
