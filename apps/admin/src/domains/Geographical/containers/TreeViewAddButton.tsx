import phrasesMessages from '@hasty-bazar-admin/core/translations/phrases.messages'
import { HBButton, HBIcon } from '@hasty-bazar/core'
import { Box } from '@mui/material'
import { useRouter } from 'next/router'
import { useIntl } from 'react-intl'

const TreeViewAddButton = (props: any) => {
  const { formatMessage } = useIntl()
  const router = useRouter()
  const handleAdd = () => {
    props?.onAdd()
    router.push({
      pathname: '/geographical/add',
      query: {
        parentId: props.node.id,
      },
    })
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
        {formatMessage(phrasesMessages.add)}
      </HBButton>
    </Box>
  )
}

export default TreeViewAddButton
