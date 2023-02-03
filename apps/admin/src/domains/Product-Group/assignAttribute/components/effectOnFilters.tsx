import { HBSwitchController } from '@hasty-bazar/admin-shared/containers/HBSwitchController'
import { HBAutocompleteController, HBFormItemTextField } from '@hasty-bazar/core'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import { useEffect } from 'react'
import { useFormContext } from 'react-hook-form'
import { useIntl } from 'react-intl'
import productGroupPageMessages from '../../ProductGroupPage.messages'

type EffectOnFilterProps = {
  attributeFiltersItems: {
    title: string
    value: string
  }[]
}

const EffectOnFilters = (props: EffectOnFilterProps) => {
  const { attributeFiltersItems } = props
  const { formatMessage } = useIntl()
  const { watch, getValues, setValue } = useFormContext()

  useEffect(() => {
    if (!watch('isUsedForFilter')) {
      setValue('attributeFilterId', '')
    }
  }, [watch('isUsedForFilter')])

  return (
    <Grid container spacing={4} mb={5} mt={5} sx={{ alignItems: 'center' }}>
      <Grid item xs={12} mb={2}>
        <Typography variant="h4">
          {formatMessage(productGroupPageMessages.attributeEffectOnFilters)}
        </Typography>
      </Grid>
      <Grid item xs={12} sm={6} md={3} sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography>{formatMessage(productGroupPageMessages.isComparable)}</Typography>
        <HBSwitchController name={'isCompereable'} disabled={false} />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <HBFormItemTextField
          label={formatMessage(productGroupPageMessages.displayOrder)}
          fullWidth
          formName={'sortOrderInIsCompereable'}
          maskOptions={{ mask: Number }}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3} sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography>{formatMessage(productGroupPageMessages.isQuickView)}</Typography>
        <HBSwitchController name={'isUsedInQuickCompare'} disabled={false} />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <HBFormItemTextField
          label={formatMessage(productGroupPageMessages.displayOrder)}
          fullWidth
          formName={'usedInQuickCompareSortOrder'}
          maskOptions={{ mask: Number }}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3} sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography>{formatMessage(productGroupPageMessages.useableInFilter)}</Typography>
        <HBSwitchController name={'isUsedForFilter'} disabled={false} />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <HBFormItemTextField
          label={formatMessage(productGroupPageMessages.displayOrder)}
          fullWidth
          formName={'usedForFilterOrder'}
          maskOptions={{ mask: Number }}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        {getValues('isUsedForFilter') && (
          <HBAutocompleteController
            label={formatMessage(productGroupPageMessages.periodFilter)}
            fieldName="attributeFilterId"
            isOptionEqualToValue={(o, v) => o.value == v.value}
            getOptionLabel={(option) => `${option.title}`}
            options={attributeFiltersItems || []}
          />
        )}
      </Grid>
      <Grid item xs={12} sm={6} md={3} />
      <Grid item xs={12} sm={6} md={3} sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography>{formatMessage(productGroupPageMessages.useableInFastView)}</Typography>
        <HBSwitchController name={'isQuickView'} disabled={false} />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <HBFormItemTextField
          label={formatMessage(productGroupPageMessages.displayOrder)}
          fullWidth
          formName={'quickViewSortOrder'}
          maskOptions={{ mask: Number }}
        />
      </Grid>
    </Grid>
  )
}
export default EffectOnFilters
