import HBImg from '@hasty-bazar/admin-shared/containers/HBFileUploader/containers/HBImage.style'
import HBSelectController from '@hasty-bazar/admin-shared/containers/HBSelectController'
import HBTextFieldController from '@hasty-bazar/admin-shared/containers/HBTextFieldController'
import { SettlementType, ShippingCostInquiryType } from '@hasty-bazar/admin-shared/core/enums'
import instance from '@hasty-bazar/admin-shared/core/handler'
import phrasesMessages from '@hasty-bazar-admin/core/translations/phrases.messages'
import { useGetAdminCatalogProductRulesQuery } from '@hasty-bazar/admin-shared/services/catalogApi.generated'
import { HBButton, HBDialog, HBIcon, HBSelectProps } from '@hasty-bazar/core'
import { Box, buttonClasses, Grid, Typography, useTheme } from '@mui/material'
import { useRouter } from 'next/router'
import { FC, useRef, useState } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { useIntl } from 'react-intl'
import HBUploadButton from '@hasty-bazar/admin-shared/containers/HBFileUploader/containers/HBUploadButton'
import Currency from '../components/Currency'
import FormHeader from '../components/FormHeader'
import { Shipment } from '../enum/ShipmentTypes'
import { classes } from '../formConfig'
import useDataItemsQuery from '../hooks/useDataItemsQuery'
import ShippingProviderMessages from '../shippingProvider.message'
import { FormPatternsEnums } from '@hasty-bazar/admin-shared/core/enums/FormPatterns'

export type SelectBoxOptionsType = HBSelectProps['menuItem']
interface RefetchMethodModel {
  refetch: () => void
}

const Form: FC<RefetchMethodModel> = ({ refetch }) => {
  const { formatMessage } = useIntl()
  const {
    shippingProviderType,
    selectionLimitationType,
    shippingProviderPriority,
    productCollectionType,
    shippingCostInquiryType,
    checkoutPeriodType,
  } = useDataItemsQuery()
  const [openConfirmModal, setOpenConfirmModal] = useState(false)
  const { spacing, palette, breakpoints } = useTheme()
  const ref = useRef<HTMLButtonElement>(null)
  const router = useRouter()
  const id = router.query.id?.[0]
  const regularExpression =
    /^((https?|ftp|smtp):\/\/)?(www.)?[a-z0-9]+(\.[a-z]{2,}){1,3}(#?\/?[a-zA-Z0-9#]+)*\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$/
  const {
    formState: { isValid, isDirty },
    getValues,
    setValue,
    watch,
    control,
  } = useFormContext()

  const handleGoBack = () => {
    if (isDirty) {
      setOpenConfirmModal(true)
    } else {
      router.replace('/shippingProvider/')
    }
  }

  const handleSave = () => {
    if (isValid) {
      ref.current?.click()
      router.replace('/shippingProvider')
    }
    setOpenConfirmModal(false)
  }

  const handleCancel = () => {
    setOpenConfirmModal(false)
    router.replace('/shippingProvider')
  }

  const checkValueLimitation = (value: any) => {
    const isFixedDayOfTheMonth =
      getValues('checkoutTypeTitle')?.toString() === SettlementType.FixedDayOfTheMonth
    if (isFixedDayOfTheMonth) {
      return (
        (value > 0 && value <= 29) ||
        !value ||
        formatMessage(ShippingProviderMessages.checkoutDaysNotValid)
      )
    } else {
      return (
        (value > 0 && value <= 365) ||
        !value ||
        formatMessage(ShippingProviderMessages.checkoutDaysNotValid)
      )
    }
  }

  const { data: shipmentRules } = useGetAdminCatalogProductRulesQuery({
    'client-name': '',
    'client-version': '',
  })
  return (
    <>
      <Box>
        <Grid container spacing={spacing(6)} mb={10}>
          <Grid container item xs={12} sm={12} sx={classes.gridSection} mt={6}>
            <FormHeader id={id} refetch={refetch} />
            <Grid container spacing={6} mt={6}>
              <Grid item xs={12} sm={3} md={4}>
                <HBTextFieldController
                  formRules={{ required: true }}
                  label={formatMessage(ShippingProviderMessages.serviceCode)}
                  name="providerCode"
                />
              </Grid>
              <Grid item xs={12} sm={3} md={4}>
                <HBTextFieldController
                  formRules={{ required: true }}
                  label={formatMessage(ShippingProviderMessages.serviceName)}
                  name="providerName"
                />
              </Grid>
              <Grid item xs={12} sm={3} md={4}>
                <HBSelectController
                  formRules={{ required: true }}
                  inputLabelProps={{ required: true }}
                  fullWidth
                  label={formatMessage(ShippingProviderMessages.serviceType)}
                  name="providerType"
                  menuItem={
                    shippingProviderType?.map((value) => ({
                      value: value?.id,
                      title: value?.title,
                    })) || []
                  }
                />
              </Grid>
              <Grid item xs={12} sm={3} md={4}>
                <HBSelectController
                  formRules={{ required: false }}
                  fullWidth
                  label={formatMessage(ShippingProviderMessages.exceptionOfTheCommodityGroup)}
                  name="limitationType"
                  menuItem={
                    selectionLimitationType?.map((value) => ({
                      value: value?.id,
                      title: value?.title,
                    })) || []
                  }
                />
              </Grid>
              <Grid item xs={12} sm={3} md={4}>
                <HBSelectController
                  formRules={{ required: true }}
                  inputLabelProps={{ required: true }}
                  fullWidth
                  label={formatMessage(ShippingProviderMessages.priorityOfUsingTheServiceProvider)}
                  name="providerPriority"
                  menuItem={
                    shippingProviderPriority?.map((value) => ({
                      value: value?.id,
                      title: value?.title,
                    })) || []
                  }
                />
              </Grid>
              <Grid item xs={12} sm={3} md={4}>
                <HBSelectController
                  formRules={{ required: true }}
                  inputLabelProps={{ required: true }}
                  fullWidth
                  label={formatMessage(ShippingProviderMessages.typeOfCargoReceive)}
                  name="collectionType"
                  menuItem={
                    productCollectionType?.map((value) => ({
                      value: value?.id,
                      title: value?.title,
                    })) || []
                  }
                />
              </Grid>
              <Grid item xs={12} sm={3} md={4}>
                <HBSelectController
                  formRules={{ required: true }}
                  inputLabelProps={{ required: true }}
                  fullWidth
                  label={formatMessage(ShippingProviderMessages.shippingCostInquiryType)}
                  name="costInquiryType"
                  menuItem={
                    shippingCostInquiryType?.map((value) => ({
                      value: value?.id,
                      title: value?.title,
                    })) || []
                  }
                />
              </Grid>
              <Grid item xs={12} sm={3} md={4}>
                <HBTextFieldController
                  name="onlineServiceURL"
                  size="small"
                  label={formatMessage(ShippingProviderMessages.address)}
                  formRules={{
                    pattern: {
                      value: regularExpression,
                      message: formatMessage(ShippingProviderMessages.addressNotSuccess),
                    },
                    required:
                      watch('costInquiryType')?.toString() === ShippingCostInquiryType.OnTheLine,
                  }}
                  disabled={
                    watch('costInquiryType')?.toString() !== ShippingCostInquiryType.OnTheLine
                  }
                  error={
                    getValues('costInquiryType')?.toString() ===
                      ShippingCostInquiryType.OnTheLine && !getValues('onlineServiceURL')
                  }
                />
              </Grid>
              <Grid item xs={12} sm={3} md={4}>
                <Currency
                  title={formatMessage(ShippingProviderMessages.fixedMonthlySubscriptionFee)}
                  name="fixedAmount"
                  formRules={{ required: true }}
                  isDisable={false}
                  isPercentage={false}
                />
              </Grid>
              <Grid item xs={12} sm={3} md={4}>
                <Currency
                  title={formatMessage(ShippingProviderMessages.commissionPercentageOfTheAmont)}
                  name="commissionAmountInPercent"
                  formRules={{ required: false }}
                  isDisable={
                    watch('costInquiryType')?.toString() !== ShippingCostInquiryType.FixedTariffs
                  }
                  isPercentage
                />
              </Grid>
              <Grid item xs={12} sm={3} md={4}>
                <Currency
                  title={formatMessage(ShippingProviderMessages.minimumCommissionAmount)}
                  name="minimumCommissionAmount"
                  isDisable={
                    watch('costInquiryType')?.toString() !== ShippingCostInquiryType.FixedTariffs
                  }
                  isPercentage={false}
                  formRules={{
                    required: false,
                    validate: (value) => {
                      return (
                        !value ||
                        !getValues('maximumCommissionAmount') ||
                        value < getValues('maximumCommissionAmount')! ||
                        formatMessage(ShippingProviderMessages.minimumCommissionAmountNotValid)
                      )
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={3} md={4}>
                <Currency
                  title={formatMessage(ShippingProviderMessages.maximumCommissionAmount)}
                  name="maximumCommissionAmount"
                  formRules={{
                    required: false,
                    validate: (value) => {
                      return (
                        value > getValues('minimumCommissionAmount')! ||
                        !value ||
                        formatMessage(ShippingProviderMessages.maximumCommissionAmountNotValid)
                      )
                    },
                  }}
                  isDisable={
                    watch('costInquiryType')?.toString() !== ShippingCostInquiryType.FixedTariffs
                  }
                  isPercentage={false}
                />
              </Grid>
              <Grid item xs={12} sm={3} md={4}>
                <HBSelectController
                  formRules={{ required: true }}
                  inputLabelProps={{ required: true }}
                  fullWidth
                  label={formatMessage(ShippingProviderMessages.settlementType)}
                  name="checkoutType"
                  menuItem={
                    checkoutPeriodType?.map((value) => ({
                      value: value?.id,
                      title: value?.title,
                    })) || []
                  }
                />
              </Grid>
              <Grid item xs={12} sm={3} md={4}>
                <HBTextFieldController
                  label={
                    watch('checkoutType') === Shipment.checkoutType
                      ? formatMessage(ShippingProviderMessages.settlementMonth)
                      : formatMessage(ShippingProviderMessages.settlementDay)
                  }
                  name="checkoutDays"
                  type="number"
                  size="small"
                  formRules={{
                    required: true,
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={3} md={4}>
                <Currency
                  title={formatMessage(ShippingProviderMessages.ceilingOfTheValueOfTheShipment)}
                  name="maxShippingValue"
                  formRules={{ required: true }}
                  isDisable={false}
                  isPercentage={false}
                />
              </Grid>
              <Grid item xs={12} sm={3} md={4}>
                <HBSelectController
                  formRules={{ required: true }}
                  inputLabelProps={{ required: true }}
                  fullWidth
                  label={formatMessage(ShippingProviderMessages.shipmentRule)}
                  name="ruleId"
                  menuItem={
                    shipmentRules?.data?.items?.map((items) => ({
                      title: items.name!,
                      value: items.id!,
                    })) || []
                  }
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <HBTextFieldController
                  name={'email'}
                  formRules={{ required: false, pattern: new RegExp(FormPatternsEnums.Email) }}
                  label={formatMessage(ShippingProviderMessages.email)}
                />
              </Grid>
              <Grid item xs={12} sm={12}>
                <Box>
                  <Typography variant="subtitle2" mb={8} color="text.secondary">
                    {formatMessage(ShippingProviderMessages.uploadLogoIcon)}
                  </Typography>
                </Box>
                <Box sx={{ maxWidth: 120 }}>
                  <Controller
                    name={'logo'}
                    control={control}
                    render={({ field }) => (
                      <>
                        {!getValues('logo') && (
                          <HBUploadButton
                            uploadButtonIcon="cameraPlus"
                            uploadButtonAcceptType="image/*"
                            uploadButtonTitle={formatMessage(ShippingProviderMessages.uploadFile)}
                            uploadButtonOnUpload={async (media: any, file: any) => {
                              const formData = new FormData()
                              formData.append('File', file)
                              instance
                                .post(
                                  `${process.env.NEXT_PUBLIC_GATEWAY}/Admin/CMS/Files`,
                                  formData,
                                  {
                                    headers: {
                                      'Content-Type': 'multipart/form-data',
                                      'client-name':
                                        'Swagger on HIT.Hastim.FileServer.Endpoints.WebApi',
                                      'client-version': '1.0.1.100',
                                      Accept: '*/*',
                                    },
                                  },
                                )
                                .then((res: any) => {
                                  const {
                                    data: {
                                      data: { path: path },
                                    },
                                  } = res
                                  setValue('logo', path)
                                })
                                .catch((err) => {})
                            }}
                          />
                        )}
                        {getValues('logo') && (
                          <Box sx={{ position: 'relative' }}>
                            <HBImg
                              src={process.env.NEXT_PUBLIC_CDN + String(getValues('logo'))}
                              sx={{ maxWidth: 120 }}
                            />
                            <HBButton
                              variant="text"
                              sx={{
                                position: 'absolute',
                                bottom: 35,
                                right: 25,
                                minWidth: 20,
                                backgroundColor: palette.common.white,
                                height: 25,
                                padding: 0,
                              }}
                              onClick={() => {
                                setValue('logo', '')
                              }}
                            >
                              <HBIcon type="trash" sx={{ fontSize: spacing(4) }} />
                            </HBButton>
                          </Box>
                        )}
                      </>
                    )}
                  />
                </Box>
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
        title={formatMessage(ShippingProviderMessages.save)}
        content={formatMessage(ShippingProviderMessages.wouldYouLikeToSaveTheChanges)}
        onAccept={handleSave}
        onReject={handleCancel}
        open={openConfirmModal}
        onClose={() => setOpenConfirmModal(false)}
        acceptBtn={formatMessage(phrasesMessages.yes)}
        rejectBtn={formatMessage(phrasesMessages.no)}
      />
    </>
  )
}

export default Form
