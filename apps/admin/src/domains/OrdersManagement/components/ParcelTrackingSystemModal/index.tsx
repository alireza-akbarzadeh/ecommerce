import phrasesMessages from '@hasty-bazar-admin/core/translations/phrases.messages'
import { HBDialog } from '@hasty-bazar/core'
import { Box } from '@mui/material'
import { useIntl } from 'react-intl'

interface IModalShoppingCart {
  openMapDialog: boolean
  setOpenMapDialog: (val: boolean) => void
  id: string
}

const ParcelTrackingSystemModal = ({ openMapDialog, setOpenMapDialog }: IModalShoppingCart) => {
  const { formatMessage } = useIntl()

  return (
    <HBDialog
      open={openMapDialog}
      onClose={() => setOpenMapDialog(false)}
      onReject={() => setOpenMapDialog(false)}
    >
      <Box width={601} height={780}>
        {formatMessage(phrasesMessages.title)}
      </Box>
    </HBDialog>
  )
}

export default ParcelTrackingSystemModal
