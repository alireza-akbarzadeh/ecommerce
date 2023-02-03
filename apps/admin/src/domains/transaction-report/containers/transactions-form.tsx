import HBDatePickerController from '@hasty-bazar/admin-shared/containers/HBDatePickerController'
import HBNumericFieldController from '@hasty-bazar/admin-shared/containers/HBNumericFieldController'
import { useAppSelector } from '@hasty-bazar/admin-shared/core/redux/hooks'

import { HBAutocompleteController, HBSelectProps } from '@hasty-bazar/core'
import { Grid } from '@mui/material'
import { useFormContext } from 'react-hook-form'
import { useIntl } from 'react-intl'
import { TransactionReportFormType } from '../transaction-report'
import transactionReportMessages from '../transactionReportMessages.messages'

export default function TransactionsForm() {
  const { formatMessage } = useIntl()
  const { watch } = useFormContext()
  const defaultCurrency = useAppSelector((state) => String(String(state.app.defaultCurrencyTitle)))

  return (
    <Grid container spacing={3} rowSpacing={6}>
      <Grid item xs={12} md={3}>
        <HBDatePickerController
          formRules={{ required: false }}
          label={formatMessage(transactionReportMessages.fromDateTime)}
          name="fromDate"
        />
      </Grid>
      <Grid item xs={12} md={3}>
        <HBDatePickerController
          formRules={{ required: false }}
          label={formatMessage(transactionReportMessages.toDateTime)}
          name="toDate"
          disabled={watch('fromDate') ? false : true}
          minDateTime={new Date(watch('fromDate'))}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <HBAutocompleteController
          label={formatMessage(transactionReportMessages.transactionTypeTitle)}
          fieldName="transactionType"
          isOptionEqualToValue={(o, v) => o.value == v.value}
          getOptionLabel={(option) => `${option.title}`}
          options={[
            {
              title: formatMessage(transactionReportMessages.withdrawal),
              value: 0,
            },
            {
              title: formatMessage(transactionReportMessages.deposit),
              value: 1,
            },
          ]}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <HBAutocompleteController<TransactionReportFormType, any>
          label={formatMessage(transactionReportMessages.reason)}
          fieldName="type"
          isOptionEqualToValue={(o, v) => o.value == v.value}
          getOptionLabel={(option) => option.title}
          options={[
            { title: formatMessage(transactionReportMessages.type0), value: 0 },
            { title: formatMessage(transactionReportMessages.type1), value: 1 },
            { title: formatMessage(transactionReportMessages.type2), value: 2 },
            { title: formatMessage(transactionReportMessages.type3), value: 3 },
            { title: formatMessage(transactionReportMessages.type4), value: 4 },
            { title: formatMessage(transactionReportMessages.type5), value: 5 },
          ]}
        />
      </Grid>
      {/* TODO: Maybe we use this */}
      {/* <Grid item xs={12} sm={6} md={3}>
        <HBAutocompleteController
          label={formatMessage(transactionReportMessages.paymentMethod)}
          fieldName="paymentMethod"
          isOptionEqualToValue={(o, v) => o.value == v.value}
          getOptionLabel={(option) => `${option.title}`}
          options={PaymentProviderTypeCodes}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <HBAutocompleteController
          label={formatMessage(transactionReportMessages.panelType)}
          fieldName="panelType"
          isOptionEqualToValue={(o, v) => o.value == v.value}
          getOptionLabel={(option) => `${option.title}`}
          options={PanelTypeCodes}
        />
      </Grid> */}
      {/* <Grid item xs={12} sm={6} md={3}>
        <HBAutocompleteController
          label={formatMessage(transactionReportMessages.role)}
          fieldName="roleAccountParty"
          isOptionEqualToValue={(o, v) => o.value == v.value}
          getOptionLabel={(option) => `${option.title}`}
          options={RoleAccountPartyCodes}
        />
      </Grid> */}
      <Grid item xs={12} sm={6} md={3}>
        <HBNumericFieldController
          label={formatMessage(transactionReportMessages.fromAmount, {
            currency: defaultCurrency,
          })}
          name="minimumAmount"
          formRules={{ required: false }}
          allowNegative={false}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <HBNumericFieldController
          label={formatMessage(transactionReportMessages.toAmount, {
            currency: defaultCurrency,
          })}
          name="maximumAmount"
          formRules={{ required: false }}
          allowNegative={false}
        />
      </Grid>
    </Grid>
  )
}
