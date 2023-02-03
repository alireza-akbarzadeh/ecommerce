import { treeItemClasses, TreeView } from '@mui/lab'
import { Box, Select, styled, textFieldClasses } from '@mui/material'

export const HBSelectTreeRootStyle = styled(Select)(({ theme }) => {
  return {}
})

export const HBSelectTreeSearchStyle = styled(Box)(({ theme: { palette, spacing } }) => {
  return {
    padding: `${spacing(2)} ${spacing(4)}`,
    backgroundColor: palette.grey[200],
    borderRadius: spacing(2, 2, 0, 0),
    marginBottom: spacing(5),
    [`& .${textFieldClasses.root}`]: {
      backgroundColor: palette.common.white,
    },
  }
})
export const HBSelectTreeViewStyle = styled(TreeView)(({ theme: { spacing } }) => {
  return {
    height: 392,
    overflowY: 'auto',
    overflowX: 'auto',
    maxWidth: 400,
    flexGrow: 1,
    padding: spacing(0, 4),
    [`& .${treeItemClasses.label}`]: {
      padding: spacing(2, 0),
    },
    [`& .${treeItemClasses.content}`]: {
      margin: 0,
      padding: 0,
    },
    [`& .${treeItemClasses.iconContainer}`]: {
      width: 'fit-content',
    },
  }
})
