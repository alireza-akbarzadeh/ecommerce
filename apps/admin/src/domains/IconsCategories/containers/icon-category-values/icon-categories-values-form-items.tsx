import HBTextFieldController from '@hasty-bazar/admin-shared/containers/HBTextFieldController'
import { HBUploadImageController } from '@hasty-bazar/admin-shared/containers/HBUploadImageController'
import phrasesMessages from '@hasty-bazar-admin/core/translations/phrases.messages'
import { checkPositiveNumber } from '@hasty-bazar/admin-shared/utils/checkPositiveNumber'
import { HBButton } from '@hasty-bazar/core'
import { Box, Grid } from '@mui/material'
import { useFormContext } from 'react-hook-form'
import { useIntl } from 'react-intl'
import iconsCategoriesMessages from '../../iconsCategories.messages'

type IconCategoriesValuesAddEditFormItemsProps = {
  isLoadingCreate?: boolean
  isLoadingEdit?: boolean
}

const IconCategoriesValuesFormItems = ({
  isLoadingCreate,
  isLoadingEdit,
}: IconCategoriesValuesAddEditFormItemsProps) => {
  const { formatMessage } = useIntl()
  const {
    formState: { isValid, isDirty },
  } = useFormContext()

  return (
    <Grid container spacing={4} mt={2}>
      <Grid item xs={12} md={4}>
        <HBTextFieldController
          required
          fullWidth
          name="name"
          label={formatMessage(iconsCategoriesMessages.valueTitle)}
        />
      </Grid>
      <Grid item xs={12} md={4}>
        <HBTextFieldController
          required
          fullWidth
          name="value"
          label={formatMessage(iconsCategoriesMessages.value)}
          type={'number'}
          onInput={checkPositiveNumber}
        />
      </Grid>
      <Grid item xs={12} md={4}>
        <HBTextFieldController
          required
          fullWidth
          name="sortOrder"
          label={formatMessage(iconsCategoriesMessages.valueOrder)}
          type={'number'}
          onInput={checkPositiveNumber}
        />
      </Grid>
      <Grid item xs={12} md={4}>
        <Box sx={{ minHeight: 130, width: 'fit-content' }}>
          <HBUploadImageController name={'iconPath'} />
        </Box>
      </Grid>
      <Grid
        item
        xs={12}
        mt={2}
        sx={{
          display: 'flex',
          justifyContent: 'end',
        }}
      >
        <HBButton
          variant="contained"
          type="submit"
          color="primary"
          disabled={!isValid || !isDirty || isLoadingCreate || isLoadingEdit}
        >
          {formatMessage(phrasesMessages.save)}
        </HBButton>
      </Grid>
    </Grid>
  )
}
export default IconCategoriesValuesFormItems
