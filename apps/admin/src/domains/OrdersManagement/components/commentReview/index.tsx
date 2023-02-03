import CommentCard from '@hasty-bazar-admin/domains/CommentReview/components/CommentCard'
import { useGetAdminSocialCommentsQuery } from '@hasty-bazar/admin-shared/services/socialApi.generated'
import { HBButton, HBDialog } from '@hasty-bazar/core'
import { Box, Typography } from '@mui/material'
import { useState } from 'react'
import { useIntl } from 'react-intl'
import ordersManagementMessage from '../../ordersManagement.message'
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
        <HBButton onClick={() => setOpenDialog(true)} color="primary">
          <Typography sx={{ color: 'white' }}>
            {formatMessage(ordersManagementMessage.commentReview)}
          </Typography>
        </HBButton>
      </Box>
      <HBDialog
        title={formatMessage(ordersManagementMessage.commentReviewSubmit)}
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
        {CommentReview?.map((item, key) => (
          <CommentCard data={item} key={key} />
        ))}
      </HBDialog>
    </>
  )
}

export default CommentReview
