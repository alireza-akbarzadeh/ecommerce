import HBNumericFieldController from '@hasty-bazar/admin-shared/containers/HBNumericFieldController'
import HBSelectMultiColumnController from '@hasty-bazar/admin-shared/containers/HBSelectMultiColumnController'
import { HBSwitchController } from '@hasty-bazar/admin-shared/containers/HBSwitchController'
import HBTextFieldController from '@hasty-bazar/admin-shared/containers/HBTextFieldController'
import validationsMessages from '@hasty-bazar-admin/core/translations/validations.messages'
import useIsFirstRender from '@hasty-bazar/admin-shared/hooks/useIsFirstRender'
import {
  GetBusinessTypeValuesByBusinessTypeQueryResult,
  GetUserSegmentationsQueryResult,
} from '@hasty-bazar/admin-shared/services/generalDataApi.generated'
import { HBAutocompleteController } from '@hasty-bazar/core'
import { Box, Grid, Typography } from '@mui/material'
import { useEffect } from 'react'
import { useIntl } from 'react-intl'
import { usageTypeForm } from '../../enum/usageTypeForm'
import { VoucherAddEdit } from '../../enum/VoucherAddEdit'
import useFormFieldController from '../../Hook/useFormFieldController'
import { IUseReasonFormController } from '../../types/IUseReasonFormController'
import { VoucherAddEditFormType } from '../../types/VoucherAddEditFormType'
import VoucherManagementPage from '../../VoucherManagementPage.messages'
import { switchClass, sx, TomanClass } from './VoucherAddEditForm.styles'
import { useAppSelector } from '@hasty-bazar/admin-shared/core/redux/hooks'
import HBDateTimePickerController from '@hasty-bazar/admin-shared/containers/HBDateTimePickerController'
import { UsageType } from '@hasty-bazar/admin-shared/core/enums'

const VoucherAddEditForm = ({
  id,
  getValues,
  setValue,
  watchPriceValueType,
  watchVoucherUsageType,
  watchIsActive,
  watchProviderType,
  watchVoucherValue,
  watchMaxPriceValue,
}: VoucherAddEditFormType) => {
  const defaultCurrencyTitle = useAppSelector((state) => state.app.defaultCurrencyTitle)

  const { formatMessage } = useIntl()
  const isFirst = useIsFirstRender()
  const {
    usageTypeData,
    priceValueTypeApi,
    providerTypeApi,
    vendorColumn,
    setSearchText,
    setPage,
    partiesData,
    vendorData,
    setPartiesData,
    page,
    voucherUsageTypeCodeData,
    userSegmentationData,
  } = useFormFieldController()

  const getIsActive = getValues('isActive')
  const maxPrice = getValues('maxPriceValue')
  const voucherValue = getValues('voucherValue')
  const usageType = getValues('usageType')

  useEffect(() => {
    if (!isFirst) {
      if (!watchIsActive) {
        setValue('code', undefined)
      }
    }
  }, [watchIsActive])

  useEffect(() => {
    if (!id) {
      setValue('isActive', true)
    }
  }, [])

  useEffect(() => {
    if (!id) {
      setValue('voucherValue', undefined)
      setValue('maxPriceValue', undefined)
    }
  }, [watchPriceValueType])

  useEffect(() => {
    const resetDisposable = watchVoucherUsageType === String(VoucherAddEdit.disposable)
    if (resetDisposable) {
      setValue('maxTotalPrice', maxPrice)
      setValue('usageLimit', usageTypeForm.usageLimit)
    }
  }, [watchVoucherUsageType])

  useEffect(() => {
    const resetVendor = watchProviderType === String(VoucherAddEdit.platform)
    if (resetVendor) {
      setValue('vendorId', undefined)
    }
  }, [watchProviderType])

  useEffect(() => {
    if (watchVoucherUsageType === String(VoucherAddEdit.disposable)) {
      setValue('maxTotalPrice', maxPrice)
    }
  }, [watchVoucherUsageType, watchPriceValueType, watchMaxPriceValue])

  useEffect(() => {
    if (
      watchPriceValueType === String(VoucherAddEdit.fixed) &&
      watchVoucherUsageType === String(VoucherAddEdit.disposable)
    ) {
      setValue('maxTotalPrice', voucherValue)
    }
  }, [watchVoucherUsageType, watchVoucherValue])
  useEffect(() => {
    if (watchPriceValueType === String(VoucherAddEdit.fixed)) {
      setValue('maxPriceValue', voucherValue)
    }
  }, [watchPriceValueType, watchVoucherValue])

  useEffect(() => {
    if (usageType?.id !== String(UsageType.Exclusive)) {
      setValue('userSegmentations', [])
    }
  }, [usageType])

  return (
    <Box sx={{ mt: 12 }}>
      <Grid container spacing={7} alignItems={'center'}>
        <Grid item xs={12} sm={6} lg={2.4}>
          <HBAutocompleteController<
            IUseReasonFormController,
            GetBusinessTypeValuesByBusinessTypeQueryResult
          >
            controllerProps={{
              rules: {
                required: true,
              },
            }}
            label={formatMessage(VoucherManagementPage.usageType)}
            fieldName={'usageType'}
            isOptionEqualToValue={(o, v) => o.id == v.id}
            getOptionLabel={(option) => option.title ?? ''}
            options={usageTypeData || []}
            required
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={2.4}>
          <Box sx={switchClass}>
            <Typography variant={'body1'}>
              {formatMessage(VoucherManagementPage.manualCreation)}
            </Typography>
            <HBSwitchController
              formRules={{
                required: false,
              }}
              name={'isActive'}
            />
          </Box>
        </Grid>
        <Grid item xs={12} sm={6} lg={2.4}>
          <HBTextFieldController
            disabled={!getIsActive}
            formRules={{
              required: {
                value: watchIsActive as boolean,
                message: formatMessage(VoucherManagementPage.validate, {
                  msg: formatMessage(VoucherManagementPage.discountCode),
                }),
              },
            }}
            required={watchIsActive}
            name={'code' as keyof IUseReasonFormController}
            label={formatMessage(VoucherManagementPage.discountCode)}
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={2.4}>
          <HBTextFieldController
            formRules={{
              required: {
                value: true,
                message: formatMessage(VoucherManagementPage.validate, {
                  msg: formatMessage(VoucherManagementPage.titleDiscount),
                }),
              },
            }}
            name={'title' as keyof IUseReasonFormController}
            label={formatMessage(VoucherManagementPage.titleDiscount)}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2.4}>
          <HBAutocompleteController<IUseReasonFormController, GetUserSegmentationsQueryResult, true>
            label={formatMessage(VoucherManagementPage.targetUsers)}
            fieldName={'userSegmentations'}
            isOptionEqualToValue={(o, v) => o.id == v.id}
            getOptionLabel={(option) => option.name ?? ''}
            options={userSegmentationData?.map(({ id, name }) => ({ id, name })) || []}
            required={usageType?.id === String(UsageType.Exclusive)}
            autoCompleteProps={{
              multiple: true,
            }}
            disabled={usageType?.id === String(UsageType.General)}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2.4}>
          <HBAutocompleteController<
            IUseReasonFormController,
            GetBusinessTypeValuesByBusinessTypeQueryResult
          >
            controllerProps={{
              rules: {
                required: {
                  value: true,
                  message: formatMessage(VoucherManagementPage.validate, {
                    msg: formatMessage(VoucherManagementPage.provider),
                  }),
                },
              },
            }}
            label={formatMessage(VoucherManagementPage.provider)}
            fieldName={'providerType'}
            isOptionEqualToValue={(o, v) => o.id == v.id}
            getOptionLabel={(option) => option.title ?? ''}
            options={providerTypeApi || []}
            required
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={2.4}>
          <Box sx={switchClass}>
            <Typography variant={'body1'}>
              {formatMessage(VoucherManagementPage.returnability)}
            </Typography>
            <HBSwitchController name={'isRefundableReturn'} />
          </Box>
        </Grid>
        <Grid item xs={12} sm={6} lg={2.4}>
          <HBDateTimePickerController
            formRules={{
              required: true,
              validate: (value) => {
                if (!id)
                  return (
                    !value ||
                    !Date.parse(value) ||
                    Date.parse(new Date(value).toLocaleDateString()) >=
                      Date.parse(new Date().toLocaleDateString()) ||
                    `${formatMessage(validationsMessages.invalidDate)}`
                  )
              },
            }}
            inputProps={{ required: true }}
            label={`${formatMessage(VoucherManagementPage.startDate)}`}
            name={'startDate' as keyof IUseReasonFormController}
            defaultValue={new Date()}
            minDateTime={new Date()}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2.4}>
          <HBDateTimePickerController
            label={`${formatMessage(VoucherManagementPage.endDate)}`}
            name={'endDate' as keyof IUseReasonFormController}
            inputProps={{ required: true }}
            formRules={{
              required: true,
              validate: (value) => {
                if (!id)
                  return (
                    !value ||
                    !Date.parse(value) ||
                    Date.parse(new Date(value).toLocaleDateString()) >=
                      Date.parse(new Date().toLocaleDateString()) ||
                    `${formatMessage(validationsMessages.invalidDate)}`
                  )
              },
            }}
            minDateTime={new Date()}
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={2.4}>
          <HBSelectMultiColumnController
            formRules={{
              required: watchProviderType === String(VoucherAddEdit.vendor),
            }}
            name={'vendorId' as keyof IUseReasonFormController}
            label={formatMessage(VoucherManagementPage.seller)}
            disabled={watchProviderType === String(VoucherAddEdit.platform)}
            items={partiesData}
            onInputChange={(_, searchValue) => {
              setPartiesData([])
              setSearchText(searchValue)
            }}
            loadNextPage={() => {
              setPage(page + 1)
            }}
            pageSize={20}
            isOptionEqualToValue={(option, _value) => option.id === _value.id}
            sx={sx}
            columnDefs={vendorColumn}
            totalItems={vendorData?.data?.data?.items?.length!}
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={2.4}>
          <HBAutocompleteController<
            IUseReasonFormController,
            GetBusinessTypeValuesByBusinessTypeQueryResult
          >
            controllerProps={{
              rules: {
                required: {
                  value: true,
                  message: formatMessage(VoucherManagementPage.validate, {
                    msg: formatMessage(VoucherManagementPage.discountAmountType),
                  }),
                },
              },
            }}
            label={formatMessage(VoucherManagementPage.discountAmountType)}
            fieldName={'priceValueType'}
            isOptionEqualToValue={(o, v) => o.id == v.id}
            getOptionLabel={(option) => option.title ?? ''}
            options={priceValueTypeApi || []}
            required
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={4.8}>
          <HBNumericFieldController
            label={formatMessage(VoucherManagementPage.discountCount)}
            name="voucherValue"
            formRules={{
              required: true,
              validate: (value) => {
                if (watchPriceValueType === String(VoucherAddEdit.percentage)) {
                  return (
                    /^(\d{0,2}(\.\d{1,2})?|100(\.00?)?)$/gi.test(value) ||
                    !value ||
                    formatMessage(VoucherManagementPage.validateVoucherValuePercentage)
                  )
                }
              },
            }}
            InputProps={{
              endAdornment: (
                <Box sx={TomanClass}>
                  {watchPriceValueType === String(VoucherAddEdit.fixed)
                    ? defaultCurrencyTitle
                    : watchPriceValueType === String(VoucherAddEdit.percentage)
                    ? formatMessage(VoucherManagementPage.percentage)
                    : defaultCurrencyTitle}
                </Box>
              ),
            }}
            allowNegative={false}
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={2.4}>
          <HBNumericFieldController
            label={formatMessage(VoucherManagementPage.maxPurchaseAmount)}
            name="maxPriceValue"
            formRules={{
              required: false,
            }}
            InputProps={{
              endAdornment: <Box sx={TomanClass}>{defaultCurrencyTitle}</Box>,
            }}
            allowNegative={false}
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={2.4}>
          <HBNumericFieldController
            formRules={{
              required: false,
            }}
            InputProps={{
              endAdornment: <Box sx={TomanClass}>{defaultCurrencyTitle}</Box>,
            }}
            name={'minPurchaseValue' as keyof IUseReasonFormController}
            label={formatMessage(VoucherManagementPage.minPurchaseAmount)}
            allowNegative={false}
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={2.4}>
          <HBAutocompleteController<
            IUseReasonFormController,
            GetBusinessTypeValuesByBusinessTypeQueryResult
          >
            controllerProps={{
              rules: {
                required: {
                  value: true,
                  message: formatMessage(VoucherManagementPage.validate, {
                    msg: formatMessage(VoucherManagementPage.typeOfUse),
                  }),
                },
              },
            }}
            label={formatMessage(VoucherManagementPage.typeOfUse)}
            fieldName={'voucherUsageType'}
            isOptionEqualToValue={(o, v) => o.id == v.id}
            getOptionLabel={(option) => option.title ?? ''}
            options={voucherUsageTypeCodeData || []}
            required
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={4.8}>
          <HBNumericFieldController
            formRules={{
              required: false,
            }}
            disabled={watchVoucherUsageType === String(VoucherAddEdit.disposable)}
            InputProps={{
              endAdornment: <Box sx={TomanClass}>{defaultCurrencyTitle}</Box>,
            }}
            name={'maxTotalPrice' as keyof IUseReasonFormController}
            label={formatMessage(VoucherManagementPage.maximumCumulativeDiscountAmount)}
            allowNegative={false}
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={2.4}>
          <HBNumericFieldController
            formRules={{
              required: watchVoucherUsageType === String(VoucherAddEdit.multiUse),
            }}
            disabled={watchVoucherUsageType === String(VoucherAddEdit.disposable)}
            name={'usageLimit'}
            label={formatMessage(VoucherManagementPage.usageLimit)}
            allowNegative={false}
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={2.4}>
          <HBNumericFieldController
            formRules={{
              required: true,
            }}
            name={'usedCount'}
            label={formatMessage(VoucherManagementPage.LimitTheNumberOfUsers)}
            allowNegative={false}
          />
        </Grid>
      </Grid>
    </Box>
  )
}

export default VoucherAddEditForm
