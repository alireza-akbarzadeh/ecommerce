import CommentCard from '@hasty-bazar-admin/domains/CommentReview/components/CommentCard'
import { useGetAdminSocialCommentsQuery } from '@hasty-bazar/admin-shared/services/socialApi.generated'
import { HBButton, HBDialog } from '@hasty-bazar/core'
import { Box, Typography } from '@mui/material'
import { useState } from 'react'
import { useIntl } from 'react-intl'
import ShipmentManagementMessage from '../../../messages'
const CommentReview = ({ productId, partyId }: { productId: string; partyId: string }) => {
  const [isOpenDialog, setOpenDialog] = useState<boolean>(false)
  const { formatMessage } = useIntl()

  const { data: { data: { items: CommentReview = [] } = {} } = {} } =
    useGetAdminSocialCommentsQuery({
      'client-name': '',
      'client-version': '',
      partyId,
      productId,
      filter: 'ProductId_Equal_--ProductId & PartyId_Equal_--PartyId',
    })
  return (
    <>
      <Box display={'flex'} justifyContent="flex-end">
        <HBButton onClick={() => setOpenDialog(true)} color={'primary'}>
          <Typography sx={{ color: 'white' }}>
            {formatMessage(ShipmentManagementMessage.commentReview)}
          </Typography>
        </HBButton>
      </Box>
      <HBDialog
        title={formatMessage(ShipmentManagementMessage.commentReviewSubmit)}
        onClose={() => setOpenDialog(false)}
        onReject={() => setOpenDialog(false)}
        open={isOpenDialog}
        PaperProps={{
          sx: {
            height: 360,
            width: 750,
          },
        }}
      >
        {CommentReview?.length ? (
          CommentReview?.map((item) => <CommentCard data={item} />)
        ) : (
          <Typography variant="body1" color={'grey.500'}>
            {formatMessage(ShipmentManagementMessage.thereIsNotCommentReview)}
          </Typography>
        )}
      </HBDialog>
    </>
  )
}

export default CommentReview
