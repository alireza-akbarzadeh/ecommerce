import { HBSwitchController } from '@hasty-bazar/admin-shared/containers/HBSwitchController'
import HBTextFieldController from '@hasty-bazar/admin-shared/containers/HBTextFieldController'
import phrasesMessages from '@hasty-bazar-admin/core/translations/phrases.messages'
import { HBButton, HBDialog } from '@hasty-bazar/core'
import { Box, Grid, Stack, Typography } from '@mui/material'
import { useRouter } from 'next/router'
import { useRef, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { useIntl } from 'react-intl'
import { DocumentsFileTypesFormType } from '../DocumentFileTypesEditAddPage'
import documentsPageMessages from '../Documents-File-Types.messages'

export default function DocumentAddEditForm({ documentId }: { documentId?: string }) {
  const [openConfirmModal, setOpenConfirmModal] = useState(false)
  const router = useRouter()
  const { formatMessage } = useIntl()
  const submitRef = useRef<HTMLButtonElement>(null)
  const {
    formState: { isValid, isDirty },
  } = useFormContext<DocumentsFileTypesFormType>()

  const handleGoBack = () => {
    if (isDirty) {
      setOpenConfirmModal(true)
    } else {
      router.replace('/documents-file-types')
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
    router.replace('/documents-file-types')
  }

  return (
    <>
      <Box display="flex" justifyContent="space-between">
        <Typography variant="h4">
          {formatMessage(documentsPageMessages.documentFileTypesPageTitle)}
        </Typography>
      </Box>
      <Box mt={8}>
        <Typography variant="body1" color="text.secondary">
          {formatMessage(documentsPageMessages.enterDocumentsData)}
        </Typography>
        <Grid container spacing={6} mt={6} alignItems="center">
          <Grid item xs={12} sm={6} md={3}>
            <HBTextFieldController
              required
              formRules={{
                required: true,
                maxLength: 4000,
              }}
              name={'name'}
              label={formatMessage(documentsPageMessages.formItemName)}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <HBTextFieldController
              required
              formRules={{
                required: true,
                maxLength: 4000,
                validate: (value) => {
                  return (
                    /^[\\x00-\\x7f]+$/gi.test(value) ||
                    !value ||
                    formatMessage(documentsPageMessages.usedInvalidCharacter)
                  )
                },
              }}
              name={'type'}
              label={formatMessage(documentsPageMessages.formItemType)}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <Stack direction="row" gap={2}>
              <Typography variant="body1">
                {formatMessage(documentsPageMessages.formItemIsActive)}
              </Typography>
              <HBSwitchController name={'isActive'} />
            </Stack>
          </Grid>
        </Grid>
        <Box mt={20} display="flex" justifyContent="space-between">
          <HBButton variant="outlined" type="button" onClick={handleGoBack}>
            {formatMessage(documentsPageMessages.back)}
          </HBButton>
          <Box display="flex" alignItems="center" gap={6} justifyContent="flex-end">
            <HBButton
              variant="contained"
              color="primary"
              type="submit"
              disabled={!isDirty || !isValid}
              ref={submitRef}
            >
              {formatMessage(documentsPageMessages.save)}
            </HBButton>
          </Box>
        </Box>
      </Box>
      <HBDialog
        title={formatMessage(phrasesMessages.saveSuccess)}
        content={formatMessage(documentsPageMessages.attributesLikeToSave)}
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
