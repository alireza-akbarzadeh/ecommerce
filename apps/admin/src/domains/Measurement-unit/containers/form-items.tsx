import { HBSwitchController } from '@hasty-bazar/admin-shared/containers/HBSwitchController'
import HBTextFieldController from '@hasty-bazar/admin-shared/containers/HBTextFieldController'
import { FormPatternsEnums } from '@hasty-bazar/admin-shared/core/enums/FormPatterns'
import phrasesMessages from '@hasty-bazar-admin/core/translations/phrases.messages'
import validationsMessages from '@hasty-bazar-admin/core/translations/validations.messages'
import { GetBusinessTypeValuesQueryResult } from '@hasty-bazar/admin-shared/services/generalDataApi.generated'
import { checkPositiveNumber } from '@hasty-bazar/admin-shared/utils/checkPositiveNumber'
import {
  HBAutocompleteController,
  HBButton,
  HBClassesType,
  HBDialog,
  HBIcon,
} from '@hasty-bazar/core'
import { Grid, inputBaseClasses, Stack, Typography } from '@mui/material'
import { Box } from '@mui/system'
import { useRouter } from 'next/router'
import { useRef, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { useIntl } from 'react-intl'
import { MeasurementUnitPageType } from '../measurement-unit'
import measurementUnitMessages from '../measurement-unitMessages.messages'

type HBPageClassNames = 'buttonBox' | 'spinButton'
const classes: HBClassesType<HBPageClassNames> = {
  buttonBox: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  spinButton: {
    [`& .${inputBaseClasses.input}`]: {
      '&::-webkit-outer-spin-button, &::-webkit-inner-spin-button': {
        display: 'none',
      },
      '&[type=number]': {
        MozAppearance: 'textfield',
      },
    },
  },
}
type MeasurementUnitAddEditFormItemsProps = {
  measuringUnitTypeData: GetBusinessTypeValuesQueryResult[] | null
}

const MeasurementUnitAddEditFormItems = ({
  measuringUnitTypeData = [],
}: MeasurementUnitAddEditFormItemsProps) => {
  const { formatMessage } = useIntl()
  const router = useRouter()
  const {
    formState: { isValid, isDirty },
  } = useFormContext<MeasurementUnitPageType>()

  const confirmBtnRef = useRef<HTMLButtonElement>(null)

  const [openConfirmModal, setOpenConfirmModal] = useState<boolean>(false)

  const handleGoBack = () => {
    if (!isDirty) {
      router.push('/measurement-unit')
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
      <Grid container spacing={4} rowSpacing={6} mt={2}>
        <Grid item xs={12} md={3}>
          <HBAutocompleteController
            required
            label={formatMessage(measurementUnitMessages.type)}
            fieldName="measuringUnitType"
            isOptionEqualToValue={(o, v) => o.value == v.value}
            getOptionLabel={(option) => `${option.title}`}
            options={
              measuringUnitTypeData?.map((item) => ({
                title: String(item.title),
                value: item.id || 0,
              })) || []
            }
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <HBTextFieldController
            label={formatMessage(measurementUnitMessages.title)}
            fullWidth
            name={'name'}
            formRules={{
              validate: (value) =>
                !!value.trim() ||
                `${formatMessage(validationsMessages.isRequired, {
                  msg: formatMessage(measurementUnitMessages.title),
                })}`,
              required: {
                value: true,
                message: `${formatMessage(validationsMessages.isRequired, {
                  msg: formatMessage(measurementUnitMessages.title),
                })}`,
              },
            }}
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <HBTextFieldController
            label={formatMessage(measurementUnitMessages.latinTitle)}
            fullWidth
            name={'latinName'}
            formRules={{
              validate: (value) =>
                !!value.trim() ||
                `${formatMessage(validationsMessages.isRequired, {
                  msg: formatMessage(measurementUnitMessages.latinTitle),
                })}`,
              required: {
                value: true,
                message: `${formatMessage(validationsMessages.isRequired, {
                  msg: formatMessage(measurementUnitMessages.latinTitle),
                })}`,
              },
              pattern: new RegExp(FormPatternsEnums.EnText),
            }}
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <HBTextFieldController
            label={formatMessage(measurementUnitMessages.code)}
            fullWidth
            name={'code'}
            formRules={{
              validate: (value) =>
                !!value.trim() ||
                `${formatMessage(validationsMessages.isRequired, {
                  msg: formatMessage(measurementUnitMessages.code),
                })}`,
              required: {
                value: true,
                message: `${formatMessage(validationsMessages.isRequired, {
                  msg: formatMessage(measurementUnitMessages.code),
                })}`,
              },
            }}
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <HBTextFieldController
            label={formatMessage(measurementUnitMessages.factorToBase)}
            fullWidth
            name={'conversionFactor'}
            type="number"
            formRules={{
              required: {
                value: true,
                message: `${formatMessage(validationsMessages.isRequired, {
                  msg: formatMessage(measurementUnitMessages.factorToBase),
                })}`,
              },
              min: 0,
            }}
            sx={classes.spinButton}
            onInput={checkPositiveNumber}
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <HBTextFieldController
            label={formatMessage(measurementUnitMessages.sortOrder)}
            fullWidth
            name={'displaySort'}
            type="number"
            required={false}
            formRules={{ required: false, min: 1 }}
            onInput={checkPositiveNumber}
            sx={classes.spinButton}
          />
        </Grid>
        <Grid item xs={12} md={3} display="flex">
          <Stack spacing={4} display="flex" direction="row" alignItems={'center'}>
            <Typography component="label" variant="body1" color="text.primary">
              {formatMessage(measurementUnitMessages.isBasis)}
            </Typography>
            <HBSwitchController name="isBaseUnit" />
          </Stack>
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
export default MeasurementUnitAddEditFormItems
