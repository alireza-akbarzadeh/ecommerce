import HBNumericFormatController from '@hasty-bazar/admin-shared/containers/HBNumericFormatController'
import HBDatePickerController from '@hasty-bazar/admin-shared/containers/HBDatePickerController'
import { HBAutocompleteController, HBButton, HBForm } from '@hasty-bazar/core'
import WithdrawalRequestsMessages from '../../messages/index.messages'
import { MenuItem, FiltersProps, FiltersForm } from '../../types'
import useFilters from '../../hooks/useFilters'
import { GRID_DATA_ID } from '../../variables'
import { Grid, Stack } from '@mui/material'

const FiltersForm = (props: FiltersProps) => {
  const { onFilter, statusCodes, handleResetFilters, formProviderProps, formatMessage } =
    useFilters(props)

  return (
    <HBForm<FiltersForm>
      id={GRID_DATA_ID}
      formProviderProps={formProviderProps}
      onSubmit={onFilter}
    >
      <Stack gap={6}>
        <Grid container xs={12} spacing={4}>
          <Grid item xs={12} sm={3}>
            <HBDatePickerController
              name="fromDate"
              label={formatMessage(WithdrawalRequestsMessages.fromDate)}
              formRules={{ required: false }}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <HBDatePickerController
              name="toDate"
              label={formatMessage(WithdrawalRequestsMessages.toDate)}
              formRules={{ required: false }}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <HBNumericFormatController<FiltersForm>
              formRules={{ required: false }}
              fullWidth
              thousandSeparator=","
              name="minimumAmount"
              label={formatMessage(WithdrawalRequestsMessages.minimumAmount)}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <HBNumericFormatController<FiltersForm>
              formRules={{ required: false }}
              fullWidth
              thousandSeparator=","
              name="maximumAmount"
              label={formatMessage(WithdrawalRequestsMessages.maximumAmount)}
            />
          </Grid>
        </Grid>

        <Grid container xs={12} spacing={4}>
          <Grid item xs={12} sm={6}>
            <HBNumericFormatController<FiltersForm>
              formRules={{ required: false }}
              fullWidth
              name="cardNo"
              label={formatMessage(WithdrawalRequestsMessages.cardNo)}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <HBNumericFormatController<FiltersForm>
              formRules={{ required: false }}
              fullWidth
              name="iban"
              label={formatMessage(WithdrawalRequestsMessages.iban)}
            />
          </Grid>
        </Grid>

        <Grid container xs={12} spacing={4} alignItems={'flex-start'}>
          <Grid item xs={12} sm={3}>
            <HBDatePickerController
              name="withdrawDateFrom"
              label={formatMessage(WithdrawalRequestsMessages.withdrawDateFrom)}
              formRules={{ required: false }}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <HBDatePickerController
              name="withdrawDateTo"
              label={formatMessage(WithdrawalRequestsMessages.withdrawDateTo)}
              formRules={{ required: false }}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <HBNumericFormatController<FiltersForm>
              formRules={{ required: false }}
              fullWidth
              name="depositeOrWithdrawReferenceCode"
              label={formatMessage(WithdrawalRequestsMessages.depositeOrWithdrawReferenceCode)}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <HBAutocompleteController<FiltersForm, MenuItem>
              label={formatMessage(WithdrawalRequestsMessages.checkStatus)}
              fieldName="isCleared"
              isOptionEqualToValue={(o, v) => o.value == v.value}
              getOptionLabel={(option) => `${option.title}`}
              options={statusCodes}
            />
          </Grid>
        </Grid>

        <Stack my={4} direction={{ xs: 'column', md: 'row' }} justifyContent="space-between">
          <HBButton onClick={handleResetFilters} variant="outlined">
            {formatMessage(WithdrawalRequestsMessages.removeFilters)}
          </HBButton>
          <HBButton type="submit" sx={{ mr: 4 }}>
            {formatMessage(WithdrawalRequestsMessages.addFilter)}
          </HBButton>
        </Stack>
      </Stack>
    </HBForm>
  )
}

export default FiltersForm
