import { currenciesMessage } from '@hasty-bazar-admin/domains/Currencies/Currencies.message'
import { HBRecordHistory } from '@hasty-bazar/admin-shared/containers'
import { HBSwitchController } from '@hasty-bazar/admin-shared/containers/HBSwitchController'
import HBTextFieldController from '@hasty-bazar/admin-shared/containers/HBTextFieldController'
import {
  HBAutocompleteController,
  HBButton,
  HBDialog,
  HBForm,
  HBIcon,
  HBIconType,
} from '@hasty-bazar/core'
import { Box, Grid, Typography } from '@mui/material'
import { IconTypes } from 'libs/core/src/components/HBIcon/HBIcon.data'
import useCurrenciesAddEdit from '../../hooks/useCurrenciesAddEdit'
import { AddEditStatusOneProps, CurrenciesAddEditProps, IconType } from '../../types/types'

const CurrenciesAddEdit = (props: AddEditStatusOneProps) => {
  const {
    id,
    stateRow,
    open,
    contentFormProvider,
    isDirty,
    isValid,
    isLoadingAdd,
    isLoadingUpdate,
    formatMessage,
    handleCancel,
    handleSubmit,
  } = useCurrenciesAddEdit(props)

  const IconTypesTemp: IconType[] = IconTypes.map((x) => ({ id: x, symbol: x }))

  return (
    <HBDialog
      title={formatMessage(currenciesMessage[id ? 'editTitle' : 'addTitle'])}
      open={open}
      onReject={handleCancel}
      onClose={handleCancel}
    >
      <Box>
        <HBForm formProviderProps={contentFormProvider} onSubmit={handleSubmit}>
          <Typography variant="body2" sx={{ mb: 8 }} component="div">
            {formatMessage(currenciesMessage[id ? 'editDescription' : 'addDescription'])}
          </Typography>
          <Grid container spacing={6} direction="row">
            <Grid item xs={12} md={6}>
              <HBTextFieldController
                autoFocus
                required
                formRules={{
                  required: true,
                  maxLength: 20,
                }}
                label={formatMessage(currenciesMessage.gridCode)}
                name={'code'}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <HBTextFieldController
                required
                formRules={{
                  required: true,
                  maxLength: 150,
                }}
                label={formatMessage(currenciesMessage.gridName)}
                name={'name'}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <HBTextFieldController
                required
                formRules={{
                  required: true,
                  maxLength: 150,
                  validate: (value) => {
                    return (
                      /^[A-Za-z0-9 ]+$/gi.test(value) ||
                      !value ||
                      formatMessage(currenciesMessage.usedInvalidCharacter)
                    )
                  },
                }}
                label={formatMessage(currenciesMessage.gridLatinName)}
                name={'latinName'}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <HBAutocompleteController<CurrenciesAddEditProps, IconType>
                formRules={{ required: false }}
                label={formatMessage(currenciesMessage.iconPath)}
                fieldName="symbol"
                isOptionEqualToValue={(o, v) => o == v}
                getOptionLabel={(option: IconType) => option.id || ''}
                options={IconTypesTemp}
                autoCompleteProps={{
                  renderOption: (params, option: IconType) => (
                    <Box
                      component="li"
                      {...params}
                      mx={2}
                      sx={({ palette }) => ({
                        display: 'flex',
                        gap: 2,
                        borderBottom: `1px solid ${palette.grey[200]}`,
                        width: '100%',
                      })}
                    >
                      <HBIcon type={option?.symbol as HBIconType} size="small" />
                      {option?.symbol}
                    </Box>
                  ),
                }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <HBTextFieldController
                required
                type="number"
                formRules={{
                  required: true,
                  validate: (value) => {
                    return (
                      /[0-9]+$/gi.test(value) ||
                      !value ||
                      formatMessage(currenciesMessage.usedInvalidCharacter)
                    )
                  },
                }}
                label={formatMessage(currenciesMessage.numberOfDecimal)}
                name={'numberOfDecimal'}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <HBTextFieldController
                required
                formRules={{
                  required: true,
                  maxLength: 4000,
                  validate: (value) => {
                    return (
                      /^[A-Za-z0-9ا-ی ]+$/gi.test(value) ||
                      !value ||
                      formatMessage(currenciesMessage.usedInvalidCharacter)
                    )
                  },
                }}
                label={formatMessage(currenciesMessage.tradingCurrency)}
                name={'tradingCurrency'}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <HBTextFieldController
                required
                type="number"
                formRules={{
                  required: true,
                  validate: (value) => {
                    return (
                      /[0-9]+$/gi.test(value) ||
                      !value ||
                      formatMessage(currenciesMessage.usedInvalidCharacter)
                    )
                  },
                }}
                label={formatMessage(currenciesMessage.conversionFactor)}
                name={'conversionFactor'}
              />
            </Grid>
            <Grid item xs={12} md={6} alignSelf="center">
              <Typography variant="body2" sx={{ mr: 4 }} component="span">
                {formatMessage(currenciesMessage.isDefault)}
              </Typography>
              <HBSwitchController name="isDefault" />
            </Grid>
          </Grid>
          <Box mt={14} justifyContent="space-between" display="flex" width={'100%'}>
            <HBButton onClick={handleCancel} type="button" variant="outlined" color="secondary">
              <HBIcon
                type="angleRight"
                size="small"
                sx={{ position: 'relative', top: 2, left: -4 }}
              />
              {formatMessage(currenciesMessage.back)}
            </HBButton>
            <HBButton
              type="submit"
              variant="contained"
              color="primary"
              disabled={!isDirty || !isValid}
              loading={isLoadingAdd || isLoadingUpdate}
            >
              {formatMessage(currenciesMessage[id ? 'editSubmit' : 'addSubmit'])}
            </HBButton>
          </Box>
        </HBForm>
      </Box>
      <Box mt={4}>
        {stateRow?.[0]?.id && (
          <HBRecordHistory data={stateRow[0]} isBorder isShowAccordion showInRows />
        )}
      </Box>
    </HBDialog>
  )
}

export default CurrenciesAddEdit
