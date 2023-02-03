import { ApiConstants } from '@hasty-bazar-commerce/core/constants'
import { usePutWebIdrPartiesByIdCheckNationalCodeMutation } from '@hasty-bazar-commerce/services/idrApi.generated'
import { HBTextFieldController } from '@hasty-bazar/auth'
import { HBButton, HBDialog, HBForm, openToast } from '@hasty-bazar/core'
import { DialogProps, Stack, Typography } from '@mui/material'
import { useSession } from 'next-auth/react'
import { FC, useMemo } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { FormattedMessage, useIntl } from 'react-intl'
import ContainersMessages from '../Containers.message'

interface INationalCodeValidationModal extends Required<Pick<DialogProps, 'onClose'>> {
  onSuccess?: VoidFunction
}
interface IForm {
  nationalCode: string
}

const NationalCodeValidationModal: FC<INationalCodeValidationModal> = ({ onClose, onSuccess }) => {
  const { data } = useSession()
  const { formatMessage } = useIntl()
  const formProvider = useForm<IForm>({ defaultValues: { nationalCode: '' } })
  const { watch } = formProvider
  const [nationalCodeMutation, { isLoading, reset }] =
    usePutWebIdrPartiesByIdCheckNationalCodeMutation()

  const handleDisable = useMemo(() => {
    if (!watch('nationalCode') || watch('nationalCode').length < 10 || isLoading) return true
  }, [watch('nationalCode'), isLoading])

  const handleCheckNationalCode: SubmitHandler<IForm> = ({ nationalCode }) => {
    reset()
    nationalCodeMutation({
      ...ApiConstants,
      id: data?.user.partyId!,
      checkNationalCodeCommand: { nationalCode },
    })
      .unwrap()
      .then((payload) => {
        if (payload.success) {
          onSuccess?.()
          onClose({}, 'backdropClick')
        }
      })
      .catch((error) => {
        if (error?.status == 400) {
          error.data.messages[0].message &&
            openToast({
              message: error.data.messages[0].message,
              type: 'error',
              vertical: 'top',
            })
        }
      })
  }

  return (
    <HBDialog
      maxWidth="xs"
      fullWidth
      open
      title={formatMessage(ContainersMessages.nationalCodeTitle)}
      onClose={() => onClose({}, 'backdropClick')}
      onReject={() => onClose({}, 'backdropClick')}
      onBackdropClick={() => onClose({}, 'backdropClick')}
    >
      <Stack px={2} spacing={8}>
        <Typography variant="caption" color="text.secondary">
          <FormattedMessage {...ContainersMessages.nationalCodeDesc} />
        </Typography>
        <HBForm<IForm>
          onSubmit={handleCheckNationalCode}
          mode="all"
          formProviderProps={formProvider}
        >
          <Stack spacing={8}>
            <Stack spacing={2}>
              <HBTextFieldController
                name="nationalCode"
                label={formatMessage(ContainersMessages.nationalCodeTitle)}
                mask="0000000000"
                type="number"
                formRules={{ required: true }}
              />
            </Stack>
            <Stack direction="row" spacing={4}>
              <HBButton onClick={() => onClose({}, 'backdropClick')} variant="outlined" fullWidth>
                <FormattedMessage {...ContainersMessages.cancel} />
              </HBButton>
              <HBButton type="submit" disabled={handleDisable} fullWidth loading={isLoading}>
                <FormattedMessage {...ContainersMessages.saveAndcontinueOrderLabel} />
              </HBButton>
            </Stack>
          </Stack>
        </HBForm>
      </Stack>
    </HBDialog>
  )
}

export default NationalCodeValidationModal
