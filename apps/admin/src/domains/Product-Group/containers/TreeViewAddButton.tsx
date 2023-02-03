import { HBButton, HBIcon, HBIconType, RenderTree } from '@hasty-bazar/core'
import { Box } from '@mui/material'
import { useRouter } from 'next/router'
import { FC } from 'react'
import { useFormContext } from 'react-hook-form'

export type TreeViewAddButtonProps = {
  addNode: (node: RenderTree, addName?: string, icon?: HBIconType) => void
  moveNode: (nodes: RenderTree[], selectedNodeId: string, orientation: boolean) => RenderTree[]
  node: RenderTree
  nodes: RenderTree[]
  isRoot: boolean
  selectedNodeId: string
}

const TreeViewAddButton: FC<TreeViewAddButtonProps> = ({ node, isRoot }) => {
  const { push, query: { slug: [action, id] = [] } = {} } = useRouter()
  const { reset } = useFormContext()
  return (
    <Box display="flex" alignItems="center" sx={{ my: 2, width: 200 }}>
      <HBButton
        sx={{ mr: 2, borderRadius: 4, height: 40, borderColor: 'grey.200' }}
        fullWidth
        variant="text"
        color="info"
        onClick={() => {
          reset({})
          push(`/product-group/add/${node.id}`)
        }}
      >
        <HBIcon type="plus" size="small" />
        افزودن
      </HBButton>
    </Box>
  )
}

export default TreeViewAddButton
