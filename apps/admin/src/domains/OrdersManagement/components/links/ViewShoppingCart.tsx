import { HBDialog, HBIconButton } from '@hasty-bazar/core'
import { Box } from '@mui/material'
import { ICellRendererParams } from 'ag-grid-community'
import { useState } from 'react'
import { useIntl } from 'react-intl'
import OrdersManagementMessages from '../../ordersManagement.message'
import ReturnedItemsModal from '../ReturnedItemsModal'

const ViewShoppingCart = (params: ICellRendererParams) => {
  const { formatMessage } = useIntl()
  const [showModal, setShowModal] = useState<boolean>(false)
  const onShowModal = (value: boolean) => {
    setShowModal(value)
  }

  return (
    params?.data?.id && (
      <>
        <Box
          color={'info.main'}
          display="flex"
          alignItems="center"
          justifyContent="center"
          height="100%"
        >
          <HBIconButton
            icon="shoppingCart"
            variant="text"
            sx={{ color: 'info.main' }}
            iconSize={'medium'}
            onClick={() => onShowModal(true)}
          />
        </Box>
        <HBDialog
          title={formatMessage(OrdersManagementMessages.returnedItems)}
          open={showModal}
          onClose={() => onShowModal(false)}
          onReject={() => onShowModal(false)}
        >
          <ReturnedItemsModal id={params?.data?.id} />
        </HBDialog>
      </>
    )
  )
}

export default ViewShoppingCart
