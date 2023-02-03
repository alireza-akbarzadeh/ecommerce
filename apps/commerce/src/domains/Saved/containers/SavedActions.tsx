import { HBButton, HBCheckBox, HBDialog, HBIcon } from '@hasty-bazar/core'
import { buttonClasses, Stack, Typography } from '@mui/material'
import { FC, useState } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import SavedMessages from '../saved.messages'

interface IFavoriteActions {
  isAllSelected: boolean
  allSelectedCallBack: () => void
  removeItemsCallback?: () => void
  removeButtonProps: {
    loading: boolean
    disabled: boolean
  }
}

const SavedActions: FC<IFavoriteActions> = (props) => {
  const { formatMessage } = useIntl()
  const { isAllSelected, allSelectedCallBack, removeItemsCallback, removeButtonProps } = props
  const [openConfirmDialog, setOpenConfirmDialog] = useState<boolean>(false)

  return (
    <Stack direction="row" alignItems="center" spacing={4}>
      <HBCheckBox checked={isAllSelected} onChange={allSelectedCallBack} />
      <HBButton
        variant="outlined"
        sx={{
          gap: 2,
          [`&.${buttonClasses.disabled}`]: {
            bgcolor: (theme) => `${theme.palette.common.white}!important`,
            opacity: 0.3,
          },
        }}
        {...removeButtonProps}
        onClick={() => setOpenConfirmDialog(true)}
      >
        <Typography sx={{ color: 'grey.700' }} variant="button">
          <FormattedMessage {...SavedMessages.removeSelectedItems} />
        </Typography>
        <HBIcon sx={{ color: 'grey.700' }} type="trashAlt" />
      </HBButton>
      <HBDialog
        maxWidth="xs"
        fullWidth
        open={openConfirmDialog}
        hideCloseButton
        onClose={() => setOpenConfirmDialog(false)}
        title={formatMessage({ ...SavedMessages.removeConfirmMessage })}
        rejectBtn={formatMessage({ ...SavedMessages.cancel })}
        acceptBtn={formatMessage({ ...SavedMessages.remove })}
        onAccept={() => {
          removeItemsCallback?.()
          setOpenConfirmDialog(false)
        }}
        onReject={() => setOpenConfirmDialog(false)}
      />
    </Stack>
  )
}

export default SavedActions
