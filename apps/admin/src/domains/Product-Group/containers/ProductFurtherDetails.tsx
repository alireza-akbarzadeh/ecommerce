import { HBSwitchController } from '@hasty-bazar/admin-shared/containers/HBSwitchController'
import { BusinessTypeEnums } from '@hasty-bazar/admin-shared/core/enums'
import { HBClassesType } from '@hasty-bazar/core'
import { Grid, Typography } from '@mui/material'
import { useRouter } from 'next/router'
import { ReactNode, useEffect, useState } from 'react'
import { useFormContext, useWatch } from 'react-hook-form'
import { useIntl } from 'react-intl'
import { MultiSelectDataType } from '../components/HBMultiSelectController'
import productGroupPageMessages from '../ProductGroupPage.messages'
import { IProductGroupsFormTypes } from '../types'
import {
  CategoryAcception,
  CommissionLaw,
  DisplayExtractTypeCode,
  DisplayOrderTypeCode2,
  FilterCollectionId,
  IsAddable,
  IsApprovedRequired,
  ReturnLaw,
  ScreenDisplay,
  SellerLimitationTypeCode,
  useProductFurtherDetailsControls,
} from './ProductFurtherDetailsControls'
import CreateProductStartSubject from './ProductFurtherDetailsControls/CreateProductStartSubject'

type HBPageClassNames = 'selectComponentWidth' | 'gridSection' | 'mainGrid'

const classes: HBClassesType<HBPageClassNames> = {
  selectComponentWidth: { width: '100%' },
  gridSection: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 3 },
  mainGrid: {
    mb: 10,
  },
}

export type SelectDataType = {
  title: ReactNode
  value: string | number
  iconPath?: string | undefined
}

const ProductFurtherDetails = () => {
  const { query: { slug: [action, id] = [] } = {} } = useRouter()
  const addingCategory = action === 'add'
  const isDisabled = !action ? true : false
  const [acceptableProductConditionItems, setAcceptableProductConditionItems] = useState<
    SelectDataType[]
  >([])
  const { formatMessage } = useIntl()
  const { control, getValues } = useFormContext<IProductGroupsFormTypes>()
  const { isAllocatableToProduct, screenDisplayId, displayExtractTypeCode } = useWatch({
    control,
  })

  const {
    businessTypeCodeData,
    commissionLawsItems,
    returnLawsItems,
    screenDisplayItems,
    getBusinessTypes,
    acceptableProductConditionOnChange,
    refetchAll,
    categoryAcceptionsItemsLoading,
    getEnumItems,
    collectionItems,
    categoryAcceptionsDataItems,
  } = useProductFurtherDetailsControls({ id })

  useEffect(() => {
    setAcceptableProductConditionItems(
      getBusinessTypes(businessTypeCodeData, BusinessTypeEnums.AcceptableProductCondition, false),
    )
  }, [businessTypeCodeData])

  useEffect(() => {
    refetchAll()
  }, [])

  return (
    <Grid container spacing={10} sx={classes.mainGrid}>
      <Grid item xs={12} sm={6} sx={classes.gridSection}>
        <Typography>{formatMessage(productGroupPageMessages.priceFilter)}</Typography>
        <HBSwitchController
          name={'hasPriceFilter'}
          disabled={addingCategory || !getValues('isAllocatableToProduct') || isDisabled}
        />
      </Grid>
      <Grid item xs={12} sm={6} sx={classes.gridSection}>
        <Typography>{formatMessage(productGroupPageMessages.showStandardProduct)}</Typography>
        <HBSwitchController
          name={'displayJustStandard'}
          disabled={addingCategory || !getValues('isAllocatableToProduct') || isDisabled}
        />
      </Grid>

      <Grid item xs={12} sm={6} sx={classes.gridSection}>
        <IsApprovedRequired
          disabled={addingCategory || !getValues('isAllocatableToProduct') || isDisabled}
        />
      </Grid>

      <Grid item xs={12} sm={6} sx={classes.gridSection}>
        <SellerLimitationTypeCode
          data={getEnumItems(BusinessTypeEnums.SelectionLimitationType)}
          disabled={addingCategory || !getValues('isAllocatableToProduct' || isDisabled)}
        />
      </Grid>
      <Grid item xs={12} sm={6} sx={classes.gridSection}>
        <IsAddable
          disabled={addingCategory || !getValues('isAllocatableToProduct') || isDisabled}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        {!categoryAcceptionsItemsLoading && (
          <CategoryAcception
            data={acceptableProductConditionItems as MultiSelectDataType[]}
            disabled={addingCategory || !getValues('isAllocatableToProduct') || isDisabled}
            //@ts-ignore
            onChange={acceptableProductConditionOnChange}
            selectedData={categoryAcceptionsDataItems}
          />
        )}
      </Grid>
      <Grid item xs={12} sm={6} sx={classes.gridSection}>
        <Typography>{formatMessage(productGroupPageMessages.madeSeries)}</Typography>
        <HBSwitchController
          name={'hasProductionSerialNumber'}
          disabled={addingCategory || !getValues('isAllocatableToProduct') || isDisabled}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <DisplayOrderTypeCode2
          disabled={addingCategory || !getValues('isAllocatableToProduct') || isDisabled}
          data={getEnumItems(BusinessTypeEnums.SortOrderType)}
        />
      </Grid>
      <Grid item xs={12} sm={6} sx={classes.gridSection}>
        <Typography>{formatMessage(productGroupPageMessages.expireDate)}</Typography>
        <HBSwitchController
          name={'hasExpirationDate'}
          disabled={addingCategory || !getValues('isAllocatableToProduct') || isDisabled}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <CreateProductStartSubject
          disabled={addingCategory || isDisabled || !isAllocatableToProduct}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <CommissionLaw
          disabled={addingCategory || !getValues('isAllocatableToProduct') || isDisabled}
          data={commissionLawsItems}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <ReturnLaw
          disabled={addingCategory || !getValues('isAllocatableToProduct') || isDisabled}
          data={returnLawsItems}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <DisplayExtractTypeCode
          disabled={addingCategory || isDisabled}
          data={getBusinessTypes(businessTypeCodeData, BusinessTypeEnums.DisplayExtractType)}
        />
      </Grid>
      {displayExtractTypeCode &&
        (displayExtractTypeCode?.value == '1030001' || displayExtractTypeCode == '1030001') && (
          <Grid item xs={12} sm={6}>
            <ScreenDisplay
              disabled={displayExtractTypeCode?.value != '1030001'}
              data={screenDisplayItems || []}
            />
          </Grid>
        )}
      {displayExtractTypeCode &&
        (displayExtractTypeCode?.value == '1030002' || displayExtractTypeCode == '1030002') && (
          <Grid item xs={12} sm={6}>
            <FilterCollectionId
              disabled={displayExtractTypeCode?.value != '1030002'}
              data={collectionItems || []}
            />
          </Grid>
        )}
    </Grid>
  )
}

export default ProductFurtherDetails
