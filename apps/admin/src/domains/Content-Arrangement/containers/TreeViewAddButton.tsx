import { HBButton, HBIcon, HBTreeViewProps } from '@hasty-bazar/core'
import { Box } from '@mui/material'
import { useRouter } from 'next/router'

type AddButtonProps = React.ComponentProps<HBTreeViewProps['AddComponent'] & {}>
const TreeViewAddButton = (
  props: AddButtonProps & {
    onAdd: VoidFunction
  },
) => {
  const router = useRouter()

  const pagePartId = (props.node.id as string).split('-')[1]
  const handleAdd = () => {
    props.onAdd()
    router.push({
      pathname: `/content-management/create`,

      query: {
        pagePartId,
        pageId: props.node.pid,
      },
    })
  }
  if (!props?.node.id.includes('pagePart')) {
    return null
  }
  return (
    <Box display="flex" alignItems="center" sx={{ my: 2, width: '100%', maxWidth: 200 }}>
      <HBButton
        sx={{ mr: 2, borderRadius: 4, height: 40, borderColor: 'grey.200' }}
        fullWidth
        variant="text"
        color="info"
        onClick={handleAdd}
      >
        <HBIcon type="plus" size="small" />
        افزودن
      </HBButton>
    </Box>
  )
}

export default TreeViewAddButton
