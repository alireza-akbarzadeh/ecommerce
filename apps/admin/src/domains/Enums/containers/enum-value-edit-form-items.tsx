import HBTextFieldController from '@hasty-bazar/admin-shared/containers/HBTextFieldController'
import phrasesMessages from '@hasty-bazar-admin/core/translations/phrases.messages'
import HBFormItemColorPicker from '@hasty-bazar-admin/domains/Content-Arrangement/containers/HBFormItemColorPicker'
import { GetBusinessTypeValueQueryResult } from '@hasty-bazar/admin-shared/services/generalDataApi.generated'
import { checkPositiveIntgerNumber } from '@hasty-bazar/admin-shared/utils/checkPositiveNumber'
import { HBAutocompleteController, HBButton, HBIcon, HBIconType } from '@hasty-bazar/core'
import { Box, Grid } from '@mui/material'
import { IconTypes } from 'libs/core/src/components/HBIcon/HBIcon.data'
import { useFormContext, useWatch } from 'react-hook-form'
import { useIntl } from 'react-intl'
import enumsMessage from '../enums.message'

type EnumValueEditFormItemsProps = {
  isLoadingEdit?: boolean
}

const EnumValueEditFormItems = ({ isLoadingEdit }: EnumValueEditFormItemsProps) => {
  const { formatMessage } = useIntl()
  const {
    formState: { isValid, isDirty },
    control,
  } = useFormContext()

  const { iconName } = useWatch({ control })

  return (
    <Grid container spacing={4} mt={4}>
      <Grid item xs={12} md={4}>
        <HBTextFieldController
          required
          fullWidth
          name="title"
          label={formatMessage(enumsMessage.PersianNameValue)}
          disabled={true}
        />
      </Grid>
      <Grid item xs={12} md={4}>
        <HBTextFieldController
          required
          fullWidth
          name="name"
          label={formatMessage(enumsMessage.latinNameValue)}
          disabled={true}
        />
      </Grid>
      <Grid item xs={12} md={4}>
        <HBTextFieldController
          required
          fullWidth
          name="code"
          label={formatMessage(enumsMessage.codeValue)}
          disabled={true}
        />
      </Grid>
      <Grid item xs={12} md={4}>
        <HBTextFieldController
          required
          fullWidth
          name="fullCode"
          label={formatMessage(enumsMessage.completeCodeValue)}
          disabled={true}
        />
      </Grid>
      <Grid item xs={12} md={4}>
        <HBTextFieldController
          fullWidth
          name="displayOrder"
          label={formatMessage(enumsMessage.sortOrderValue)}
          formRules={{ required: false }}
          type="number"
          onInput={checkPositiveIntgerNumber}
        />
      </Grid>
      <Grid item xs={12} md={4}>
        {/* @ts-ignore */}
        <HBAutocompleteController<GetBusinessTypeValueQueryResult, string>
          label={formatMessage(enumsMessage.iconValue)}
          autoCompleteProps={{
            renderOption: (params, option) => (
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
                <HBIcon type={option as HBIconType} size="small" />
                {option}
              </Box>
            ),
          }}
          textFiledProps={{
            InputProps: {
              startAdornment: (
                <HBIcon
                  type={iconName as HBIconType}
                  size="small"
                  sx={({ spacing }) => ({ padding: spacing(1.2, 0, 0, 1.2) })}
                />
              ),
            },
          }}
          fieldName="iconName"
          isOptionEqualToValue={(o, v) => o == v}
          getOptionLabel={(option) => option ?? ''}
          options={IconTypes}
        />
      </Grid>
      <Grid item xs={12} md={4}>
        <HBFormItemColorPicker
          label={formatMessage(enumsMessage.colorValue)}
          formName="colorName"
          saveButtonLabel={formatMessage(phrasesMessages.save)}
          cancelButtonLabel={formatMessage(phrasesMessages.cancel)}
        />
      </Grid>
      <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'end' }}>
        <HBButton
          variant="contained"
          type="submit"
          color="primary"
          disabled={!isValid || !isDirty || isLoadingEdit}
        >
          {formatMessage(phrasesMessages.save)}
        </HBButton>
      </Grid>
    </Grid>
  )
}
export default EnumValueEditFormItems
