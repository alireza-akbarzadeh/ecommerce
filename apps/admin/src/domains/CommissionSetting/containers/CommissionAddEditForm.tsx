import HBSelectController from '@hasty-bazar/admin-shared/containers/HBSelectController'
import { HBSwitchController } from '@hasty-bazar/admin-shared/containers/HBSwitchController'
import HBTextFieldController from '@hasty-bazar/admin-shared/containers/HBTextFieldController'
import { CommissionCalculationMethod, CommissionType } from '@hasty-bazar/admin-shared/core/enums'
import phrasesMessages from '@hasty-bazar-admin/core/translations/phrases.messages'
import { HBButton, HBDialog } from '@hasty-bazar/core'
import { Box, buttonClasses, Grid, Stack, Typography } from '@mui/material'
import { useRouter } from 'next/router'
import { FC, useEffect, useRef, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { useIntl } from 'react-intl'
import ComissionSettingMessages from '../CommissionSetting.message'
import Currency from '../components/Currency'
import useDataItemsQuery from '../hooks/useDataItemsQuery'
import { CommissionAddEditFormType } from '../types'
import CommissionFormFields from './CommissionFormFields'

const CommissionAddEditForm: FC = () => {
  const [openConfirmModal, setOpenConfirmModal] = useState<boolean>(false)
  const [isPercentage, setIsPercentage] = useState<boolean>(false)
  const ref = useRef<HTMLButtonElement>(null)
  const { formatMessage } = useIntl()
  const router = useRouter()
  const id = router?.query?.id?.[0]
  const {
    formState: { isValid, isDirty },
    getValues,
    watch,
    setValue,
  } = useFormContext<CommissionAddEditFormType>()
  const { valueType, systemSetting } = useDataItemsQuery()

  const handleGoBack = () => {
    if (!isDirty) {
      router.replace('/commissionSetting')
    } else {
      setOpenConfirmModal(true)
    }
  }
  const handleCancel = () => {
    setOpenConfirmModal(false)
    router.replace('/commissionSetting')
  }
  const handleSave = () => {
    if (isValid) {
      ref.current?.click()
    }
    setOpenConfirmModal(false)
  }

  useEffect(() => {
    const isSeller = getValues('commissionType') == CommissionType.Seller

    if (isSeller && !!systemSetting) {
      const isOriginalPriceUsedForCommissionValue = systemSetting.find(
        (item) => item?.name === 'IsOriginalPriceUsedForCommission',
      )
      const isVatDeductedFromCommissionValue = systemSetting.find(
        (item) => item?.name === 'IsVatDeductedFromCommission',
      )

      setValue(
        'isOriginalPriceUsedForCommission',
        isOriginalPriceUsedForCommissionValue?.value === 'Yes' ? true : false,
      )
      setValue(
        'isVatDeductedFromCommission',
        isVatDeductedFromCommissionValue?.value === 'Yes' ? true : false,
      )
    }
  }, [watch('commissionType')])

  return (
    <Stack gap={6}>
      <Grid container spacing={6}>
        <CommissionFormFields />
        <Grid item xs={12} sm={6} md={3}>
          <HBSelectController
            formRules={{
              required: true,
            }}
            inputLabelProps={{ required: true }}
            fullWidth
            label={formatMessage(ComissionSettingMessages.calculationType)}
            name="calculationType"
            menuItem={valueType?.map((itm) => ({ value: itm.id!, title: itm.title! })) || []}
            onChange={(e) => {
              setValue('calculationType', Number(e?.target?.value!))
              setValue('targetValue', 0)
              if (e.target.value == CommissionCalculationMethod.FixedValue) {
                setValue('minCommissionPrice', undefined)
                setValue('maxCommissionPrice', undefined)
                setIsPercentage(false)
              } else {
                setIsPercentage(true)
              }
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Currency
            title={formatMessage(ComissionSettingMessages.targetValue)}
            name="targetValue"
            formRules={{
              required: true,
            }}
            isDisable={false}
            {...{ isPercentage }}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Currency
            title={formatMessage(ComissionSettingMessages.minCommission)}
            name="minCommissionPrice"
            formRules={{
              required: false,
              validate: (value) => {
                return (
                  !value ||
                  !getValues('maxCommissionPrice') ||
                  value < getValues('maxCommissionPrice')! ||
                  formatMessage(ComissionSettingMessages.minimumCommissionAmountNotValid)
                )
              },
            }}
            isDisable={getValues('calculationType') === CommissionCalculationMethod.FixedValue}
            isPercentage={false}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Currency
            title={formatMessage(ComissionSettingMessages.maxCommission)}
            name="maxCommissionPrice"
            isDisable={getValues('calculationType') === CommissionCalculationMethod.FixedValue}
            isPercentage={false}
            formRules={{
              required: false,
              validate: (value) => {
                return (
                  value > getValues('minCommissionPrice')! ||
                  !value ||
                  formatMessage(ComissionSettingMessages.maximumCommissionAmountNotValid)
                )
              },
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <HBTextFieldController
            type="number"
            fullWidth
            formRules={{
              required: true,
            }}
            label={formatMessage(ComissionSettingMessages.settlementDaysNumber)}
            name="settlementDays"
            maskOptions={{ mask: Number, min: 0, max: 365, maxLength: 3, scale: 0 }}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Box display="flex" alignItems="center" height="100%">
            <Typography mr={4}>
              {formatMessage(ComissionSettingMessages.isOriginalPriceUsedForCommission)}
            </Typography>
            <HBSwitchController
              name="isOriginalPriceUsedForCommission"
              disabled={watch('commissionType') != CommissionType.Seller}
            />
          </Box>
        </Grid>
        <Grid item xs={12} sm={6} md={6}>
          <Box display="flex" alignItems="center" height="100%">
            <Typography mr={4}>
              {formatMessage(ComissionSettingMessages.isVatDeductedFromCommission)}
            </Typography>
            <HBSwitchController
              name="isVatDeductedFromCommission"
              disabled={watch('commissionType') != CommissionType.Seller}
            />
          </Box>
        </Grid>
        <Grid item xs={12} sm={12} md={12}>
          <HBTextFieldController
            formRules={{ required: false }}
            label={formatMessage(ComissionSettingMessages.description)}
            name="description"
            multiline
            rows={4}
            maxRows={6}
          />
        </Grid>
      </Grid>
      <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between">
        <HBButton variant="outlined" onClick={handleGoBack}>
          {formatMessage(phrasesMessages.back)}
        </HBButton>
        <HBButton
          ref={ref}
          type="submit"
          // disabled={!isValid && !isDirty}
          disabled={id ? isValid && !isDirty : !isValid}
          sx={{
            [`&.${buttonClasses.disabled}`]: {
              bgcolor: 'primary.main',
              opacity: '0.3',
              color: 'background.paper',
            },
          }}
        >
          {formatMessage(phrasesMessages.save)}
        </HBButton>
      </Stack>
      <HBDialog
        title={formatMessage(phrasesMessages.saveSuccess)}
        content={formatMessage(phrasesMessages.dialogConfirmationContent)}
        onAccept={handleSave}
        onReject={handleCancel}
        open={openConfirmModal}
        onClose={() => setOpenConfirmModal(false)}
        acceptBtn={formatMessage(phrasesMessages.yes)}
        rejectBtn={formatMessage(phrasesMessages.no)}
      />
    </Stack>
  )
}

export default CommissionAddEditForm
