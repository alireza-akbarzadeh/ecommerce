import { HBDialog, HBIconButton } from '@hasty-bazar/core'
import { Box } from '@mui/material'
import { ICellRendererParams } from 'ag-grid-community'
import { useState } from 'react'
import { useIntl } from 'react-intl'
import ShipmentManagementMessage from '../../messages'
import DialogContent from './dialogContent'

const RelatedProduct = (params: ICellRendererParams) => {
  const { formatMessage } = useIntl()
  const id = params?.data?.id
  const [showModal, setShowModal] = useState<boolean>(false)
  const onShowModal = (value: boolean) => {
    setShowModal(value)
  }

  return (
    id && (
      <>
        <Box
          color={'info.main'}
          display="flex"
          alignItems="center"
          justifyContent="center"
          height="100%"
        >
          <HBIconButton
            icon="box"
            variant="text"
            sx={{ color: 'info.main' }}
            iconSize={'medium'}
            onClick={() => onShowModal(true)}
          />
        </Box>
        <HBDialog
          title={formatMessage(ShipmentManagementMessage.relatedProduct)}
          open={showModal}
          onClose={() => onShowModal(false)}
          onReject={() => onShowModal(false)}
        >
          <DialogContent {...{ params }} />
        </HBDialog>
      </>
    )
  )
}

export default RelatedProduct
