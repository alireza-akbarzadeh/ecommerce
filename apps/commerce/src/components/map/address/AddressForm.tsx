import { IAddressModel } from '@hasty-bazar-commerce/containers/Address/CreateAddressForm'
import IranLocalitySelect from '@hasty-bazar-commerce/containers/IranLocalitySelect'
import { HBCheckBoxController, HBTextFieldController } from '@hasty-bazar/auth'
import { HBButton, HBIcon } from '@hasty-bazar/core'
import { Box, Grid, InputAdornment, outlinedInputClasses, Stack, Typography } from '@mui/material'
import { useSession } from 'next-auth/react'
import { FC, useEffect, useRef } from 'react'
import { useFormContext } from 'react-hook-form'
import { FormattedMessage, useIntl } from 'react-intl'
import AddressMessages from './Address.messages'

interface IAddressFormProps {
  changeView: () => void
  loadingChanged: (loading: boolean) => void
  // isValidChanged: (status: boolean) => void
}

const AddressForm: FC<IAddressFormProps> = (props) => {
  const { changeView } = props
  const { watch, setValue } = useFormContext<IAddressModel>()
  const { data } = useSession()
  const { formatMessage } = useIntl()
  const addressInputRef = useRef<HTMLInputElement>(null)
  const addressInputWrapperRef = useRef<HTMLDivElement>(null)
  // const [checkIsValidQuery, { isLoading: checkIsValidLoading, data: checkIsValidData }] =
  //   localityApi.useLazyGetWebLocalityIsValidLocationQuery()

  useEffect(() => {
    const isRecipient = watch('isRecipient')

    if (isRecipient) {
      setValue('recipientName', `${data?.user.firstName} ${data?.user.lastName}`, {
        shouldValidate: true,
      })
      setValue('recipientMobileNo', `${data?.user?.userName?.slice(2)}`, {
        shouldValidate: true,
      })
    } else {
      setValue('recipientName', '')
      setValue('recipientMobileNo', '')
    }
  }, [watch('isRecipient')])

  // useEffect(() => {
  //   if (watch('cityId')) {
  //     checkIsValid(watch('cityId') ?? '')
  //   }
  // }, [watch('cityId')])

  // const checkIsValid = async (value: string) => {
  //   if (!value) return
  //   checkIsValidQuery({
  //     geoId: value,
  //     lat: watch('latitude'),
  //     lng: watch('longitude'),
  //   })
  // }

  // useEffect(() => {
  //   if (checkIsValidData === undefined) return
  //   isValidChanged(checkIsValidData?.data?.isValidLocation ?? false)
  //   if (!checkIsValidData?.data?.isValidLocation) {
  //     openToast({
  //       message: formatMessage({ ...ContainersMessages.localityValidationFailed }),
  //       type: 'error',
  //       vertical: 'top',
  //     })
  //   }
  // }, [checkIsValidData])

  // useEffect(() => {
  //   loadingChanged(checkIsValidLoading)
  // }, [checkIsValidLoading])

  return (
    <Box sx={{ flexGrow: 1, py: 2 }}>
      <Grid container rowGap={4} columnSpacing={4}>
        <Grid item xs={12} sm={6} md={5}>
          <HBTextFieldController
            label={formatMessage({ ...AddressMessages.addressTitle })}
            name="title"
            autoFocus
            formRules={{
              required: { value: true, message: formatMessage(AddressMessages.requiredField) },
            }}
          />
        </Grid>

        <Grid item xs={12}>
          <HBTextFieldController
            onClick={() => addressInputRef.current?.focus()}
            inputRef={addressInputRef}
            sx={{
              [`& .${outlinedInputClasses.root}`]: {
                display: 'block',
              },
            }}
            name="prefixAddress"
            label={formatMessage({ ...AddressMessages.postallAddress })}
            multiline
            InputProps={{
              readOnly: true,
            }}
            formRules={{ required: false }}
          />
          <Typography variant="button" color="text.secondary">
            <FormattedMessage {...AddressMessages.yourAddress} />
          </Typography>
        </Grid>

        <Grid item xs={12} sm={12}>
          <HBTextFieldController
            name="streetLine"
            label={formatMessage(AddressMessages.optionalAddress)}
            formRules={{ required: false }}
          />
        </Grid>

        <Grid item xs={12}>
          <HBButton
            onClick={() => changeView()}
            variant="text"
            sx={{ alignItems: 'center', gap: 1 }}
          >
            <Typography variant="button" color="info.main">
              <FormattedMessage {...AddressMessages.changePlace} />
            </Typography>
            <HBIcon type="angleLeft" sx={{ color: 'info.main' }} />
          </HBButton>
        </Grid>

        <Grid item xs={12} sm={4}>
          <IranLocalitySelect
            type="controlled"
            controlledProps={{
              name: 'provinceId',
              label: formatMessage({ ...AddressMessages.province }),
              required: true,
            }}
            localityType="province"
            // readOnly={checkIsValidLoading}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <IranLocalitySelect
            controlledProps={{
              name: 'cityId',
              label: formatMessage({ ...AddressMessages.city }),
              required: true,
            }}
            localityType="city"
            type="controlled"
            provinceId={watch('provinceId')}
            // readOnly={checkIsValidLoading}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <HBTextFieldController
            formRules={{
              required: { value: true, message: formatMessage(AddressMessages.requiredField) },
            }}
            name="district"
            label={formatMessage(AddressMessages.district)}
          />
        </Grid>

        <Grid item xs={12} sm={4}>
          <HBTextFieldController
            formRules={{
              required: { value: true, message: formatMessage(AddressMessages.requiredField) },
            }}
            mask="0000000000"
            type="number"
            name="plaque"
            label={formatMessage(AddressMessages.plaque)}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <HBTextFieldController
            formRules={{
              required: { value: true, message: formatMessage(AddressMessages.requiredField) },
            }}
            mask="0000000000"
            type="number"
            name="unit"
            label={formatMessage(AddressMessages.unit)}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <HBTextFieldController
            formRules={{
              required: { value: true, message: formatMessage(AddressMessages.requiredField) },
              minLength: { value: 10, message: formatMessage(AddressMessages.postalCodeIncorrect) },
            }}
            mask="0000000000"
            type="number"
            name="postalCode"
            label={formatMessage(AddressMessages.postalCode)}
          />
        </Grid>

        <Grid item xs={12}>
          <Stack direction="row" alignItems="center">
            <HBCheckBoxController noRule formName="isRecipient" />
            <Typography variant="button" color="text.secondary">
              <FormattedMessage {...AddressMessages.deliverUser} />
            </Typography>
          </Stack>
        </Grid>

        <Grid item xs={12} sm={6}>
          <HBTextFieldController
            name="recipientName"
            label={formatMessage(AddressMessages.recipientName)}
            InputProps={{
              readOnly: !!watch('isRecipient'),
            }}
            formRules={{
              required: { value: true, message: formatMessage(AddressMessages.requiredField) },
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <HBTextFieldController
            name="recipientMobileNo"
            label={formatMessage(AddressMessages.recipientMobileNo)}
            mask="000000000"
            type="number"
            sx={{
              '& input': { direction: 'rtl' },
              '& .MuiInputAdornment-root': {
                marginLeft: 0,
              },
            }}
            InputProps={{
              endAdornment: <InputAdornment position="start">09</InputAdornment>,
              readOnly: !!watch('isRecipient'),
            }}
            formRules={{
              required: { value: true, message: formatMessage(AddressMessages.requiredField) },
              minLength: {
                value: 9,
                message: formatMessage(AddressMessages.mobileNumberIncorrect),
              },
            }}
          />
        </Grid>
      </Grid>
    </Box>
  )
}

export default AddressForm
