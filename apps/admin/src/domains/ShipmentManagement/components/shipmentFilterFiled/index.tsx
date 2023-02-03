import HBDateTimePickerController from '@hasty-bazar/admin-shared/containers/HBDateTimePickerController'
import HBSelectMultiColumnController from '@hasty-bazar/admin-shared/containers/HBSelectMultiColumnController'
import { HBSwitchController } from '@hasty-bazar/admin-shared/containers/HBSwitchController'
import phrasesMessages from '@hasty-bazar-admin/core/translations/phrases.messages'
import { GetBusinessTypeValuesByBusinessTypeQueryResult } from '@hasty-bazar/admin-shared/services/generalDataApi.generated'
import { GetAllShippingProvidersQueryResult } from '@hasty-bazar/admin-shared/services/saleApi.generated'
import { GetStatesQueryResult } from '@hasty-bazar/admin-shared/services/workflowApi.generated'
import { HBAutocompleteController, HBButton } from '@hasty-bazar/core'
import { Box, Grid, Stack, Typography } from '@mui/material'
import { FC } from 'react'
import { useShipmentFilterField } from '../../hooks'
import ShipmentManagementMessage from '../../messages'
import { IShipmentFilterFiled, IShipmentModelForm } from '../../types'
const ShipmentFilterFiled: FC<IShipmentFilterFiled> = ({
  formRef,
  handleRemoveFilter,
  isValid,
}) => {
  const {
    agentColumn,
    agents,
    formatMessage,
    ShipmentStatusApi,
    filterDateTypeApi,
    providerIdApi,
    shipmentOrderApi,
    page,
    partiesData,
    setPage,
    setPartiesData,
    setSearchText,
  } = useShipmentFilterField()

  const handleChangeGrid = () => {
    formRef?.current?.click()
  }

  return (
    <>
      <Grid container spacing={7}>
        <Grid item xs={12} sm={4}>
          <HBAutocompleteController<
            IShipmentModelForm,
            GetBusinessTypeValuesByBusinessTypeQueryResult
          >
            label={formatMessage(ShipmentManagementMessage.filterType)}
            fieldName={'dateFilterTypeCode'}
            isOptionEqualToValue={(o, v) => o.id == v.id}
            getOptionLabel={(option) => option.title ?? ''}
            options={filterDateTypeApi || []}
            formRules={{
              required: true,
            }}
            required
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <HBDateTimePickerController
            defaultValue={new Date()}
            label={`${formatMessage(ShipmentManagementMessage.startDate)}*`}
            name={'fromDate'}
            formRules={{ required: true }}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <HBDateTimePickerController
            defaultValue={new Date()}
            label={`${formatMessage(ShipmentManagementMessage.endDate)}`}
            name={'toDate'}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <HBAutocompleteController<IShipmentModelForm, GetAllShippingProvidersQueryResult, true>
            label={formatMessage(ShipmentManagementMessage.shippingProvider)}
            fieldName={'agentId'}
            isOptionEqualToValue={(o, v) => o.id == v.id}
            getOptionLabel={(option) => option.providerName ?? ''}
            options={providerIdApi || []}
            autoCompleteProps={{
              multiple: true,
            }}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <HBAutocompleteController<IShipmentModelForm, GetAllShippingProvidersQueryResult, true>
            label={formatMessage(ShipmentManagementMessage.shipmentCoName)}
            fieldName={'providerId'}
            isOptionEqualToValue={(o, v) => o.id == v.id}
            getOptionLabel={(option) => option.providerName ?? ''}
            options={shipmentOrderApi || []}
            autoCompleteProps={{
              multiple: true,
            }}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <HBAutocompleteController<IShipmentModelForm, GetStatesQueryResult, true>
            label={formatMessage(ShipmentManagementMessage.shipmentStatus)}
            fieldName={'status'}
            isOptionEqualToValue={(o, v) => o.id == v.id}
            getOptionLabel={(option) => option.title ?? ''}
            options={ShipmentStatusApi || []}
            autoCompleteProps={{
              multiple: true,
            }}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <HBSelectMultiColumnController
            formRules={{ required: false }}
            label={formatMessage(ShipmentManagementMessage.buyer)}
            name="customerId"
            items={partiesData}
            onInputChange={(_, searchValue) => {
              setPartiesData([])
              setSearchText(searchValue)
            }}
            loadNextPage={() => {
              setPage(page + 1)
            }}
            pageSize={20}
            multiple
            isOptionEqualToValue={(option, _value) => option.id === _value.id}
            columnDefs={agentColumn}
            totalItems={agents?.length!}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              mt: 2,
            }}
          >
            <Typography variant={'body1'}>
              {formatMessage(ShipmentManagementMessage.showProduct)}
            </Typography>
            <HBSwitchController
              onChange={handleChangeGrid}
              formRules={{
                required: false,
              }}
              name={'isProduct'}
            />
          </Box>
        </Grid>
      </Grid>
      <Stack my={5} justifyContent={'space-between'} direction="row">
        <HBButton variant="outlined" onClick={() => handleRemoveFilter()}>
          {formatMessage(phrasesMessages.resetFilter)}
        </HBButton>
        <HBButton type="submit" disabled={!isValid} ref={formRef}>
          {formatMessage(phrasesMessages.filtering)}
        </HBButton>
      </Stack>
    </>
  )
}
export default ShipmentFilterFiled
