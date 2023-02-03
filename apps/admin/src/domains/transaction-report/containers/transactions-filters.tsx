import { pascalCase } from '@hasty-bazar/admin-shared/utils/util'
import { HBButton, HBForm } from '@hasty-bazar/core'
import { Box } from '@mui/material'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useIntl } from 'react-intl'
import { TransactionReportFormType } from '../transaction-report'
import transactionReportMessages from '../transactionReportMessages.messages'
import TransactionsForm from './transactions-form'

export type TransactionsFiltersProps = {
  changeFilter: (actionUrl?: string) => void
}
const TransactionsFilters = (props: TransactionsFiltersProps) => {
  const { changeFilter } = props
  const { formatMessage } = useIntl()

  const formProviderProps = useForm<TransactionReportFormType>({
    mode: 'all',
    defaultValues: {
      fromDate: null,
      toDate: null,
      type: '',
      transactionType: '',
      paymentMethod: '',
      transactionStatus: '',
      panelType: '',
      roleAccountParty: '',
      maximumAmount: '',
      minimumAmount: '',
    },
  })

  const handleSubmit = (values: TransactionReportFormType) => {
    let filter = ''
    Object.keys(values).forEach((key) => {
      if (!key.includes('Date') && !(key === 'maximumAmount' || key === 'minimumAmount')) {
        //@ts-ignore
        if (values[key]?.value || values[key]?.value === 0) {
          filter += `${pascalCase(key)}_Equal_--${pascalCase(key)} And `
        }
      }
    })
    filter = filter.slice(0, -4).trim() + '&'
    Object.keys(values).forEach((key) => {
      if (key === 'maximumAmount' || key === 'minimumAmount') {
        filter += values[key] && `${pascalCase(key)}=${values[key]}&`
      } else if (!key.includes('Date')) {
        //@ts-ignore
        const value = values[key]?.value ?? values[key]?.requestCategoryCode
        if (value || value === 0) {
          filter += `${pascalCase(key)}=${value}&`
        }
      } else {
        //@ts-ignore
        const value = values[key]
        if (value) {
          filter += `${pascalCase(key)}=${new Date(value)?.toLocaleDateString('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
          })}&`
        }
      }
    })
    filter = filter.slice(0, -1)
    const actionUrl =
      process.env.NEXT_PUBLIC_GATEWAY +
      '/Admin/Payment/wallet/transactions' +
      (filter?.length
        ? `?Filter=${filter}&ver=${new Date().getTime()}`
        : `?ver=${new Date().getTime()}`)
    changeFilter(actionUrl)
  }

  const handleReset = () => {
    formProviderProps.reset()
    changeFilter?.(process.env.NEXT_PUBLIC_GATEWAY + '/Admin/Payment/wallet/transactions')
  }

  useEffect(() => {
    handleSubmit(formProviderProps.control._defaultValues)
  }, [])

  return (
    <Box bgcolor={'common.white'} px={3} mb={4}>
      <HBForm formProviderProps={formProviderProps} onSubmit={handleSubmit}>
        <TransactionsForm />
        <Box mt={6} display="flex" justifyContent="space-between">
          <HBButton variant="outlined" onClick={handleReset}>
            {formatMessage(transactionReportMessages.removeFilter)}
          </HBButton>
          <HBButton type="submit">{formatMessage(transactionReportMessages.submitFilter)}</HBButton>
        </Box>
      </HBForm>
    </Box>
  )
}
export default TransactionsFilters
