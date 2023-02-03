import HBDatePickerController from '@hasty-bazar/admin-shared/containers/HBDatePickerController'
import HBSelectMultiColumnController from '@hasty-bazar/admin-shared/containers/HBSelectMultiColumnController'
import {
  GetCustomersLookupQueryResult,
  useGetAdminIdrCustomersQuery,
} from '@hasty-bazar/admin-shared/services/idrApi.generated'
import { HBAutocompleteController, HBButton } from '@hasty-bazar/core'
import { Box, Grid, useTheme } from '@mui/material'
import { useEffect, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { useIntl } from 'react-intl'
import FinancialTransactionMessage from '../../financialTransaction.message'
import { useDataItemsQuery, useFormModalColumn } from '../../hooks'

const WalletForm = () => {
  const { formatMessage } = useIntl()
  const { reset } = useFormContext()
  const { breakpoints } = useTheme()
  const { transactionTypes } = useDataItemsQuery()
  const { customerColumn } = useFormModalColumn()
  const [customerSearchText, setCustomerSearchText] = useState<string>()
  const [customersPage, setCustomersPage] = useState(1)
  const [customersData, setCustomersData] = useState<GetCustomersLookupQueryResult[]>([])

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

  useEffect(() => {
    customers && setCustomersData((prev) => [...prev, ...customers])
  }, [customers])

  const resetFilter = () => {
    reset({
      fromDate: null,
      toDate: null,
      customerId: [],
      vendorId: [],
      transactionType: null,
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
        <HBAutocompleteController
          formRules={{ required: false }}
          label={formatMessage(FinancialTransactionMessage.operationType)}
          fieldName="transactionType"
          isOptionEqualToValue={(o, v) => o.id == v.id}
          getOptionLabel={(option) => option?.title ?? ''}
          options={transactionTypes!}
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

export default WalletForm
