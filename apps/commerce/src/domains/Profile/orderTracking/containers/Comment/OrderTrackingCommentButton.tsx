import { CommentDialog } from '@hasty-bazar-commerce/containers'
import { CommentState } from '@hasty-bazar-commerce/core/enums'
import { GetCommentPartyByProductIdQueryResult } from '@hasty-bazar-commerce/services/socialApi.generated'
import { HBButton, openToast } from '@hasty-bazar/core'
import { FC, useState } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import OrderTrackingMessages from '../../orderTracking.messages'
import OrderTrackingCargoProducts, { ICargoProducts } from './OrderTrackingCargoProducts'

const initialValue = { comment: null, isOpen: false, productId: null }

const OrderTrackingCommentButton: FC<{
  cargoId: string
  partyId: string
  shoppingCartId: string
}> = (props) => {
  const [openProducsDialog, setOpenProductsDialog] = useState<boolean>(false)
  const [commentDialogOption, setCommentDialogOptions] = useState<{
    comment: GetCommentPartyByProductIdQueryResult | null
    isOpen: boolean
    productId: string | null
  }>(initialValue)
  const { formatMessage } = useIntl()
  const handleCloseProductsDialog = (comment?: ICargoProducts) => {
    setOpenProductsDialog(false)
    if (!comment) {
      setOpenProductsDialog(false)
      setCommentDialogOptions(initialValue)
    } else {
      if (comment.comment?.stateCode === CommentState.draft.toString()) {
        return openToast({
          type: 'info',
          message: formatMessage(OrderTrackingMessages.draftCommentMessage),
          vertical: 'top',
        })
      }
      setCommentDialogOptions({
        comment: comment.comment,
        isOpen: true,
        productId: comment.productId,
      })
    }
  }
  return (
    <>
      <HBButton variant="outlined" onClick={() => setOpenProductsDialog(true)}>
        <FormattedMessage {...OrderTrackingMessages.addComment} />
      </HBButton>
      {openProducsDialog && (
        <OrderTrackingCargoProducts {...props} onClose={handleCloseProductsDialog} />
      )}
      {commentDialogOption.isOpen && commentDialogOption.productId && (
        <CommentDialog
          entityId={commentDialogOption.productId}
          onClose={() => setCommentDialogOptions(initialValue)}
          comment={{ ...commentDialogOption.comment }}
        />
      )}
    </>
  )
}

export default OrderTrackingCommentButton
