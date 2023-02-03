import { HBSwitchController } from '@hasty-bazar/admin-shared/containers/HBSwitchController'
import HBTextFieldController from '@hasty-bazar/admin-shared/containers/HBTextFieldController'
import { BusinessTypeEnums } from '@hasty-bazar/admin-shared/core/enums'
import {
  GetBusinessTypeValuesQueryResult,
  useGetAdminGeneralDataBusinessTypeValueGetAllQuery,
} from '@hasty-bazar/admin-shared/services/generalDataApi.generated'
import { HBSelectController } from '@hasty-bazar/auth'
import { HBClassesType, HBIcon, HBIconButton, HBSelectProps } from '@hasty-bazar/core'
import { Box, Grid, Typography, useTheme } from '@mui/material'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { useFormContext } from 'react-hook-form'
import { useIntl } from 'react-intl'
import { useGetAdminGeneralDataProcessesByIdQuery } from '../generalDataApi.enhanced'
import processPageMessages from '../ProcessPage.messages'

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

interface ProcessEditFormType {
  title: string
  description: string
  parameters: string
  platformTypeCode: number
  hasSingleRule: boolean
  processMethodTypeCode: number
}
export type SelectBoxOptionsType = HBSelectProps['menuItem']
export default function ProcessPage() {
  const { formatMessage } = useIntl()
  const router = useRouter()
  const { spacing } = useTheme()
  const id = router.query.id?.[0]
  const {
    formState: { isDirty },
    reset,
  } = useFormContext<ProcessEditFormType>()

  const { data: ProcessData } = useGetAdminGeneralDataProcessesByIdQuery(
    {
      'client-name': 'Swagger on HIT.Hastim.GeneralData.Endpoints.WebApi',
      'client-version': '1.0.1.100',
      id: id!,
    },
    { skip: !id },
  )

  const { data: { data: { items: businessTypeData = [] } = {} } = {}, isLoading } =
    useGetAdminGeneralDataBusinessTypeValueGetAllQuery({
      'client-name': 'generalData',
      'client-version': '0',
      pageSize: 1000,
    })

  const getBusinessTypes = (
    businessTypes: GetBusinessTypeValuesQueryResult[],
    type: BusinessTypeEnums,
  ): SelectBoxOptionsType => {
    return businessTypes
      .filter((item) => item.businessTypeId === type + '')
      .map((item) => ({
        title: String(item.title),
        value: item.id || 0,
      }))
  }

  useEffect(() => {
    if (id && ProcessData?.data) {
      reset({
        ...(ProcessData.data as ProcessEditFormType),
      })
    }

    if (!id) {
      reset({})
    }
  }, [ProcessData?.data])

  return (
    <Box display="flex" justifyContent="space-between">
      <Grid container spacing={spacing(6)}>
        <Grid container item xs={12} sm={12} sx={classes.gridSection}>
          <Box display="flex" gap={1} sx={{ height: 30 }}>
            <HBIcon type="process" />
            <Typography variant="h4" mb={8} color="text.primary">
              {formatMessage(processPageMessages.process)}
            </Typography>
          </Box>
          <Box>
            {id && (
              <HBIconButton
                type="submit"
                icon="check"
                onClick={(e) => e.stopPropagation()}
                disabled={!isDirty}
              />
            )}
          </Box>
        </Grid>
        <Grid item xs={12} sm={12} md={12}>
          <HBTextFieldController
            formRules={{
              required: false,
            }}
            name={'title'}
            label={formatMessage(processPageMessages.processName)}
          />
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
            formRules={{
              required: false,
            }}
            label={formatMessage(processPageMessages.processType)}
            name={'processMethodTypeCode' as keyof ProcessEditFormType}
            menuItem={getBusinessTypes(businessTypeData || [], BusinessTypeEnums.RuleType)}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={6}>
          <Box sx={classes.numberOfActiveConcurrentRulesLimit}>
            <Typography>
              {formatMessage(processPageMessages.numberOfActiveConcurrentRulesLimit)}
            </Typography>
            <HBSwitchController name="hasSingleRule" />
          </Box>
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
            required
            formRules={{
              required: false,
            }}
            label={formatMessage(processPageMessages.platform)}
            name={'platformTypeCode' as keyof ProcessEditFormType}
            menuItem={getBusinessTypes(businessTypeData || [], BusinessTypeEnums.PlatformType)}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={6}>
          <HBTextFieldController
            label={formatMessage(processPageMessages.parameter)}
            name={'parameter'}
            formRules={{
              required: false,
            }}
          />
        </Grid>
        <Grid item xs={12} sm={12} md={12}>
          <HBTextFieldController
            label={formatMessage(processPageMessages.description)}
            name={'description'}
            formRules={{
              required: false,
            }}
            multiline
            rows={5}
          />
        </Grid>
      </Grid>
    </Box>
  )
}
