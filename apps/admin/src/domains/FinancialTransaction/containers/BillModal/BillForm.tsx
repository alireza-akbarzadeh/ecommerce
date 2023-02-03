import HBDatePickerController from '@hasty-bazar/admin-shared/containers/HBDatePickerController'
import HBSelectMultiColumnController from '@hasty-bazar/admin-shared/containers/HBSelectMultiColumnController'
import {
  GetCustomersLookupQueryResult,
  GetVendorsLookupQueryResult,
  useGetAdminIdrCustomersQuery,
  useGetAdminIdrVendorsQuery,
} from '@hasty-bazar/admin-shared/services/idrApi.generated'
import { HBAutocompleteController, HBButton } from '@hasty-bazar/core'
import { Box, Grid, useTheme } from '@mui/material'
import { useEffect, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { useIntl } from 'react-intl'
import FinancialTransactionMessage from '../../financialTransaction.message'
import { useDataItemsQuery, useFormModalColumn } from '../../hooks'

const BillForm = () => {
  const { formatMessage } = useIntl()
  const { reset } = useFormContext()
  const { breakpoints } = useTheme()
  const { providers } = useDataItemsQuery()
  const { vendorColumn, customerColumn } = useFormModalColumn()
  const [customerSearchText, setCustomerSearchText] = useState<string>()
  const [customersPage, setCustomersPage] = useState(1)
  const [customersData, setCustomersData] = useState<GetCustomersLookupQueryResult[]>([])
  const [vendorSearchText, setVendorSearchText] = useState<string>()
  const [vendorpage, setVendorpage] = useState(1)
  const [vendorsData, setVendorsData] = useState<GetVendorsLookupQueryResult[]>([])

  const { data: { data: { items: customers = [] } = {} } = {}, refetch: refetchCustomers } =
    useGetAdminIdrCustomersQuery({
      'client-name': '',
      'client-version': '',
      pageSize: 10000,
      firstName: customerSearchText,
      lastName: customerSearchText,
      stateCode: 1,
      filter:
        '(FirstName.Contains(@FirstName) || LastName.Contains(@LastName)) && StateCode!=@StateCode',
    })

  const { data: vendors, refetch: refetchVendors } = useGetAdminIdrVendorsQuery({
    'client-name': 'Swagger on HIT.Hastim.IDR.Endpoints.AdminApi',
    'client-version': '1.0.1.100',
    pageNumber: vendorpage,
    pageSize: 20,
    firstName: vendorSearchText,
    lastName: vendorSearchText,
    stateCode: 3,
    filter:
      '(FirstName.Contains(@FirstName) || LastName.Contains(@LastName)) && StateCode==@StateCode ',
  })

  useEffect(() => {
    vendors?.data?.items && setVendorsData((prev) => [...prev, ...vendors?.data?.items!])
  }, [vendors?.data?.items])

  useEffect(() => {
    customers && setCustomersData((prev) => [...prev, ...customers])
  }, [customers])

  const resetFilter = () => {
    reset({
      startDate: null,
      endDate: null,
      customerId: [],
      vendorId: [],
      operationType: null,
    })
  }

  return (
    <Grid container spacing={6}>
      <Grid item xs={12} sm={12} md={6}>
        <HBDatePickerController
          name="fromDate"
          formRules={{
            required: {
              value: true,
              message: formatMessage(FinancialTransactionMessage.enterDate),
            },
          }}
          label={`${formatMessage(FinancialTransactionMessage.startDate)}*`}
        />
      </Grid>
      <Grid item xs={12} sm={12} md={6}>
        <HBDatePickerController
          name="toDate"
          formRules={{
            required: {
              value: true,
              message: formatMessage(FinancialTransactionMessage.enterDate),
            },
          }}
          label={`${formatMessage(FinancialTransactionMessage.endDate)}*`}
        />
      </Grid>
      <Grid item xs={12} sm={12} md={6}>
        <HBSelectMultiColumnController
          name="customerId"
          label={formatMessage(FinancialTransactionMessage.customerName)}
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
      <Grid item xs={12} sm={12} md={6}>
        <HBSelectMultiColumnController
          name="vendorId"
          label={formatMessage(FinancialTransactionMessage.sellerName)}
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
      <Grid item xs={12} sm={12} md={6}>
        <HBAutocompleteController
          formRules={{ required: false }}
          label={formatMessage(FinancialTransactionMessage.deliveryTypesName).replace(':', ' ')}
          fieldName="providerId"
          isOptionEqualToValue={(o, v) => o.id == v.id}
          getOptionLabel={(option) => option.providerName ?? ''}
          options={providers!}
        />
      </Grid>
      <Grid item xs={12} sm={12} md={12}>
        <Box display="flex" justifyContent="space-between" mt={8} width={'100%'}>
          <HBButton
            size={breakpoints.down('sm') ? 'medium' : 'small'}
            variant="outlined"
            onClick={resetFilter}
            sx={{ minWidth: 100 }}
          >
            {formatMessage(FinancialTransactionMessage.removeFilter)}
          </HBButton>
          <HBButton
            size={breakpoints.down('sm') ? 'medium' : 'small'}
            sx={() => ({
              minWidth: 100,
              mx: 1,
            })}
            type="submit"
            color="primary"
          >
            {formatMessage(FinancialTransactionMessage.excelDownload)}
          </HBButton>
        </Box>
      </Grid>
    </Grid>
  )
}

export default BillForm
