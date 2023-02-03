import { HBSwitchController } from '@hasty-bazar/admin-shared/containers/HBSwitchController'
import HBTextFieldController from '@hasty-bazar/admin-shared/containers/HBTextFieldController'
import phrasesMessages from '@hasty-bazar-admin/core/translations/phrases.messages'
import { HBButton } from '@hasty-bazar/core'
import { Grid, Stack, Typography } from '@mui/material'
import { useFormContext } from 'react-hook-form'
import { useIntl } from 'react-intl'
import iconsCategoriesMessages from '../../iconsCategories.messages'

type IconCategoriesAddEditFormItemsProps = {
  isLoadingCreate?: boolean
  isLoadingEdit?: boolean
}

const IconCategoriesFormItems = ({
  isLoadingCreate,
  isLoadingEdit,
}: IconCategoriesAddEditFormItemsProps) => {
  const { formatMessage } = useIntl()
  const {
    watch,
    formState: { isValid, isDirty },
  } = useFormContext()

  return (
    <Grid container spacing={4} mt={2}>
      <Grid item xs={12} md={6}>
        <HBTextFieldController
          required
          fullWidth
          name="name"
          label={formatMessage(iconsCategoriesMessages.title)}
          autoFocus={true}
        />
      </Grid>
      {watch('id') && (
        <Grid item xs={12} md={6} display="flex" sx={{ alignItems: 'center' }}>
          <Stack spacing={4} direction="row">
            <Typography>{formatMessage(iconsCategoriesMessages.isActive)}</Typography>
            <HBSwitchController name="isActive" />
          </Stack>
        </Grid>
      )}
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
export default IconCategoriesFormItems
