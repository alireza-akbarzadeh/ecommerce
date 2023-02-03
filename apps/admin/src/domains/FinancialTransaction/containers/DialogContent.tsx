import { HBLink } from '@hasty-bazar/admin-shared/components'
import { MainRefrenceEntity, RefrenceEntity } from '@hasty-bazar/admin-shared/core/enums'
import { Box } from '@mui/material'
import { FC } from 'react'
import OrderCargoModal from './OrderCargoModal'
import OrderItemCommissionDetails from './OrderItemCommissionDetails'
import OrderItemModal from './OrderItemModal'
import TransactionHistory from './TransactionHistoryModal'
interface DialogContentProps {
  referenceId?: string
  referenceEntity?: string
  mainReferenceId?: string
  mainReferenceEntity?: string
}

const DialogContent: FC<DialogContentProps> = ({
  referenceId,
  referenceEntity,
  mainReferenceId,
  mainReferenceEntity,
}) => {
  return (
    <Box width={'100%'}>
      {mainReferenceEntity === MainRefrenceEntity.Order &&
        referenceEntity === RefrenceEntity.OrderVoucher && (
          <HBLink
            underline={'none'}
            href={`/voucherManagement/`}
            variant={'subtitle2'}
            color={'info.main'}
          />
        )}
      {mainReferenceEntity === MainRefrenceEntity.Order &&
        referenceEntity === RefrenceEntity.OrderDetail && (
          <OrderItemModal orderItemId={referenceId!} orderId={mainReferenceId!} />
        )}
      {mainReferenceEntity === MainRefrenceEntity.Order &&
        referenceEntity === RefrenceEntity.OrderPayment && (
          <TransactionHistory id={mainReferenceId!} />
        )}
      {mainReferenceEntity === MainRefrenceEntity.Order &&
        referenceEntity === RefrenceEntity.OrderCommission && (
          <OrderItemCommissionDetails id={referenceId!} />
        )}
      {mainReferenceEntity === MainRefrenceEntity.Order &&
        referenceEntity === RefrenceEntity.OrderCargo && (
          <OrderCargoModal orderId={mainReferenceId!} />
        )}
    </Box>
  )
}

export default DialogContent
