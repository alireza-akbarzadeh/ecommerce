import {
  useGetOtpSettingQuery,
  usePostIdsChangePasswordMutation,
} from '@hasty-bazar-commerce/core/utils/IdsApi'
import profileMessage from '@hasty-bazar-commerce/domains/Profile/profile.messages'
import { HBDialog, HBForm, openToast } from '@hasty-bazar/core'
import { Box, Stack } from '@mui/material'
import { FC, useEffect } from 'react'
import { useIntl } from 'react-intl'
import ChangePasswordForm from './ChangePasswordForm'

interface IChangePasswordDialog {
  open: boolean
  onClose: () => void
  userName: string
}

export interface IChangePasswordForm {
  currentPassword: string
  newPassword: string
}

const ChangePasswordDialog: FC<IChangePasswordDialog> = ({ onClose, open, userName }) => {
  const [chagePasswordMutate, { isLoading }] = usePostIdsChangePasswordMutation()
  const { data: otpSettings, refetch } = useGetOtpSettingQuery({})
  const handleSubmit = (values: any) => {
    chagePasswordMutate({
      username: userName,
      newPassword: values.newPassword,
      currentPassword: values.currentPassword,
    })
      .unwrap()
      .then(({ data }) => {
        openToast({
          message: formatMessage(profileMessage.changedPasswordSuccessfully),
          type: 'success',
        })
        onClose()
      })
      .catch((error) => {
        openToast({
          message: error.data,
          type: 'error',
        })
      })
  }

  const { formatMessage } = useIntl()

  useEffect(() => {
    if (open) refetch()
  }, [open])

  return (
    <HBDialog
      maxWidth="xs"
      title={formatMessage(profileMessage.changePassword)}
      open={open}
      onClose={onClose}
      onReject={onClose}
    >
      <HBForm<any> onSubmit={handleSubmit} mode="all">
        <Box sx={{ mt: 2 }}>
          <Stack spacing={8} alignItems="flex-start">
            <ChangePasswordForm options={otpSettings} isLoading={isLoading} onClose={onClose} />
          </Stack>
        </Box>
      </HBForm>
    </HBDialog>
  )
}

export default ChangePasswordDialog
