import HBDatePickerController from '@hasty-bazar/admin-shared/containers/HBDatePickerController'
import HBSelectMultiColumnController from '@hasty-bazar/admin-shared/containers/HBSelectMultiColumnController'
import validationsMessages from '@hasty-bazar-admin/core/translations/validations.messages'
import {
  GetCustomersLookupQueryResult,
  GetVendorsLookupQueryResult,
  useGetAdminIdrCustomersQuery,
  useGetAdminIdrVendorsQuery,
} from '@hasty-bazar/admin-shared/services/idrApi.generated'
import { GetOrdersHeaderQueryFilter } from '@hasty-bazar/admin-shared/services/saleApi.generated'

import {
  GetAllProductsQueryResult,
  useGetAdminCatalogProductsQuery,
} from '@hasty-bazar/admin-shared/services/catalogApi.generated'
import { HBTextFieldController } from '@hasty-bazar/auth'
import { HBAutocompleteController, HBButton } from '@hasty-bazar/core'
import { Grid } from '@mui/material'
import { FC, RefObject, useEffect, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { useIntl } from 'react-intl'
import { useFormFields } from '../../hooks'
import useDataItemsQuery from '../../hooks/useDataItemsQuery'
import OrdersManagementMessage from '../../ordersManagement.message'
import { classes } from './formConfig'

interface FormFieldsProps {
  userId?: string
  formRef: RefObject<HTMLButtonElement>
  handleSubmit?: (data: GetOrdersHeaderQueryFilter) => void
  removeFilters: () => void
}

const FormFields: FC<FormFieldsProps> = ({ userId, formRef, removeFilters }) => {
  const { formatMessage } = useIntl()
  const { agents, carriers, shippingStatusType, businessTypeValue } = useDataItemsQuery()
  const [customerSearchText, setCustomerSearchText] = useState<string>()
  const [customersPage, setCustomersPage] = useState(1)
  const [customersData, setCustomersData] = useState<GetCustomersLookupQueryResult[]>([])
  const [vendorSearchText, setVendorSearchText] = useState<string>()
  const [vendorpage, setVendorpage] = useState(1)
  const [vendorsData, setVendorsData] = useState<GetVendorsLookupQueryResult[]>([])

  const [productSearchText, setProductSearchText] = useState<string>()
  const [productPage, setProductPage] = useState(1)
  const [productsData, setProductsData] = useState<GetAllProductsQueryResult[]>([])

  const { productColumn, agentColumn, customerColumn, vendorColumn, carrierColumn } =
    useFormFields()

  const { data: { data: { items: customers = [] } = {} } = {}, refetch: refetchCustomers } =
    useGetAdminIdrCustomersQuery({
      'client-name': '',
      'client-version': '',
      pageSize: 10000,
      firstName: customerSearchText,
      lastName: customerSearchText,
      mobile: customerSearchText,
      stateCode: 1,
      filter:
        '(FirstName.Contains(@FirstName) || LastName.Contains(@LastName) || Mobile.Contains(@Mobile)) && StateCode!=@StateCode',
    })

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

  const { data: { data: { items: products = [] } = {} } = {}, refetch: refetchProduct } =
    useGetAdminCatalogProductsQuery({
      'client-name': '',
      'client-version': '',
      stateCode: '3',
      filter: '(Name.Contains(@Name) || Hsin.Contains(@Hsin)) && StateCode==@StateCode',
      pageNumber: productPage,
      hsin: productSearchText,
      name: productSearchText,
      pageSize: 20,
    })

  useEffect(() => {
    vendors?.data?.items && setVendorsData((prev) => [...prev, ...vendors?.data?.items!])
  }, [vendors?.data?.items])

  useEffect(() => {
    customers && setCustomersData((prev) => [...prev, ...customers])
  }, [customers])

  useEffect(() => {
    products && setProductsData((prev) => [...prev, ...products])
  }, [products])

  const {
    watch,
    formState: { isValid },
    clearErrors,
  } = useFormContext()

  useEffect(() => {
    clearErrors('dateFilterTypeCode')
  }, [watch('fromDate'), watch('toDate')])

  return (
    <>
      <Grid container item xs={12} sm={12} sx={classes.gridSection} spacing={6} mb={4}>
        <Grid item xs={12} sm={4}>
          <HBAutocompleteController
            label={`${formatMessage(OrdersManagementMessage.dateFilterTypeCode)}`}
            fieldName="dateFilterTypeCode"
            isOptionEqualToValue={(o, v) => o.id == v.id}
            getOptionLabel={(option) => option.title ?? ''}
            options={businessTypeValue}
            required={watch('fromDate') || watch('toDate')}
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
            label={formatMessage(OrdersManagementMessage.startDate)}
            name="fromDate"
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
            label={formatMessage(OrdersManagementMessage.endDate)}
            name="toDate"
            minDateTime={new Date(watch('fromDate'))}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <HBTextFieldController
            formRules={{ required: false }}
            label={formatMessage(OrdersManagementMessage.shipmentCode).replace(':', ' ')}
            name="bundleId"
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <HBAutocompleteController
            formRules={{ required: false }}
            label={formatMessage(OrdersManagementMessage.shipmentStatus)}
            fieldName="shippingStatusType"
            isOptionEqualToValue={(o, v) => o.id == v.id}
            getOptionLabel={(option) => option.title ?? ''}
            options={shippingStatusType}
            autoCompleteProps={{
              multiple: true,
            }}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <HBSelectMultiColumnController
            formRules={{ required: false }}
            label={formatMessage(OrdersManagementMessage.deliveryTypesName).replace(':', ' ')}
            name="agentId"
            items={
              agents?.map((agent) => ({
                id: agent.id!,
                providerName: agent.providerName!,
                providerShippingStateTitle: agent.providerShippingStateTitle!,
              })) || []
            }
            columnDefs={agentColumn}
            pageSize={40}
            totalItems={agents?.length!}
            multiple
          />
        </Grid>
        {!userId && (
          <Grid item xs={12} sm={4}>
            <HBSelectMultiColumnController
              name="customerId"
              label={formatMessage(OrdersManagementMessage.customer)}
              items={customersData}
              onInputChange={(_, searchValue) => {
                setCustomersData([])
                setCustomerSearchText(searchValue)
                setCustomersPage(1)
                refetchCustomers()
              }}
              size="small"
              columnDefs={customerColumn}
              pageSize={20}
              totalItems={customers?.length!}
              loadNextPage={() => {
                setCustomersPage(customersPage + 1)
              }}
              isOptionEqualToValue={(option, _value) => option.id === _value.id}
              formRules={{ required: false }}
              autoComplete={false}
              multiple
            />
          </Grid>
        )}
        <Grid item xs={12} sm={4}>
          <HBSelectMultiColumnController
            name="vendorId"
            label={formatMessage(OrdersManagementMessage.seller).replace(':', ' ')}
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
            formRules={{ required: false }}
            autoComplete={false}
            multiple
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <HBSelectMultiColumnController
            formRules={{ required: false }}
            label={formatMessage(OrdersManagementMessage.carrier)}
            name="providerCode"
            items={
              carriers?.map((carrier) => ({
                id: carrier.id!,
                providerName: carrier.providerName,
                providerShippingStateTitle: carrier.providerShippingStateTitle,
              })) || []
            }
            columnDefs={carrierColumn}
            pageSize={40}
            totalItems={carriers?.length!}
            multiple
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <HBSelectMultiColumnController
            formRules={{ required: false }}
            label={formatMessage(OrdersManagementMessage.product)}
            name="productId"
            onInputChange={(_, searchValue) => {
              setProductsData([])
              setProductSearchText(searchValue)
              setProductPage(1)
              refetchProduct()
            }}
            items={productsData}
            loadNextPage={() => {
              setProductPage(productPage + 1)
            }}
            isOptionEqualToValue={(option, _value) => option.id === _value.id}
            columnDefs={productColumn}
            pageSize={40}
            totalItems={products?.length!}
            autoComplete={false}
            multiple
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <HBTextFieldController
            formRules={{ required: false }}
            label={formatMessage(OrdersManagementMessage.orderNumber)}
            name="orderNumber"
          />
        </Grid>
        <Grid item xs={12} sm={4}></Grid>
      </Grid>
      <Grid
        item
        xs={12}
        sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
      >
        <HBButton variant="outlined" onClick={removeFilters}>
          {formatMessage(OrdersManagementMessage.removeFilter)}
        </HBButton>
        <HBButton type="submit" disabled={!isValid} ref={formRef}>
          {formatMessage(OrdersManagementMessage.registerFilter)}
        </HBButton>
      </Grid>
    </>
  )
}

export default FormFields
