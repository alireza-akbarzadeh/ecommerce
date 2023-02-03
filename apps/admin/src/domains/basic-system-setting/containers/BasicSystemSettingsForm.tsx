import HBTextFieldController from '@hasty-bazar/admin-shared/containers/HBTextFieldController'
import phrasesMessages from '@hasty-bazar-admin/core/translations/phrases.messages'
import { HBButton, HBDialog } from '@hasty-bazar/core'
import { Box, Grid, Typography } from '@mui/material'
import { useRouter } from 'next/router'
import { useRef, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { useIntl } from 'react-intl'
import basicSystemSettingMessages from '../BasicSystemSetting.messages'

const BasicSystemSettingsForm = ({ isEditMode }: { isEditMode: boolean }) => {
  const [openConfirmModal, setOpenConfirmModal] = useState(false)
  const { formatMessage } = useIntl()
  const router = useRouter()
  const submitRef = useRef<HTMLButtonElement>(null)
  const {
    formState: { isValid, isDirty },
  } = useFormContext()

  const handleGoBack = () => {
    if (isDirty) {
      setOpenConfirmModal(true)
    } else {
      router.replace('/basic-system-setting')
    }
  }

  const handleSave = () => {
    if (isValid) {
      submitRef.current?.click()
    }
    setOpenConfirmModal(false)
  }
  const handleCancel = () => {
    setOpenConfirmModal(false)
    router.replace('/basic-system-setting')
  }

  return (
    <>
      <Box display="flex" justifyContent="space-between">
        <Typography variant="h4">
          {formatMessage(basicSystemSettingMessages.RegisterBasicSystemSettings)}
        </Typography>
      </Box>
      <Box mt={8}>
        <Grid container spacing={6} mt={6}>
          <Grid item xs={12} sm={6} md={4}>
            <HBTextFieldController
              required
              formRules={{
                required: true,
                maxLength: 100,
              }}
              name={'name'}
              label={formatMessage(basicSystemSettingMessages.name)}
              disabled={isEditMode}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <HBTextFieldController
              required
              name={'value'}
              formRules={{
                required: true,
                maxLength: 4000,
              }}
              label={formatMessage(basicSystemSettingMessages.controlValue)}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <HBTextFieldController
              required
              name={'category'}
              formRules={{
                required: true,
                maxLength: 4000,
              }}
              label={formatMessage(basicSystemSettingMessages.category)}
              disabled={isEditMode}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={12}>
            <Grid item xs={12}>
              <HBTextFieldController
                label={formatMessage(basicSystemSettingMessages.description)}
                fullWidth
                name="description"
                autoComplete={'off'}
                multiline
                rows={3}
                maxRows={3}
                formRules={{
                  required: false,
                  maxLength: 4000,
                }}
              />
            </Grid>
          </Grid>
        </Grid>
        <Box mt={10} display="flex" justifyContent="space-between">
          <HBButton variant="outlined" type="button" onClick={handleGoBack}>
            {formatMessage(basicSystemSettingMessages.back)}
          </HBButton>
          <Box display="flex" alignItems="center" gap={6} justifyContent="flex-end">
            <HBButton
              variant="contained"
              color="primary"
              type="submit"
              disabled={!isDirty || !isValid}
              ref={submitRef}
            >
              {formatMessage(basicSystemSettingMessages.accept)}
            </HBButton>
          </Box>
        </Box>
      </Box>
      <HBDialog
        title={formatMessage(phrasesMessages.saveSuccess)}
        content={formatMessage(basicSystemSettingMessages.doYouLikeToSave)}
        onAccept={handleSave}
        onReject={handleCancel}
        open={openConfirmModal}
        onClose={() => setOpenConfirmModal(false)}
        acceptBtn={formatMessage(phrasesMessages.confirm)}
        rejectBtn={formatMessage(phrasesMessages.cancel)}
      />
    </>
  )
}

export default BasicSystemSettingsForm
