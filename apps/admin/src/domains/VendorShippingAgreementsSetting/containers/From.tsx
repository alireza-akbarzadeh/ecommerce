import { ContractType, PriceCoverageType, ShippingType } from '@hasty-bazar/admin-shared/core/enums'
import phrasesMessages from '@hasty-bazar-admin/core/translations/phrases.messages'
import { HBButton, HBDialog } from '@hasty-bazar/core'
import { Box, buttonClasses, Grid, useTheme } from '@mui/material'
import { useRouter } from 'next/router'
import { FC, useEffect, useRef, useState } from 'react'
import { useFormContext, useWatch } from 'react-hook-form'
import { useIntl } from 'react-intl'
import FormHeader from '../components/FormHeader'
import { classes } from '../formConfig'
import { refetchMethodModel } from '../types'
import VendorShippingAgrrementsMessages from '../VendorShippingAgreements.message'
import FormFields from './FormFields'

const Form: FC<refetchMethodModel> = ({ refetch }) => {
  const [openConfirmModal, setOpenConfirmModal] = useState(false)
  const { formatMessage } = useIntl()
  const { breakpoints } = useTheme()
  const router = useRouter()
  const id = router.query.id?.[0]
  const ref = useRef<HTMLButtonElement>(null)
  const {
    formState: { isValid, isDirty },
    setValue,
    control,
  } = useFormContext()

  const { contractType, costCoverageType, shippingObligationType, categoryId } = useWatch({
    control,
  })

  useEffect(() => {
    const resetProduct = contractType?.toString() !== ContractType.Product
    const resetProductCategory = contractType?.toString() === ContractType.ProductCategory
    const resetPurchaseAmount = contractType?.toString() === ContractType.MinPurchasePrice

    if (resetProductCategory) {
      setValue('productId', null)
      setValue('minPurchaseAmount', null)
    }
    if (resetProduct) {
      setValue('minPurchaseAmount', null)
    }
    if (resetPurchaseAmount) {
      setValue('productId', null)
    }
    if (!resetProductCategory) {
      setValue('categoryId', null)
    }
  }, [contractType])

  useEffect(() => {
    const isShippingObligationTypePlatform =
      shippingObligationType?.toString() === ShippingType.ByPlatform
    if (isShippingObligationTypePlatform) {
      setValue('shippingCostInElseWhere', '')
      setValue('shippingCostInOrigin', '')
    }
  }, [shippingObligationType])

  useEffect(() => {
    const isCostCoverageTypeAll = costCoverageType?.toString() === PriceCoverageType.All
    if (isCostCoverageTypeAll) {
      setValue('coverageAmount', '')
    }
  }, [costCoverageType])

  const handleGoBack = () => {
    if (isDirty) {
      setOpenConfirmModal(true)
    } else {
      router.replace('/vendorShippingAgreementSetting')
    }
  }

  const handleSave = () => {
    if (isValid) {
      ref.current?.click()
      router.replace('/vendorShippingAgreementSetting')
    }
    setOpenConfirmModal(false)
  }

  const handleCancel = () => {
    setOpenConfirmModal(false)
    router.replace('/vendorShippingAgreementSetting')
  }

  return (
    <>
      <Box>
        <Grid container spacing={6}>
          <Grid container item xs={12} sm={12} sx={classes.gridSection}>
            <FormHeader id={id} refetch={refetch} />
            <FormFields />
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
        title={formatMessage(VendorShippingAgrrementsMessages.save)}
        content={formatMessage(VendorShippingAgrrementsMessages.wouldYouLikeToSaveTheChanges)}
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
