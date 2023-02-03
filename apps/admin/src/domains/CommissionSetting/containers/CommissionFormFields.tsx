import HBDatePickerController from '@hasty-bazar/admin-shared/containers/HBDatePickerController'
import HBSelectController from '@hasty-bazar/admin-shared/containers/HBSelectController'
import HBSelectMultiColumnController from '@hasty-bazar/admin-shared/containers/HBSelectMultiColumnController'
import HBTextFieldController from '@hasty-bazar/admin-shared/containers/HBTextFieldController'
import { CommissionType } from '@hasty-bazar/admin-shared/core/enums'
import {
  GetAllProductsQueryResult,
  useGetAdminCatalogProductsQuery,
} from '@hasty-bazar/admin-shared/services/catalogApi.generated'
import {
  GetVendorsLookupQueryResult,
  useGetAdminIdrVendorsQuery,
} from '@hasty-bazar/admin-shared/services/idrApi.generated'
import { HBSelectTree } from '@hasty-bazar/core'
import { Grid, SelectChangeEvent } from '@mui/material'
import { useCallback, useEffect, useState } from 'react'
import { Controller, ControllerRenderProps, useFormContext } from 'react-hook-form'
import { useIntl } from 'react-intl'
import ComissionSettingMessages from '../CommissionSetting.message'
import useCommissionFormColumn from '../hooks/useCommissionFormColumn'
import useDataItemsQuery from '../hooks/useDataItemsQuery'
import { CommissionAddEditFormType } from '../types'
import validationsMessages from '@hasty-bazar-admin/core/translations/validations.messages'
const CommissionFormFields = () => {
  const { formatMessage } = useIntl()
  const [vendorSearchText, setVendorSearchText] = useState<string>()
  const [vendorpage, setVendorpage] = useState(1)
  const [vendorsData, setVendorsData] = useState<GetVendorsLookupQueryResult[]>([])
  const [productSearchText, setProductSearchText] = useState<string>()
  const [productsPage, setProductsPage] = useState(1)
  const [productsData, setProductsData] = useState<GetAllProductsQueryResult[]>([])
  const { getValues, watch, control, setValue } = useFormContext<CommissionAddEditFormType>()
  const { brands, commissionType, categories } = useDataItemsQuery()
  const { vendorColumn, productColumn } = useCommissionFormColumn()

  const { data: vendors, refetch: refetchVendors } = useGetAdminIdrVendorsQuery({
    'client-name': 'Swagger on HIT.Hastim.IDR.Endpoints.AdminApi',
    'client-version': '1.0.1.100',
    pageNumber: vendorpage,
    pageSize: 20,
    firstName: vendorSearchText,
    lastName: vendorSearchText,
    mobile: vendorSearchText,
    stateCode: 3,
    filter:
      '(FirstName.Contains(@FirstName) || LastName.Contains(@LastName) || Mobile.Contains(@Mobile)) && StateCode==@StateCode ',
  })

  const { data: products, refetch: refetchProducts } = useGetAdminCatalogProductsQuery({
    'client-name': '',
    'client-version': '',
    pageNumber: 0,
    pageSize: 10000,
    name: productSearchText,
    vendor: productSearchText,
    hsin: productSearchText,
    stateCode: '3',
    filter:
      '(Name.Contains(@Name) || Vendor.Contains(@Vendor) || Hsin.Contains(@Hsin)) && StateCode==@StateCode',
  })

  useEffect(() => {
    vendors?.data?.items && setVendorsData((prev) => [...prev, ...vendors?.data?.items!])
  }, [vendors?.data?.items])

  useEffect(() => {
    products?.data?.items && setProductsData((prev) => [...prev, ...products?.data?.items!])
  }, [products?.data?.items])

  const SelectTreeMemo = useCallback(
    (field: ControllerRenderProps<CommissionAddEditFormType, 'categoryId'>) => {
      return (
        <HBSelectTree
          label={formatMessage(ComissionSettingMessages.productGrouping)}
          value={getValues('categoryId')}
          onChange={(value: string) => {
            setValue('categoryId', value)
          }}
          size="medium"
          sx={{ width: '100%', height: 40, '& > label': { lineHeight: 1 } }}
          renderValueEmptyLabel={''}
          rootParentValue={null}
          data={
            categories?.map((item) => {
              return {
                id: item.id!,
                label: item.name!,
                parentId: item.parentId!,
                value: item.id!,
                isAllocatableToProduct: item.isAllocatableToProduct!,
              }
            }) || []
          }
          onBlur={field.onBlur}
          multiple={false}
          error={
            getValues('commissionType') == CommissionType.ProductCategory &&
            !getValues('categoryId')
          }
        />
      )
    },
    [categories, getValues('categoryId')],
  )

  const handleChange = (event: SelectChangeEvent<unknown>) => {
    setValue('commissionType', event.target.value as number)
    if (event.target.value != CommissionType.Seller) {
      setValue('isOriginalPriceUsedForCommission', false)
      setValue('isVatDeductedFromCommission', false)
    }
  }

  return (
    <>
      <Grid item xs={12} sm={6} md={3}>
        <HBTextFieldController
          formRules={{ required: false }}
          disabled={true}
          label={formatMessage(ComissionSettingMessages.commissionCode)}
          name="number"
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <HBDatePickerController
          formRules={{
            required: true,
            validate: (value) => {
              return (
                !value || !!Date.parse(value) || `${formatMessage(validationsMessages.invalidDate)}`
              )
            },
          }}
          label={`${formatMessage(ComissionSettingMessages.startDate)}*`}
          name="startDate"
          defaultValue={new Date()}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <HBDatePickerController
          formRules={{
            validate: (value) => {
              return (
                !value || !!Date.parse(value) || `${formatMessage(validationsMessages.invalidDate)}`
              )
            },
          }}
          label={formatMessage(ComissionSettingMessages.endDate)}
          name="endDate"
          minDateTime={new Date(watch('startDate'))}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <HBSelectController
          formRules={{ required: true }}
          inputLabelProps={{ required: true }}
          fullWidth
          label={formatMessage(ComissionSettingMessages.typeOfCommissionCalculation)}
          name="commissionType"
          menuItem={commissionType
            ?.filter((item) => item.id !== CommissionType.Combination.toString())
            ?.map((item) => ({ value: item.id!, title: item.title! } || []))}
          onChange={handleChange}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <Controller
          name="categoryId"
          control={control}
          rules={{
            required: watch('commissionType') == CommissionType.ProductCategory,
          }}
          render={({ field }) => {
            return <SelectTreeMemo {...field} />
          }}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <HBSelectMultiColumnController
          name="vendorId"
          label={formatMessage(ComissionSettingMessages.productVendor)}
          items={vendorsData}
          onInputChange={(_, searchValue) => {
            setVendorsData([])
            setVendorSearchText(searchValue)
            setVendorpage(1)
            refetchVendors()
          }}
          size="small"
          columnDefs={vendorColumn}
          pageSize={20}
          totalItems={vendors?.data?.totalItems!}
          loadNextPage={() => {
            setVendorpage(vendorpage + 1)
          }}
          isOptionEqualToValue={(option, _value) => option.id === _value.id}
          formRules={{
            required: getValues('commissionType') == CommissionType.Seller,
          }}
          error={getValues('commissionType') == CommissionType.Seller && !getValues('vendorId')}
          autoComplete={false}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <HBSelectController
          formRules={{
            required: getValues('commissionType') == CommissionType.Brand,
          }}
          inputLabelProps={{ required: getValues('commissionType') == CommissionType.Brand }}
          fullWidth
          label={formatMessage(ComissionSettingMessages.productBrand)}
          name="brandId"
          menuItem={brands?.map((brand) => ({ value: brand?.id!, title: brand.name! })) || []}
          error={watch('commissionType') == CommissionType.Brand && !getValues('brandId')}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <HBSelectMultiColumnController
          name="productId"
          label={formatMessage(ComissionSettingMessages.product)}
          items={productsData}
          onInputChange={(_, searchValue) => {
            setProductsData([])
            setProductSearchText(searchValue)
            setProductsPage(1)
            refetchProducts()
          }}
          size="small"
          columnDefs={productColumn}
          pageSize={20}
          totalItems={products?.data?.totalItems!}
          loadNextPage={() => {
            setProductsPage(productsPage + 1)
          }}
          isOptionEqualToValue={(option, _value) => option.id === _value.id}
          formRules={{
            required: watch('commissionType') == CommissionType.Product,
          }}
          error={getValues('commissionType') == CommissionType.Product && !getValues('productId')}
          autoComplete={false}
        />
      </Grid>
    </>
  )
}

export default CommissionFormFields
