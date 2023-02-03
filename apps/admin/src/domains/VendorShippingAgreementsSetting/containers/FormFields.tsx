import HBDatePickerController from '@hasty-bazar/admin-shared/containers/HBDatePickerController'
import HBSelectController from '@hasty-bazar/admin-shared/containers/HBSelectController'
import HBSelectMultiColumnController from '@hasty-bazar/admin-shared/containers/HBSelectMultiColumnController'
import { ContractType, PriceCoverageType, ShippingType } from '@hasty-bazar/admin-shared/core/enums'
import validationsMessages from '@hasty-bazar-admin/core/translations/validations.messages'
import {
  GetAllProductsQueryResult,
  useGetAdminCatalogProductsQuery,
} from '@hasty-bazar/admin-shared/services/catalogApi.generated'
import {
  GetVendorsLookupQueryResult,
  useGetAdminIdrVendorsQuery,
} from '@hasty-bazar/admin-shared/services/idrApi.generated'
import { HBSelectTree } from '@hasty-bazar/core'
import { Grid } from '@mui/material'
import { useEffect, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { useIntl } from 'react-intl'
import Currency from '../components/Currency'
import useDataItemsQuery from '../hooks/useDataItemsQuery'
import useFormFields from '../hooks/useFormFields'
import VendorShippingAgrrementsMessages from '../VendorShippingAgreements.message'

const FormFields = () => {
  const { categories } = useDataItemsQuery()
  const { formatMessage } = useIntl()
  const [vendorSearchText, setVendorSearchText] = useState<string>()
  const [vendorpage, setVendorpage] = useState(1)
  const [vendorsData, setVendorsData] = useState<GetVendorsLookupQueryResult[]>([])
  const [productSearchText, setProductSearchText] = useState<string>()
  const [productsPage, setProductsPage] = useState(1)
  const [productsData, setProductsData] = useState<GetAllProductsQueryResult[]>([])
  const { getValues, watch, setValue } = useFormContext()
  const { productColumn, vendorColumn } = useFormFields()
  const vendorIdValue = watch('vendorId')?.vendorId

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
    stateCode: '3',
    vendorId: vendorIdValue,
    filter: vendorIdValue
      ? 'Name.Contains(@Name) || Vendor.Contains(@Vendor) && StateCode==@StateCode && VendorId==@VendorId'
      : 'Name.Contains(@Name) || Vendor.Contains(@Vendor) && StateCode==@StateCode',
  })

  useEffect(() => {
    vendors?.data?.items && setVendorsData((prev) => [...prev, ...vendors?.data?.items!])
  }, [vendors?.data?.items])

  useEffect(() => {
    products?.data?.items && setProductsData((prev) => [...prev, ...products?.data?.items!])
  }, [products?.data?.items])

  return (
    <Grid container spacing={6} mt={6}>
      <Grid item xs={12} sm={3}>
        <HBSelectMultiColumnController
          formRules={{ required: true }}
          name="vendorId"
          label={`${formatMessage(VendorShippingAgrrementsMessages.vendorTitle)}*`}
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
          autoComplete={false}
        />
      </Grid>
      <Grid item xs={12} sm={3}>
        <HBSelectController
          formRules={{ required: true }}
          inputLabelProps={{ required: true }}
          fullWidth
          label={formatMessage(VendorShippingAgrrementsMessages.shippingObligationTypeTitle)}
          name="shippingObligationType"
          menuItem={
            Object.keys(ShippingType)?.map((value: keyof typeof ShippingType) => ({
              value: ShippingType[value],
              title: formatMessage(VendorShippingAgrrementsMessages[value]),
            })) || []
          }
        />
      </Grid>
      <Grid item xs={12} sm={3}>
        <HBDatePickerController
          formRules={{
            required: true,
            validate: (value) => {
              return (
                !value || !!Date.parse(value) || `${formatMessage(validationsMessages.invalidDate)}`
              )
            },
          }}
          label={`${formatMessage(VendorShippingAgrrementsMessages.startDate)}*`}
          name="startDate"
          defaultValue={new Date()}
          minDateTime={new Date()}
        />
      </Grid>
      <Grid item xs={12} sm={3}>
        <HBDatePickerController
          formRules={{
            validate: (value) => {
              return (
                !value || !!Date.parse(value) || `${formatMessage(validationsMessages.invalidDate)}`
              )
            },
          }}
          label={formatMessage(VendorShippingAgrrementsMessages.endDate)}
          name="endDate"
          minDateTime={new Date(watch('startDate')!)}
        />
      </Grid>
      <Grid item xs={12} sm={3}>
        <HBSelectController
          formRules={{ required: true }}
          inputLabelProps={{ required: true }}
          fullWidth
          label={formatMessage(VendorShippingAgrrementsMessages.contractTypeTitle)}
          name="contractType"
          menuItem={
            Object.keys(ContractType)?.map((value: keyof typeof ContractType) => ({
              value: ContractType[value],
              title: formatMessage(VendorShippingAgrrementsMessages[value]),
            })) || []
          }
          onChange={(e) => {
            setValue('contractType', e.target.value)
            e.target.value !== ContractType.MinPurchasePrice && setValue('minPurchaseAmount', '')
          }}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <HBSelectTree
          size="medium"
          sx={{ width: '100%', height: 40, '& > label': { lineHeight: 1 } }}
          renderValueEmptyLabel={formatMessage(VendorShippingAgrrementsMessages.categoryTitle)}
          rootParentValue={null}
          required={
            watch('contractType')?.toString() === String(ContractType.ProductCategory) ||
            watch('contractType')?.toString() === String(ContractType.ProductDefault)
          }
          disabled={
            watch('contractType')?.toString() !== ContractType.ProductCategory &&
            watch('contractType')?.toString() !== ContractType.ProductDefault
          }
          data={
            categories?.map((item: any) => {
              return {
                id: item.id!,
                label: item.name!,
                parentId: item.parentId!,
                value: item.id!,
                isAllocatableToProduct: item.isAllocatableToProduct!,
              }
            }) || []
          }
          multiple
          value={watch('categoryId')}
          onChange={(value: string) => setValue('categoryId', value)}
          label={formatMessage(VendorShippingAgrrementsMessages.categoryTitle)}
        />
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <HBSelectMultiColumnController
          name="productId"
          label={formatMessage(VendorShippingAgrrementsMessages.productTitle)}
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
            required: watch('contractType')?.toString() === String(ContractType.Product),
          }}
          multiple
          disabled={watch('contractType')?.toString() !== ContractType.Product}
          error={watch('contractType')?.toString() === ContractType.Product && !watch('productId')}
          autoComplete={false}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <Currency
          title={formatMessage(VendorShippingAgrrementsMessages.minPurchaseAmount)}
          name="minPurchaseAmount"
          isRequired={getValues('contractType')?.toString() === ContractType.MinPurchasePrice}
          isDisable={watch('contractType')?.toString() !== ContractType.MinPurchasePrice}
          error={
            watch('contractType')?.toString() === ContractType.MinPurchasePrice &&
            !getValues('minPurchaseAmount')
          }
        />
      </Grid>
      <Grid item xs={12} sm={3}>
        <HBSelectController
          formRules={{
            required: watch('shippingObligationType')?.toString() === ShippingType.ByPlatform,
          }}
          inputLabelProps={{
            required: watch('shippingObligationType')?.toString() === ShippingType.ByPlatform,
          }}
          fullWidth
          label={formatMessage(VendorShippingAgrrementsMessages.costCoverageTitle)}
          name="costCoverageType"
          menuItem={
            Object.keys(PriceCoverageType)?.map((value: keyof typeof PriceCoverageType) => ({
              value: PriceCoverageType[value],
              title: formatMessage(VendorShippingAgrrementsMessages[value]),
            })) || []
          }
          disabled={watch('shippingObligationType')?.toString() !== ShippingType.ByPlatform}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <Currency
          title={formatMessage(VendorShippingAgrrementsMessages.coverageAmount)}
          name="coverageAmount"
          isRequired={getValues('costCoverageType')?.toString() === PriceCoverageType.Partial}
          isDisable={getValues('costCoverageType')?.toString() !== PriceCoverageType.Partial}
          error={
            getValues('costCoverageType')?.toString() === PriceCoverageType.Partial &&
            !getValues('coverageAmount')
          }
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <Currency
          title={formatMessage(VendorShippingAgrrementsMessages.shippingCostInOrigin)}
          name="shippingCostInOrigin"
          isRequired={getValues('shippingObligationType')?.toString() === ShippingType.ByVendor}
          isDisable={getValues('shippingObligationType')?.toString() !== ShippingType.ByVendor}
          error={
            getValues('shippingObligationType')?.toString() === ShippingType.ByVendor &&
            !getValues('shippingCostInOrigin')
          }
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <Currency
          title={formatMessage(VendorShippingAgrrementsMessages.shippingCostInElseWhere)}
          name="shippingCostInElseWhere"
          isRequired={getValues('shippingObligationType')?.toString() === ShippingType.ByVendor}
          isDisable={getValues('shippingObligationType')?.toString() !== ShippingType.ByVendor}
          error={
            getValues('shippingObligationType')?.toString() === ShippingType.ByVendor &&
            !getValues('shippingCostInElseWhere')
          }
        />
      </Grid>
    </Grid>
  )
}

export default FormFields
