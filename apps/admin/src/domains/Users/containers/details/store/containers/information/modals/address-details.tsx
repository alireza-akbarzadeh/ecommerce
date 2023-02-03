import HBSelectController from '@hasty-bazar/admin-shared/containers/HBSelectController'
import HBTextFieldController from '@hasty-bazar/admin-shared/containers/HBTextFieldController'
import IranLocalitySelect from '@hasty-bazar/admin-shared/containers/IranLocalitySelect'
import phrasesMessages from '@hasty-bazar-admin/core/translations/phrases.messages'
import validationsMessages from '@hasty-bazar-admin/core/translations/validations.messages'
import userPageMessages from '@hasty-bazar-admin/domains/Users/UserPage.messages'
import { ResultModel } from '@hasty-bazar/admin-shared/services/localityApi.generated'
import { HBCheckBoxController } from '@hasty-bazar/auth'
import { HBButton, HBDialog, HBIcon } from '@hasty-bazar/core'
import { Box, FormHelperText, Grid, Stack, Typography } from '@mui/material'
import { Dispatch, SetStateAction, useEffect } from 'react'
import { useFormContext } from 'react-hook-form'
import { useIntl } from 'react-intl'
import { AddressDetailsFormDataType } from '../address-modal'

export type UserAddressModalMapType = {
  openAddressDetailsDialog: boolean
  setOpenAddressDetailsDialog: Dispatch<SetStateAction<boolean>>
  setOpenAddressMapDialog: Dispatch<SetStateAction<boolean>>
  currentLocation: [number, number]
  streetLineDetails: ResultModel | never[]
  onSubmit: (values: AddressDetailsFormDataType) => void
}

export default function ModalAddressDetails({
  openAddressDetailsDialog,
  setOpenAddressDetailsDialog,
  setOpenAddressMapDialog,
  currentLocation,
  streetLineDetails,
  onSubmit,
}: UserAddressModalMapType) {
  const { formatMessage } = useIntl()

  const {
    setValue,
    watch,
    formState: { isDirty, isValid },
    handleSubmit,
  } = useFormContext()

  const goToChangeAddressMap = () => {
    setOpenAddressDetailsDialog(false)
    setOpenAddressMapDialog(true)
  }

  useEffect(() => {
    setValue('longitude', currentLocation[0])
    setValue('latitude', currentLocation[1])
    //@ts-ignore
    setValue('streetLine', streetLineDetails?.formatted_Address || '')
  }, [currentLocation[0], streetLineDetails])

  return (
    <HBDialog
      title={formatMessage(userPageMessages.newAddress)}
      open={openAddressDetailsDialog}
      onClose={() => setOpenAddressDetailsDialog(false)}
      onReject={() => setOpenAddressDetailsDialog(false)}
    >
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <HBTextFieldController
            label={formatMessage(userPageMessages.titleAddress)}
            fullWidth
            name="title"
            autoComplete={'off'}
            InputLabelProps={{ required: true }}
          />
        </Grid>
        <Grid item xs={12}>
          <HBTextFieldController
            label={formatMessage(userPageMessages.postalAddress)}
            fullWidth
            name="streetLine"
            autoComplete={'off'}
            formRules={{ required: false }}
          />
          <FormHelperText
            sx={({ palette, typography }) => ({
              color: palette.grey[500],
              fontSize: typography.caption.fontSize,
              p: 1,
              m: 1,
            })}
          >
            {formatMessage(userPageMessages.selectedAddressOnYourLocation)}
          </FormHelperText>
        </Grid>
        <Grid item xs={12} my={4}>
          <HBButton variant="text" onClick={goToChangeAddressMap}>
            <Typography color={'info.main'}>
              {formatMessage(userPageMessages.changeLocation)}
            </Typography>
            <HBIcon type="angleLeft" sx={({ palette }) => ({ color: palette.info.main })} />
          </HBButton>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <HBSelectController
            label={formatMessage(userPageMessages.country)}
            fullWidth
            menuItem={[
              { title: formatMessage(userPageMessages.iran), value: '994519304110080000' },
            ]}
            name="country"
            inputLabelProps={{ required: true }}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <IranLocalitySelect
            type="controlled"
            controlledProps={{
              name: 'provinceId',
              label: formatMessage(userPageMessages.province),
              inputLabelProps: { required: true },
            }}
            localityType="province"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <IranLocalitySelect
            controlledProps={{
              name: 'cityId',
              label: formatMessage(userPageMessages.city),
              inputLabelProps: { required: true },
            }}
            localityType="city"
            type="controlled"
            provinceId={watch('provinceId')}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <HBTextFieldController
            label={formatMessage(userPageMessages.district)}
            fullWidth
            name="district"
            autoComplete={'off'}
            formRules={{ required: false }}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <HBTextFieldController
            label={formatMessage(userPageMessages.houseNumber)}
            fullWidth
            name="plaque"
            autoComplete={'off'}
            InputLabelProps={{ required: true }}
            type="number"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <HBTextFieldController
            label={formatMessage(userPageMessages.unit)}
            fullWidth
            name="unit"
            autoComplete={'off'}
            InputLabelProps={{ required: true }}
            type="number"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <HBTextFieldController
            label={formatMessage(userPageMessages.postalCode)}
            fullWidth
            name="postalCode"
            autoComplete={'off'}
            InputLabelProps={{ required: true }}
            formRules={{
              required: {
                value: true,
                message: formatMessage(validationsMessages.isRequired, {
                  msg: formatMessage(userPageMessages.postalCode),
                }),
              },
              minLength: 10,
              maxLength: 10,
            }}
            type="number"
          />
        </Grid>
        <Grid item xs={12}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <HBCheckBoxController noRule formName="isDefault" />
            <Typography variant="button" color="text.secondary">
              {formatMessage(userPageMessages.saveAsDefault)}
            </Typography>
          </Stack>
        </Grid>
      </Grid>
      <Box display="flex" justifyContent="space-between">
        <HBButton
          variant="outlined"
          sx={{ mt: 4 }}
          onClick={() => setOpenAddressDetailsDialog(false)}
        >
          {formatMessage(phrasesMessages.cancel)}
        </HBButton>
        <HBButton
          variant="contained"
          color="primary"
          sx={{ mt: 4 }}
          type="submit"
          form="address"
          disabled={!isValid || !isDirty}
          onClick={(event) => {
            event.preventDefault()
            event.stopPropagation()
            handleSubmit(onSubmit)?.(event)
          }}
        >
          {formatMessage(userPageMessages.saveContinue)}
        </HBButton>
      </Box>
    </HBDialog>
  )
}
