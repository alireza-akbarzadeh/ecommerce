import HBTextFieldController from '@hasty-bazar-commerce/components/HBTextFieldController'
import { HBButton, HBDialog, useYupValidationResolver } from '@hasty-bazar/core'
import { Box, buttonBaseClasses, Stack, Typography } from '@mui/material'
import { FC } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { useIntl } from 'react-intl'
import * as yup from 'yup'
import WalletMessages from '../wallet.messages'
interface NoteDialogProps {
  open: boolean
  onClose: (needToRefetch?: boolean) => void
  note: string
  partyWalletId: string
}

const MAX_NOTE_LENGTH = 50
const NoteDialog: FC<NoteDialogProps> = ({
  onClose,
  open,
  note: defaultValue,
  partyWalletId: partyWalletHistoryId,
}) => {
  const { formatMessage } = useIntl()
  const schema = yup.object().shape({
    note: yup
      .string()
      .required(formatMessage(WalletMessages.requiredField))
      .test(
        'len',
        formatMessage(WalletMessages.maxNoteLength, { max: MAX_NOTE_LENGTH }),
        (val: string) => val.length <= MAX_NOTE_LENGTH,
      ),
  })

  const resolver = useYupValidationResolver(schema)
  const {
    control,
    formState: { isValid },
  } = useForm<{
    note: string
  }>({
    defaultValues: {
      note: defaultValue || '',
    },
    resolver,
    mode: 'all',
  })
  const { note = '' } = useWatch({
    control,
  })

  return (
    <HBDialog
      open={open}
      maxWidth="lg"
      title={formatMessage(WalletMessages.noteForTransaction)}
      onClose={() => onClose()}
      onBackdropClick={() => onClose()}
    >
      <Stack
        sx={{
          width: {
            md: 780,
            xs: '100%',
          },
        }}
        spacing={6}
        mt={6}
      >
        <HBTextFieldController<{ note: string }>
          name={'note'}
          control={control}
          multiline
          rows={4}
          inputProps={{ maxLength: MAX_NOTE_LENGTH }}
          label={formatMessage(WalletMessages.writeYourNote)}
        />
        <Typography variant="caption" color={'text.secondary'}>
          {MAX_NOTE_LENGTH}/{note.length}
        </Typography>
      </Stack>

      <Box display="flex" justifyContent={'space-between'} mt={10}>
        <HBButton variant="outlined" onClick={() => onClose()}>
          {formatMessage(WalletMessages.cancel)}
        </HBButton>
        <HBButton
          sx={{
            [`&.${buttonBaseClasses.disabled}`]: {
              backgroundColor: 'primary.main',
              opacity: 0.3,
              color: 'common.white',
            },
            color: 'common.white',
          }}
          disabled={!isValid}
        >
          {formatMessage(WalletMessages.confirm)}
        </HBButton>
      </Box>
    </HBDialog>
  )
}

export default NoteDialog
