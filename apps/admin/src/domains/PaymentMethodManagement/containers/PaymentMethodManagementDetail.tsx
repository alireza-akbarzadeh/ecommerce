import HBSelectMultiColumnController from '@hasty-bazar/admin-shared/containers/HBSelectMultiColumnController'
import { HBSwitchController } from '@hasty-bazar/admin-shared/containers/HBSwitchController'
import HBTextFieldController from '@hasty-bazar/admin-shared/containers/HBTextFieldController'
import { PaymentMethodType } from '@hasty-bazar/admin-shared/core/enums'
import instance from '@hasty-bazar/admin-shared/core/handler'
import { useGetAdminCatalogProductRulesQuery } from '@hasty-bazar/admin-shared/services/catalogApi.generated'
import { useGetAdminGeneralDataBankQuery } from '@hasty-bazar/admin-shared/services/generalDataApi.generated'
import { HBSelectController } from '@hasty-bazar/auth'
import { HBClassesType, HBIcon, HBSelectProps, HBToolTip } from '@hasty-bazar/core'
import { Avatar, Box, FormHelperText, Grid, IconButton, Typography, useTheme } from '@mui/material'
import { camelCase } from 'lodash'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { useFormContext, useWatch } from 'react-hook-form'
import { FormattedMessage, useIntl } from 'react-intl'
import { useGetAdminPaymentPaymentProviderByIdQuery } from '../paymentApi.enhanced'
import paymentMethodManagementPageMessages from '../PaymentMethodManagementPage.messages'
import { PaymentMethodManagementFormModel } from './MainContentExplanation'

type HBPageClassNames =
  | 'selectComponentWidth'
  | 'gridSection'
  | 'numberOfActiveConcurrentRulesLimit'
const classes: HBClassesType<HBPageClassNames> = {
  selectComponentWidth: { width: '100%' },
  gridSection: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 3 },
  numberOfActiveConcurrentRulesLimit: {
    display: 'flex',
    alignItems: 'center',
    gap: 4,
  },
}

enum ProviderTypeEnum {
  None = 1107001,
  Sep,
  HitWallet,
  TaraWallet,
}

const providerTypes = [
  {
    title: <FormattedMessage {...paymentMethodManagementPageMessages.sep} />,
    value: ProviderTypeEnum.Sep,
  },
  {
    title: <FormattedMessage {...paymentMethodManagementPageMessages.hitWallet} />,
    value: ProviderTypeEnum.HitWallet,
  },
  {
    title: <FormattedMessage {...paymentMethodManagementPageMessages.tarawallet} />,
    value: ProviderTypeEnum.TaraWallet,
  },
]

export type SelectBoxOptionsType = HBSelectProps['menuItem']
export default function ProcessPage() {
  const { formatMessage } = useIntl()
  const router = useRouter()
  const { spacing } = useTheme()
  const id = router.query.id?.[0]
  const paymentMethodIdParam = router.query?.paymentMethodId as string
  const { reset, setValue, control, getValues } = useFormContext<PaymentMethodManagementFormModel>()
  const formData = useWatch({
    control,
  })
  const { icon, name } = formData
  const paymentMethodId = id ? getValues('paymentMethodId') : paymentMethodIdParam
  const { data: { data: { items: productRulesData = [] } = {} } = {} } =
    useGetAdminCatalogProductRulesQuery({
      'client-name': 'wagger on HIT.Hastim.Catalog.Endpoints.AdminApi',
      'client-version': '1.0.1.100',
      pageSize: 1000,
    })

  const { data: { data: { items: bankData = [] } = {} } = {} } = useGetAdminGeneralDataBankQuery({
    'client-name': 'wagger on HIT.Hastim.GeneralData.Endpoints.AdminApi',
    'client-version': '1.0.1.100',
    pageSize: 1000,
  })

  const { data: paymentProviderData } = useGetAdminPaymentPaymentProviderByIdQuery(
    {
      'client-name': 'Swagger on HIT.Hastim.GeneralData.Endpoints.WebApi',
      'client-version': '1.0.1.100',
      id: id!,
    },
    { skip: !id },
  )

  useEffect(() => {
    if (id && paymentProviderData?.data) {
      const { paymentMethodId, ruleId, sortOrderIndex, ...otherData } = paymentProviderData?.data!
      reset({
        ...otherData,
        paymentMethodId: paymentMethodId!,
        sortOrderIndex: sortOrderIndex ? sortOrderIndex : undefined,
        title: formatMessage(
          // @ts-ignore
          paymentMethodManagementPageMessages[
            // @ts-ignore
            camelCase(PaymentMethodType[paymentMethodId])
          ],
        ),
        ruleId: ruleId ? (productRulesData?.filter((item) => item.id === ruleId)[0] as any) : null,
      })
    }

    if (!id && paymentMethodId) {
      reset({
        title: formatMessage(
          // @ts-ignore
          paymentMethodManagementPageMessages[
            // @ts-ignore
            camelCase(PaymentMethodType[paymentMethodId])
          ],
        ),
      })
    }
  }, [paymentProviderData?.data, productRulesData])

  const handleIconChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
    change: (url: string) => void,
  ) => {
    const file = event.target.files
    if (file) {
      try {
        const formData = new FormData()
        formData.append('file', file[0])
        instance
          .post(`${process.env.NEXT_PUBLIC_GATEWAY}/Admin/CMS/Files`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
              'client-name': 'Swagger on HIT.Hastim.FileServer.Endpoints.WebApi',
              'client-version': '1.0.1.100',
              Accept: '*/*',
            },
          })
          .then((res: any) => {
            const {
              data: {
                data: { path: path },
              },
            } = res
            change(path as string)
          })
      } catch (error) {
        return ''
      }
    }
  }

  const ruleColumns = [
    {
      field: 'name',
      width: 150,
      headerName: formatMessage(paymentMethodManagementPageMessages.name),
      showInChip: true,
    },
    {
      field: 'description',
      width: 300,
      headerName: formatMessage(paymentMethodManagementPageMessages.description),
      showInChip: false,
    },
    { field: 'id', width: 110, headerName: 'id', hidden: true, isIdField: true },
  ]

  return (
    <Box display="flex" justifyContent="space-between">
      <Grid container spacing={spacing(6)}>
        <Grid container item xs={12} sm={12} sx={classes.gridSection}>
          <Box display="flex" gap={1} sx={{ height: 30 }}>
            <HBIcon type="coins" />
            <Typography variant="h4" mb={8} color="text.primary">
              {formatMessage(paymentMethodManagementPageMessages.paymentMethodManagement)}
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12} sm={12} md={12}>
          <HBTextFieldController
            formRules={{
              required: false,
            }}
            name={'title'}
            label={
              // @ts-ignore
              Object.values(PaymentMethodType).includes(PaymentMethodType[paymentMethodId])
                ? formatMessage(
                    // @ts-ignore
                    paymentMethodManagementPageMessages[
                      // @ts-ignore
                      camelCase(PaymentMethodType[paymentMethodId])
                    ],
                  )
                : ''
            }
            disabled
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <HBTextFieldController
            name={'name'}
            fullWidth
            inputProps={{ maxLength: 80 }}
            formRules={{
              required: true,
              validate: (value) => {
                return (
                  !!value.trim() || formatMessage(paymentMethodManagementPageMessages.isRequired)
                )
              },
            }}
            label={formatMessage(paymentMethodManagementPageMessages.paymentGatewayName)}
            InputProps={{
              endAdornment: (
                <HBToolTip
                  placement="bottom-end"
                  title={formatMessage(paymentMethodManagementPageMessages.selectFile)}
                  arrow
                >
                  <IconButton disabled={!paymentMethodId}>
                    <Typography component={'label'} htmlFor="uploadFile">
                      {icon ? (
                        <Avatar
                          sx={{
                            width: 30,
                            height: 30,
                          }}
                          alt="name"
                          src={process.env.NEXT_PUBLIC_CDN + icon}
                        />
                      ) : (
                        <HBIcon
                          sx={{
                            color: 'gray.800',
                          }}
                          size="medium"
                          type={'picture'}
                        />
                      )}
                    </Typography>
                  </IconButton>
                </HBToolTip>
              ),
            }}
            sx={{
              mb: 0,
            }}
            disabled={!paymentMethodId}
          />
          <input
            type="file"
            id="uploadFile"
            accept="image/*"
            hidden
            onChange={(event) =>
              handleIconChange(event, (url) => setValue('icon', url, { shouldDirty: true }))
            }
          />
          {!icon && name?.trim() && (
            <FormHelperText
              sx={(theme) => {
                return {
                  color: 'error.main',
                  fontSize: theme.typography.caption.fontSize,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                }
              }}
            >
              <HBIcon size="small" type="infoCircle" />
              {formatMessage(paymentMethodManagementPageMessages.selectIconIsRequired)}
            </FormHelperText>
          )}
        </Grid>
        <Grid item xs={12} sm={6} md={6}>
          <HBSelectController
            sx={{
              width: {
                md: '100%',
                xs: '100%',
              },
              minWidth: 100,
            }}
            required={paymentMethodId === PaymentMethodType.BankingGateway.toString()}
            formRules={{
              required: paymentMethodId === PaymentMethodType.BankingGateway.toString(),
            }}
            label={formatMessage(paymentMethodManagementPageMessages.bank)}
            name={'bankId' as keyof PaymentMethodManagementFormModel}
            menuItem={
              bankData?.map((item) => ({
                title: String(item.name),
                value: item.id || 0,
              })) || []
            }
            disabled={!paymentMethodId}
          />
        </Grid>
        <Grid item xs={12} sm={12} md={12}>
          <HBSelectController
            sx={{
              width: {
                md: '100%',
                xs: '100%',
              },
              minWidth: 100,
            }}
            formRules={{
              required: false,
            }}
            label={formatMessage(paymentMethodManagementPageMessages.serviceSetting)}
            name={'providerType'}
            menuItem={providerTypes}
            disabled={!paymentMethodId}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={6}>
          <HBSelectMultiColumnController
            name={'ruleId' as keyof PaymentMethodManagementFormModel}
            label={formatMessage(paymentMethodManagementPageMessages.relationRule)}
            items={productRulesData || []}
            columnDefs={ruleColumns}
            pageSize={40}
            totalItems={productRulesData?.length!}
            formRules={{ required: false }}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={6}>
          <HBTextFieldController
            label={formatMessage(paymentMethodManagementPageMessages.sortOrder)}
            name={'sortOrderIndex'}
            formRules={{
              required: false,
            }}
            type="number"
            disabled={!paymentMethodId}
          />
        </Grid>
        <Grid item xs={12}>
          <HBTextFieldController
            label={formatMessage(paymentMethodManagementPageMessages.maximumAmount)}
            name={'maximumAmount'}
            formRules={{
              required: false,
            }}
            type="number"
            disabled={!paymentMethodId}
          />
        </Grid>
        <Grid item xs={12}>
          <Box sx={classes.numberOfActiveConcurrentRulesLimit}>
            <Typography>{formatMessage(paymentMethodManagementPageMessages.status)}</Typography>
            <HBSwitchController name="isActive" disabled={!paymentMethodId} />
            <Typography>{formatMessage(paymentMethodManagementPageMessages.default)}</Typography>
            <HBSwitchController name="isDefault" disabled={!paymentMethodId} />

            <Typography>{formatMessage(paymentMethodManagementPageMessages.visible)}</Typography>
            <HBSwitchController name="isVisible" disabled={!paymentMethodId || !!id} />
          </Box>
        </Grid>
      </Grid>
    </Box>
  )
}
