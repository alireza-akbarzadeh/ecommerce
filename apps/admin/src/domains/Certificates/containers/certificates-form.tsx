import { HBSwitchController } from '@hasty-bazar/admin-shared/containers/HBSwitchController'
import HBTextFieldController from '@hasty-bazar/admin-shared/containers/HBTextFieldController'
import { HBUploadLogoController } from '@hasty-bazar/admin-shared/containers/HBUploadLogoController'
import phrasesMessages from '@hasty-bazar-admin/core/translations/phrases.messages'
import validationsMessages from '@hasty-bazar-admin/core/translations/validations.messages'
import {
  GetCertificateQueryResultApiResult,
  useGetAdminCatalogCertificatesByIdQuery,
} from '@hasty-bazar/admin-shared/services/catalogApi.generated'
import { HBButton, HBClassesType, HBDialog, HBIcon } from '@hasty-bazar/core'
import { Box, Grid, Stack, Typography } from '@mui/material'
import { useRouter } from 'next/router'
import { isEmpty } from 'ramda'
import { useEffect, useRef, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { useIntl } from 'react-intl'
import certificatesMessages from '../certificates.messages'

type CertificatesFormProps = {
  certificate: GetCertificateQueryResultApiResult
}

type HBPageClassNames = 'buttonBox'
const classes: HBClassesType<HBPageClassNames> = {
  buttonBox: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
}

const CertificatesForm = ({ certificate }: CertificatesFormProps) => {
  const { formatMessage } = useIntl()
  const router = useRouter()
  const action = router?.query?.id?.[0] ? 'edit' : 'add'
  const {
    formState: { isValid, isDirty, touchedFields },
    reset,
  } = useFormContext()
  const confirmBtnRef = useRef<HTMLButtonElement>(null)
  const [openConfirmModal, setOpenConfirmModal] = useState<boolean>(false)

  useEffect(() => {
    reset({
      isActive: action === 'add' ? true : certificate.data?.isActive,
    })
  }, [])

  useEffect(() => {
    if (!isEmpty(certificate)) {
      reset({
        ...certificate.data,
        isActive: action === 'add' ? true : certificate.data?.isActive,
      })
    }
  }, [certificate])

  const handleGoBack = () => {
    if (isEmpty(touchedFields)) {
      router.push('/certificates')
    } else {
      setOpenConfirmModal(true)
    }
  }

  const handleCancel = (): void => {
    setOpenConfirmModal(false)
    router.back()
  }

  const handleSave = () => {
    if (isValid) {
      confirmBtnRef.current?.click()
    }
  }

  return (
    <>
      <Grid
        container
        xs={12}
        sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
        mb={8}
      >
        <Grid item xs={12} sm={6}>
          <Typography variant="h5" fontWeight={'700'}>
            {formatMessage(certificatesMessages.certificatesByProductGroup)}
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Stack direction="row" justifyContent="end" gap={2} alignItems="center">
            <Typography
              variant="body1"
              children={formatMessage(certificatesMessages.activeInactive)}
            />
            <HBSwitchController name="isActive" />
          </Stack>
        </Grid>
      </Grid>
      <Grid container xs={12} rowSpacing={8}>
        <Grid item xs={12}>
          <HBTextFieldController
            id="input-title"
            label={formatMessage(certificatesMessages.title)}
            name="title"
            autoComplete={'off'}
            formRules={{
              required: {
                value: true,
                message: formatMessage(validationsMessages.isRequired, {
                  msg: formatMessage(certificatesMessages.title),
                }),
              },
            }}
            sx={({ breakpoints }) => ({
              width: '30%',
              [breakpoints.down('md')]: {
                width: '100%',
              },
            })}
          />
        </Grid>
        <Grid item xs={12}>
          <Box sx={{ maxWidth: 120 }}>
            <HBUploadLogoController
              fieldName={'icon'}
              title={formatMessage(certificatesMessages.uploadImage)}
            />
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Box sx={classes.buttonBox}>
            <HBButton
              variant="outlined"
              onClick={handleGoBack}
              startIcon={<HBIcon type="angleRight" />}
            >
              {formatMessage(phrasesMessages.back)}
            </HBButton>
            <HBButton
              variant="contained"
              type="submit"
              color="primary"
              disabled={!isValid || !isDirty}
              ref={confirmBtnRef}
            >
              {formatMessage(phrasesMessages.confirm)}
            </HBButton>
          </Box>
        </Grid>
      </Grid>
      <HBDialog
        title={formatMessage(phrasesMessages.dialogConfirmationTitle)}
        content={formatMessage(phrasesMessages.dialogConfirmationContent)}
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
export default CertificatesForm
