import { HBSwitchController } from '@hasty-bazar/admin-shared/containers/HBSwitchController'
import { HBFormItemTextField } from '@hasty-bazar/core'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import { useEffect } from 'react'
import { useFormContext, useWatch } from 'react-hook-form'
import { useIntl } from 'react-intl'
import productGroupPageMessages from '../../ProductGroupPage.messages'
import { AssignAttributeAddEditFormType } from '../assignAttributePage'

const EffectOnDiversity = () => {
  const { formatMessage } = useIntl()

  const { getValues, watch, setValue, control } = useFormContext<AssignAttributeAddEditFormType>()
  const { importantTypeCode } = useWatch({
    control,
  })
  const isImportantTypeCode =
    typeof importantTypeCode === 'string'
      ? importantTypeCode == '1026002'
      : //@ts-ignore
        importantTypeCode?.id == '1026002'

  useEffect(() => {
    if (!isImportantTypeCode) {
      setValue('isEffectiveInMultiplication', false)
      setValue('isEffectiveInProductUnification', false)
      setValue('isEffectiveInDisplay', false)
    }
  }, [watch('importantTypeCode')])

  return (
    <Grid container spacing={4} mb={5} mt={5} sx={{ alignItems: 'center' }}>
      <Grid item xs={12} mb={2}>
        <Typography variant="h4">
          {formatMessage(productGroupPageMessages.attributeEffectOnDiversity)}
        </Typography>
      </Grid>
      <Grid item xs={12} sm={6} md={3} sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography>
          {formatMessage(productGroupPageMessages.isEffectiveInProductUnification)}
        </Typography>
        <HBSwitchController
          name={'isEffectiveInMultiplication'}
          disabled={!isImportantTypeCode || !!watch('isEffectiveInDisplay')}
          onChange={(_, checked) => {
            setValue('isEffectiveInMultiplication', checked)
            if (!checked) {
              setValue('isEffectiveInProductUnification', checked)
              setValue('sortOrderInIsEffectiveInUnification', null)
            }
          }}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3} sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography>
          {formatMessage(productGroupPageMessages.isEffectiveInMultiplication)}
        </Typography>
        <HBSwitchController
          name={'isEffectiveInProductUnification'}
          disabled={!isImportantTypeCode}
          onChange={(_, checked) => {
            setValue('isEffectiveInProductUnification', checked)
            if (!checked) {
              setValue('sortOrderInIsEffectiveInUnification', null)
            }
          }}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <HBFormItemTextField
          label={formatMessage(productGroupPageMessages.displayOrder)}
          fullWidth
          formName={'sortOrderInIsEffectiveInUnification'}
          disabled={!getValues('isEffectiveInProductUnification')}
          InputLabelProps={{ required: !!getValues('isEffectiveInProductUnification') }}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3} sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography>{formatMessage(productGroupPageMessages.isEffectiveInDisplayTitle)}</Typography>
        <HBSwitchController
          name={'isEffectiveInDisplay'}
          disabled={!watch('isEffectiveInMultiplication') || !isImportantTypeCode}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3} sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography>{formatMessage(productGroupPageMessages.useableInProductTitle)}</Typography>
        <HBSwitchController name={'isUsedForProductName'} />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <HBFormItemTextField
          label={formatMessage(productGroupPageMessages.displayTitleBefore)}
          fullWidth
          formName={'displayTitleBefore'}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <HBFormItemTextField
          label={formatMessage(productGroupPageMessages.displayTitleAfter)}
          fullWidth
          formName={'displayTitleAfter'}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <HBFormItemTextField
          label={formatMessage(productGroupPageMessages.sortOrderInProductName)}
          fullWidth
          formName={'sortOrderInProductName'}
          maskOptions={{ mask: Number }}
        />
      </Grid>
    </Grid>
  )
}
export default EffectOnDiversity
