import { HBButton, HBIcon, RenderTree } from '@hasty-bazar/core'
import Box from '@mui/material/Box'
import { useRouter } from 'next/router'
import { FC } from 'react'
import { useIntl } from 'react-intl'
import MegaMenuPageMessages from '../../MegaMenu.messages'

export type TreeViewAddButtonProps = {
  setSelectedNodeId: () => void
  node: RenderTree
}

const TreeViewAddButton: FC<TreeViewAddButtonProps> = ({ node, setSelectedNodeId }) => {
  const { formatMessage } = useIntl()
  const router = useRouter()
  const menuGroupId = router?.query?.menuGroupId?.[0] || ''
  return (
    <Box display="flex" alignItems="center" sx={{ my: 2, width: 200 }}>
      <HBButton
        sx={({ spacing }) => ({
          mr: 2,
          borderRadius: spacing(4),
          height: 40,
          borderColor: 'grey.200',
        })}
        fullWidth
        variant="text"
        color="info"
        onClick={() => {
          //@ts-ignore
          setSelectedNodeId(node.id)
          router.push({
            pathname: `/mega-menu/structure/${menuGroupId}/add`,
            query: { parentId: node.id },
          })
        }}
      >
        <HBIcon type="plus" size="small" />
        {formatMessage(MegaMenuPageMessages.addButton)}
      </HBButton>
    </Box>
  )
}

export default TreeViewAddButton
