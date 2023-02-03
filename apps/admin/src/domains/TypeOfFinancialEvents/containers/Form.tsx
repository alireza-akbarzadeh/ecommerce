import HBTextFieldController from '@hasty-bazar/admin-shared/containers/HBTextFieldController'
import phrasesMessages from '@hasty-bazar-admin/core/translations/phrases.messages'
import { HBButton, HBDialog, HBSelectProps } from '@hasty-bazar/core'
import { Box, buttonClasses, Grid, useTheme } from '@mui/material'
import { useRouter } from 'next/router'
import { FC, useRef, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { useIntl } from 'react-intl'
import FormHeader from '../components/FormHeader'
import { classes } from '../formConfig'
import TypeOfFinancialEventsMessages from '../typeOfFinancialEvents.message'

export type SelectBoxOptionsType = HBSelectProps['menuItem']
interface RefetchMethodModel {
  refetch: () => void
}

const Form: FC<RefetchMethodModel> = ({ refetch }) => {
  const { formatMessage } = useIntl()
  const [openConfirmModal, setOpenConfirmModal] = useState(false)
  const { spacing, breakpoints } = useTheme()
  const ref = useRef<HTMLButtonElement>(null)
  const router = useRouter()
  const id = router.query.id?.[0]
  const {
    formState: { isValid, isDirty },
  } = useFormContext()

  const handleGoBack = () => {
    if (isDirty) {
      setOpenConfirmModal(true)
    } else {
      router.replace('/typeOfFinancialEvents')
    }
  }

  const handleSave = () => {
    if (isValid) {
      ref.current?.click()
      router.replace('/typeOfFinancialEvents')
    }
    setOpenConfirmModal(false)
  }

  const handleCancel = () => {
    setOpenConfirmModal(false)
    router.replace('/typeOfFinancialEvents')
  }

  return (
    <>
      <Box>
        <Grid container spacing={spacing(6)} mb={10}>
          <Grid container item xs={12} sm={12} sx={classes.gridSection} mt={6}>
            <FormHeader id={id} refetch={refetch} />
            <Grid container spacing={6} mt={6}>
              <Grid item xs={12} sm={6} md={6}>
                <HBTextFieldController
                  formRules={{ required: false }}
                  label={formatMessage(TypeOfFinancialEventsMessages.code)}
                  name="id"
                  disabled={!!id}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={6}>
                <HBTextFieldController
                  formRules={{ required: false }}
                  label={formatMessage(TypeOfFinancialEventsMessages.title)}
                  name="name"
                />
              </Grid>
              <Grid item xs={12} sm={12} md={12}>
                <HBTextFieldController
                  label={formatMessage(TypeOfFinancialEventsMessages.description)}
                  fullWidth
                  name="description"
                  autoComplete={'off'}
                  multiline
                  rows={3}
                  maxRows={3}
                  formRules={{
                    required: false,
                  }}
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Box>
      <Box display="flex" justifyContent="space-between" mt={8}>
        <HBButton
          size={breakpoints.down('sm') ? 'medium' : 'small'}
          variant="outlined"
          onClick={handleGoBack}
        >
          {formatMessage(phrasesMessages.back)}
        </HBButton>
        <HBButton
          size={breakpoints.down('sm') ? 'medium' : 'small'}
          sx={() => ({
            width: 152,
            mx: 1,
            [`&.${buttonClasses.disabled}`]: {
              bgcolor: 'primary.main',
              opacity: '0.3',
              color: 'background.paper',
            },
          })}
          ref={ref}
          type="submit"
          disabled={id ? isValid && !isDirty : !isValid}
          color="primary"
        >
          {formatMessage(phrasesMessages.confirm)}
        </HBButton>
      </Box>
      <HBDialog
        title={formatMessage(TypeOfFinancialEventsMessages.save)}
        content={formatMessage(TypeOfFinancialEventsMessages.wouldYouLikeToSaveTheChanges)}
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

export default Form
