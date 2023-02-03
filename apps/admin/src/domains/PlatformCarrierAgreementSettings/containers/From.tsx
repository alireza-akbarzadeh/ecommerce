import HBDatePickerController from '@hasty-bazar/admin-shared/containers/HBDatePickerController'
import HBSelectController from '@hasty-bazar/admin-shared/containers/HBSelectController'
import HBSelectMultiColumnController from '@hasty-bazar/admin-shared/containers/HBSelectMultiColumnController'
import { HBSwitchController } from '@hasty-bazar/admin-shared/containers/HBSwitchController'
import HBTextFieldController from '@hasty-bazar/admin-shared/containers/HBTextFieldController'
import { platformCostCoverageType, ProviderType } from '@hasty-bazar/admin-shared/core/enums'
import validationsMessages from '@hasty-bazar-admin/core/translations/validations.messages'
import phrasesMessages from '@hasty-bazar-admin/core/translations/phrases.messages'
import {
  GetAllShippingProvidersQueryResult,
  useGetAdminSaleApiShippingProvidersQuery,
} from '@hasty-bazar/admin-shared/services/saleApi.generated'
import { HBButton, HBDialog, HBSelectProps } from '@hasty-bazar/core'
import { Box, buttonClasses, Grid, Typography, useTheme } from '@mui/material'
import { useRouter } from 'next/router'
import { FC, useEffect, useRef, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { useIntl } from 'react-intl'
import Currency from '../components/Currency'
import FormHeader from '../components/FormHeader'
import { classes } from '../formConfig'
import useFormFields from '../hooks/useFormFields'
import PlatformCarrierAgrrementsMessages from '../PlatformCarrierAgreementSettings.message'
import ContractDetails from './ContractDetails'

export type SelectBoxOptionsType = HBSelectProps['menuItem']

interface RefetchMethodModel {
  refetch: () => void
  activeConfirmButton: boolean
}
const Form: FC<RefetchMethodModel> = ({ refetch, activeConfirmButton }) => {
  const [openConfirmModal, setOpenConfirmModal] = useState(false)
  const [isPercentage, setIsPercentage] = useState(false)
  const { formatMessage } = useIntl()
  const { breakpoints } = useTheme()
  const router = useRouter()
  const id = router.query.id?.[0]
  const ref = useRef<HTMLButtonElement>(null)
  const { agentColumn, carrierColumn } = useFormFields()
  const [agentsSearchText, setAgentsSearchText] = useState<string>()
  const [agentsPage, setAgentsPage] = useState(1)
  const [agentsData, setAgentsData] = useState<GetAllShippingProvidersQueryResult[]>([])
  const [carriersSearchText, setCarriersSearchText] = useState<string>()
  const [carriersPage, setCarriersPage] = useState(1)
  const [carriersData, setCarriersData] = useState<GetAllShippingProvidersQueryResult[]>([])
  const {
    formState: { isValid, isDirty },
    setValue,
    watch,
  } = useFormContext()

  const { data: agents, refetch: refetchAgents } = useGetAdminSaleApiShippingProvidersQuery({
    'client-name': 'Swagger on HIT.Hastim.IDR.Endpoints.AdminApi',
    'client-version': '1.0.1.100',
    pageNumber: agentsPage,
    pageSize: 20,
    providerName: agentsSearchText,
    providerType: ProviderType.Agent,
    providerShippingState: 2,
    filter:
      'ProviderName.Contains(@ProviderName) && ProviderShippingState==@ProviderShippingState && ProviderType==@ProviderType ',
  })

  useEffect(() => {
    agents?.data?.items && setAgentsData((prev) => [...prev, ...agents?.data?.items!])
  }, [agents?.data?.items])

  const { data: carriers, refetch: refetchCarriers } = useGetAdminSaleApiShippingProvidersQuery({
    'client-name': 'Swagger on HIT.Hastim.IDR.Endpoints.AdminApi',
    'client-version': '1.0.1.100',
    pageNumber: carriersPage,
    pageSize: 20,
    providerName: carriersSearchText,
    providerType: ProviderType.Carrier,
    providerShippingState: 2,
    filter:
      'ProviderName.Contains(@ProviderName) && ProviderShippingState==@ProviderShippingState && ProviderType==@ProviderType ',
  })

  useEffect(() => {
    carriers?.data?.items && setCarriersData((prev) => [...prev, ...carriers?.data?.items!])
  }, [carriers?.data?.items])

  useEffect(() => {
    if (isDirty) {
      setValue('costCoverageAmount', '')
      setValue('maxCostCoveragePrice', '')
    }
  }, [watch('costCoverageType')])

  const handleGoBack = () => {
    if (isDirty) {
      setOpenConfirmModal(true)
    } else {
      router.replace('/PlatformCarrierAgreementSettings')
    }
  }

  const handleSave = () => {
    if (isValid) {
      ref.current?.click()
      router.replace('/PlatformCarrierAgreementSettings')
    }
    setOpenConfirmModal(false)
  }

  const handleCancel = () => {
    setOpenConfirmModal(false)
    router.replace('/PlatformCarrierAgreementSettings')
  }

  const handleChang = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue('costCoverageType', e.target.value)
    setValue('costCoverageAmount', 0)
    e.target.value === platformCostCoverageType.FixedPrice && setValue('maxCostCoveragePrice', '')
    if (e.target.value === platformCostCoverageType.Percent) {
      setIsPercentage(true)
    } else {
      setIsPercentage(false)
    }
  }

  return (
    <>
      <Box>
        <Grid container spacing={6} mb={10}>
          <Grid container item xs={12} sm={12} sx={classes.gridSection} mt={6}>
            <FormHeader id={id} refetch={refetch} />
            <Grid container spacing={6} mt={6}>
              <Grid item xs={12} sm={4}>
                <HBTextFieldController
                  formRules={{ required: false }}
                  disabled={true}
                  label={formatMessage(PlatformCarrierAgrrementsMessages.code)}
                  name="contractCode"
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <HBDatePickerController
                  formRules={{
                    required: true,
                    validate: (value) => {
                      return (
                        !value ||
                        !!Date.parse(value) ||
                        `${formatMessage(validationsMessages.invalidDate)}`
                      )
                    },
                  }}
                  label={`${formatMessage(PlatformCarrierAgrrementsMessages.startDate)}*`}
                  name="startDate"
                  defaultValue={new Date()}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <HBDatePickerController
                  formRules={{
                    validate: (value) => {
                      return (
                        !value ||
                        !!Date.parse(value) ||
                        `${formatMessage(validationsMessages.invalidDate)}`
                      )
                    },
                  }}
                  label={formatMessage(PlatformCarrierAgrrementsMessages.endDate)}
                  name="endDate"
                  minDateTime={new Date(watch('startDate')!)}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <HBSelectMultiColumnController
                  formRules={{ required: false }}
                  name="shippingAgents"
                  label={formatMessage(PlatformCarrierAgrrementsMessages.deliveryTypesName).replace(
                    ':',
                    ' ',
                  )}
                  items={agentsData}
                  onInputChange={(_, searchValue) => {
                    setAgentsData([])
                    setAgentsSearchText(searchValue)
                    setAgentsPage(1)
                    refetchAgents()
                  }}
                  size="small"
                  columnDefs={agentColumn}
                  pageSize={20}
                  totalItems={agents?.data?.totalItems!}
                  loadNextPage={() => {
                    setAgentsPage(agentsPage + 1)
                  }}
                  isOptionEqualToValue={(option, _value) => option.id === _value.id}
                  autoComplete={false}
                  multiple
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <HBSelectMultiColumnController
                  formRules={{ required: false }}
                  label={formatMessage(PlatformCarrierAgrrementsMessages.carrier)}
                  name="shippingProviders"
                  items={carriersData}
                  onInputChange={(_, searchValue) => {
                    setCarriersData([])
                    setCarriersSearchText(searchValue)
                    setCarriersPage(1)
                    refetchCarriers()
                  }}
                  size="small"
                  columnDefs={carrierColumn}
                  pageSize={20}
                  totalItems={carriers?.data?.totalItems!}
                  loadNextPage={() => {
                    setCarriersPage(carriersPage + 1)
                  }}
                  isOptionEqualToValue={(option, _value) => option.id === _value.id}
                  multiple
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <Box sx={classes.switchMainContainer}>
                  <Typography>
                    {formatMessage(PlatformCarrierAgrrementsMessages.ApplyOnException)}
                  </Typography>
                  <HBSwitchController name="applyOnlyOnException" disabled={false} />
                </Box>
              </Grid>
              <Grid item xs={12} sm={4}>
                <HBSelectController
                  formRules={{ required: true }}
                  inputLabelProps={{ required: true }}
                  fullWidth
                  label={formatMessage(
                    PlatformCarrierAgrrementsMessages.platformCostCoverageTypeTitle,
                  )}
                  name="costCoverageType"
                  menuItem={
                    Object.keys(platformCostCoverageType)?.map(
                      (value: keyof typeof platformCostCoverageType) => ({
                        value: platformCostCoverageType[value],
                        title: formatMessage(PlatformCarrierAgrrementsMessages[value]),
                      }),
                    ) || []
                  }
                  onChange={handleChang}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <Currency
                  title={
                    watch('costCoverageType')?.toString() === platformCostCoverageType.FixedPrice
                      ? formatMessage(PlatformCarrierAgrrementsMessages.PlatformPaidAmount)
                      : formatMessage(PlatformCarrierAgrrementsMessages.PlatformPaidPercent)
                  }
                  name="costCoverageAmount"
                  isRequired
                  {...{ isPercentage }}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <Currency
                  title={formatMessage(PlatformCarrierAgrrementsMessages.maximumAmount)}
                  name="maxCostCoveragePrice"
                  isRequired={false}
                  isDisable={
                    watch('costCoverageType')?.toString() === platformCostCoverageType.FixedPrice
                  }
                  isPercentage={false}
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
        title={formatMessage(PlatformCarrierAgrrementsMessages.save)}
        content={formatMessage(PlatformCarrierAgrrementsMessages.wouldYouLikeToSaveTheChanges)}
        onAccept={handleSave}
        onReject={handleCancel}
        open={openConfirmModal}
        onClose={() => setOpenConfirmModal(false)}
        acceptBtn={formatMessage(phrasesMessages.yes)}
        rejectBtn={formatMessage(phrasesMessages.no)}
      />
      {activeConfirmButton && <ContractDetails />}
    </>
  )
}
export default Form
