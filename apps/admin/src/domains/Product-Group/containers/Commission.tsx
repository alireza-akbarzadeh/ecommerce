import { CommissionCalculationMethod as commissionCalculationMethod } from '@hasty-bazar/admin-shared/core/enums'
import {
  GetCategoriesQueryResult,
  GetCategoryQueryResult,
} from '@hasty-bazar/admin-shared/services/catalogApi.generated'
import { HBClassesType, HBForm } from '@hasty-bazar/core'
import { Grid } from '@mui/material'
import { useRouter } from 'next/router'
import { ReactNode, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useIntl } from 'react-intl'
import productGroupMessages from '../ProductGroup.messages'
import ProductGroupPageMessages from '../ProductGroupPage.messages'
import {
  Actions,
  CommissionCalculationMethod,
  CommissionDescription,
  CommissionMaximum,
  CommissionNumberOfSettlementDays,
  CommissionTargetValue,
} from './Commision'
import CommissionMinimum from './Commision/CommissionMinimum'

type HBPageClassNames = 'selectComponentWidth' | 'gridSection' | 'mainGrid'

const classes: HBClassesType<HBPageClassNames> = {
  selectComponentWidth: { width: '100%' },
  gridSection: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 3,
  },
  mainGrid: {
    mb: 10,
  },
}

export type SelectDataType = {
  title: ReactNode
  value: string | number
  iconPath?: string | undefined
}

type PropsType = {
  refetchData: () => void
  data: GetCategoryQueryResult
  isAllocatableToProduct: boolean | undefined
}

const Commission = (props: PropsType) => {
  const { formatMessage } = useIntl()
  const { refetchData, data, isAllocatableToProduct } = props

  const { query: { slug: [action] = [] } = {} } = useRouter()
  const isDisabled = !action ? true : false
  const [isEditMode, setIsEditMode] = useState(!!data?.commissionCalculationType)
  const catalogId = data.id
  const commissionFormProvider = useForm<GetCategoriesQueryResult>({ mode: 'all' })
  const [fixedMode, setFixedMode] = useState(false)

  type CalculationTypeData = {
    title: string
    value: commissionCalculationMethod.FixedValue | commissionCalculationMethod.Percentage
  }

  const calculationTypeData: CalculationTypeData[] = [
    { title: formatMessage(productGroupMessages.percentage), value: 1039001 },
    { title: formatMessage(productGroupMessages.fixed), value: 1039002 },
  ]

  const handleChangeCalculationMethod = (_: any, v: any) => {
    if (v?.value === commissionCalculationMethod.FixedValue) {
      setFixedMode(true)
    } else {
      setFixedMode(false)
    }
    commissionFormProvider.reset({
      commissionCalculationType: v,
      commissionDescription: undefined,
      minimumCommission: undefined,
      maximumCommission: undefined,
      commissionSettlementDays: undefined,
      commissionTargetValue: undefined,
    })
  }

  useEffect(() => {
    if (data) {
      setIsEditMode(!!data.commissionCalculationType)
      const commissionCalculationType = calculationTypeData.find(
        (x) => x.value === data.commissionCalculationType,
      )
      commissionFormProvider.reset({
        //@ts-ignore
        commissionCalculationType: commissionCalculationType ?? undefined,
        commissionDescription: data.commissionDescription ?? undefined,
        minimumCommission: data.minimumCommission ?? undefined,
        maximumCommission: data.maximumCommission ?? undefined,
        commissionSettlementDays: data.commissionSettlementDays ?? undefined,
        commissionTargetValue: data.commissionTargetValue ?? undefined,
      })
    }
  }, [data])

  if (!data.commissionCalculationType && !isAllocatableToProduct) return null

  const commissionCalculationType: any = commissionFormProvider.getValues(
    'commissionCalculationType',
  )
  const targetValidation =
    Number(commissionCalculationType?.value) === commissionCalculationMethod.Percentage
      ? {
          value: 100,
          message: formatMessage(ProductGroupPageMessages.commissionTargetValueMax),
        }
      : {
          value: 999999999999999,
          message: formatMessage(ProductGroupPageMessages.commissionTargetValueMax),
        }

  return (
    <HBForm<GetCategoriesQueryResult>
      formProviderProps={commissionFormProvider}
      onSubmit={() => {}}
      mode="all"
    >
      <Grid container spacing={10} sx={classes.mainGrid}>
        <Actions
          catalogId={catalogId}
          commissionFormProvider={commissionFormProvider}
          setIsEditMode={setIsEditMode}
          isEditMode={isEditMode}
          refetchData={refetchData}
        />
        <Grid item xs={12} sm={4} sx={classes.gridSection}>
          <CommissionCalculationMethod
            disabled={isDisabled}
            data={calculationTypeData}
            onChange={handleChangeCalculationMethod}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <CommissionTargetValue disabled={isDisabled} max={targetValidation} />
        </Grid>
        <Grid item xs={12} sm={4}>
          <CommissionNumberOfSettlementDays disabled={isDisabled} />
        </Grid>
        <Grid item xs={12} sm={4}>
          <CommissionMinimum disabled={isDisabled || fixedMode} />
        </Grid>
        <Grid item xs={12} sm={4}>
          <CommissionMaximum disabled={isDisabled || fixedMode} />
        </Grid>
        <Grid item xs={12} sm={12}>
          <CommissionDescription disabled={isDisabled} />
        </Grid>
      </Grid>
    </HBForm>
  )
}

export default Commission
