import { HBDialog, HBDialogProps } from '@hasty-bazar/core'
import { useIntl } from 'react-intl'
import AddSimpleProductMessages from './AddProduct.messages'

interface UploadDialogProps {
  open: boolean
  onClose: () => void
  count: number
  onConfirm: () => void
  onAcceptBtnProps?: HBDialogProps['onAcceptBtnProps']
  isLoading: boolean
}

export default function ConfirmDialog({
  open,
  onAcceptBtnProps,
  onClose,
  onConfirm,
  isLoading,
  count,
}: UploadDialogProps) {
  const { formatMessage } = useIntl()
  return (
    <HBDialog
      content={formatMessage(AddSimpleProductMessages.areYouSureToUpdateFields, {
        count,
      })}
      open={open}
      title={formatMessage(AddSimpleProductMessages.updateProduct)}
      onClose={onClose}
      loading={isLoading}
      acceptBtn={formatMessage(AddSimpleProductMessages.confirm)}
      onAccept={onConfirm}
      rejectBtn={formatMessage(AddSimpleProductMessages.cancel)}
      onReject={onClose}
      onAcceptBtnProps={onAcceptBtnProps}
    ></HBDialog>
  )
}
