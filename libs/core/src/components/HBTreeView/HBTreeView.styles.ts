import { treeItemClasses } from '@mui/lab/TreeItem'
import TreeView from '@mui/lab/TreeView'
import { styled } from '@mui/material'

export const HBTreeViewRootStyle = styled(TreeView)(({ theme }) => {
  return {
    color: theme.palette.text.secondary,
    '.MuiBox-root': {
      '&:last-child': {
        [`& .${treeItemClasses.root}:after`]: {
          height: '25px',
        },
      },
    },
    [`& .${treeItemClasses.label}`]: {
      padding: theme.spacing(2),
    },
    [`& .${treeItemClasses.root}`]: {
      paddingTop: theme.spacing(2),
      position: 'relative',
      '.HBTreeItem-count': {
        color: theme.palette.warning.main,
        minWidth: 24,
        height: 24,
        borderRadius: theme.spacing(2),
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: theme.palette.warning.lighter,
      },
    },
    [`& .${treeItemClasses.content}`]: {
      height: 40,
      color: theme.palette.common.black,
      borderRadius: theme.spacing(4),
      border: `1px solid ${theme.palette.grey['200']}`,
      paddingRight: theme.spacing(4),
      paddingLeft: theme.spacing(4),
      '.uil-plus': {
        color: theme.palette.primary.main,
      },
      [`&.${treeItemClasses.expanded}`]: {
        fontWeight: theme.typography.fontWeightRegular,
      },
      '&.children-selected': {
        border: `1px solid ${theme.palette.primary.main}`,
        color: theme.palette.primary.main,
      },
      '&:hover': {
        backgroundColor: theme.palette.action.hover,
      },
      [`&.${treeItemClasses.selected}, &.${treeItemClasses.selected}.Mui-focused`]: {
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.primary.contrastText,
        '.uil-plus': {
          color: theme.palette.primary.contrastText,
        },
      },
      [`&.${treeItemClasses.selected}:hover`]: {
        backgroundColor: theme.palette.primary.light,
      },
    },
    [`& .${treeItemClasses.group}`]: {
      marginLeft: theme.spacing(6),
      position: 'relative',
      [`& .${treeItemClasses.content}`]: {
        marginLeft: theme.spacing(6),
        width: `calc(100% - ${theme.spacing(6)})`,
      },
      [`& .${treeItemClasses.root}`]: {
        ':after': {
          content: `''`,
          height: '100%',
          backgroundColor: theme.palette.grey['200'],
          display: 'block',
          left: 0,
          width: 1,
          position: 'absolute',
          top: 0,
          zIndex: 0,
        },
        ':before': {
          content: `''`,
          height: 1,
          backgroundColor: theme.palette.grey['200'],
          display: 'block',
          right: 0,
          width: theme.spacing(6),
          position: 'relative',
          top: 20,
          zIndex: 0,
        },
      },
      [`& .${treeItemClasses.group}:after`]: {
        backgroundColor: theme.palette.grey['200'],
        content: `''`,
        width: 1,
        height: 'calc(100% - 50px)',
        display: 'block',
        position: 'absolute',
        top: 20,
        left: 0,
      },
    },
  }
})
