import { HBDialog } from '@hasty-bazar/core'
import { useIntl } from 'react-intl'
import ProductBulkEditMessages from '../../ProductBulkEdit.messages'

interface UploadDialogProps {
  open: boolean
  onClose: () => void
  count: number
  onConfirm: () => void
  isLoading: boolean
}

export default function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  isLoading,
  count,
}: UploadDialogProps) {
  const { formatMessage } = useIntl()
  return (
    <HBDialog
      content={formatMessage(ProductBulkEditMessages.areYouSureToUpdateProduct, {
        count,
      })}
      open={open}
      title={formatMessage(ProductBulkEditMessages.update)}
      onClose={onClose}
      loading={isLoading}
      acceptBtn={formatMessage(ProductBulkEditMessages.confirm)}
      onAccept={onConfirm}
      rejectBtn={formatMessage(ProductBulkEditMessages.cancel)}
      onReject={onClose}
    ></HBDialog>
  )
}
