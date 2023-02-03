import { HBSwitchController } from '@hasty-bazar/admin-shared/containers/HBSwitchController'
import validationsMessages from '@hasty-bazar-admin/core/translations/validations.messages'
import { useGetAdminCatalogFeatureDisplayTypeQuery } from '@hasty-bazar/admin-shared/services/catalogApi.generated'
import { GetBusinessTypeValuesByBusinessTypeQueryResult as businessTypeValues } from '@hasty-bazar/admin-shared/services/generalDataApi.generated'
import {
  HBAutocompleteController,
  HBClassesType,
  HBFormItemTextField,
  HBIcon,
} from '@hasty-bazar/core'
import { IconButton, InputAdornment } from '@mui/material'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import { useFormContext } from 'react-hook-form'
import { useIntl } from 'react-intl'
import ProductGroupPageMessages from '../../ProductGroupPage.messages'
import { AssignAttributeAddEditFormType } from '../assignAttributePage'

type HBPageClassNames = 'selectComponentWidth'

const classes: HBClassesType<HBPageClassNames> = {
  selectComponentWidth: { width: '100%' },
}

const GeneralSpecifications = (props: any) => {
  const { toggleOpenDialog, AttributeDataImportantTypeCodes = [], attributeId } = props
  const { formatMessage } = useIntl()
  const { getValues } = useFormContext<AssignAttributeAddEditFormType>()

  const { data: { data: { items: AttributeGroupTypeCodesData = [] } = {} } = {} } =
    useGetAdminCatalogFeatureDisplayTypeQuery({
      'client-name': 'featureDisplayType',
      'client-version': '1.0.0',
      pageSize: 1000,
    })

  return (
    <Grid container spacing={4} mb={5} sx={{ alignItems: 'center' }}>
      <Grid item xs={12} sm={6} md={3}>
        <HBFormItemTextField
          disabled
          sx={{ display: getValues('baseName') ? 'none' : 'block' }}
          id="input-attribute"
          label={`${formatMessage(ProductGroupPageMessages.attribute)} *`}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => toggleOpenDialog(true)} disabled={attributeId}>
                  <HBIcon size="small" type={'listUl'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
          fullWidth
          formName={'attributeId'}
          rules={{
            required: {
              value: true,
              message: `${formatMessage(validationsMessages.isRequired, {
                msg: '',
              })}`,
            },
          }}
        />
        <HBFormItemTextField
          disabled
          sx={{ display: getValues('baseName') ? 'block' : 'none' }}
          id="input-attribute"
          label={`${formatMessage(ProductGroupPageMessages.attribute)} *`}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => toggleOpenDialog(true)} disabled={attributeId}>
                  <HBIcon size="small" type={'listUl'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
          fullWidth
          formName={'baseName'}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <HBFormItemTextField
          id="input-attribute-title"
          label={`${formatMessage(ProductGroupPageMessages.viewTitle)} *`}
          fullWidth
          formName={'name'}
          rules={{
            required: {
              value: true,
              message: `${formatMessage(validationsMessages.isRequired, {
                msg: '',
              })}`,
            },
          }}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3} sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography>{formatMessage(ProductGroupPageMessages.multipleChoice)} </Typography>
        <HBSwitchController name={'isMultipleChoice'} disabled={false} />
      </Grid>
      <Grid item xs={12} sm={6} md={3} sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography>{formatMessage(ProductGroupPageMessages.visibleInSite)} </Typography>
        <HBSwitchController name={'isVisible'} disabled={false} />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <HBAutocompleteController<AssignAttributeAddEditFormType, businessTypeValues>
          label={formatMessage(ProductGroupPageMessages.displaySortTypeCode)}
          fieldName="displaySortTypeCode"
          isOptionEqualToValue={(o, v) => o.id == v}
          getOptionLabel={(option) => `${option.title}`}
          options={AttributeGroupTypeCodesData || []}
          required
          formRules={{
            required: true,
          }}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <HBFormItemTextField
          label={formatMessage(ProductGroupPageMessages.displayOrder)}
          fullWidth
          formName={'displayOrder'}
          maskOptions={{ mask: Number }}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3} sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography>{formatMessage(ProductGroupPageMessages.changeableByOtherCustomer)}</Typography>
        <HBSwitchController name={'changeableByOtherCustomer'} disabled={false} />
      </Grid>
      <Grid item md={3} />
      <Grid item xs={12} sm={6} md={3}>
        <HBAutocompleteController<AssignAttributeAddEditFormType, businessTypeValues>
          required
          label={formatMessage(ProductGroupPageMessages.importantTypeCode)}
          fieldName="importantTypeCode"
          isOptionEqualToValue={(o, v) => o.id == v}
          getOptionLabel={(option) => `${option.title}`}
          options={AttributeDataImportantTypeCodes || []}
          formRules={{
            required: {
              value: true,
              message: `${formatMessage(validationsMessages.isRequired, {
                msg: '',
              })}`,
            },
          }}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <HBFormItemTextField
          label={formatMessage(ProductGroupPageMessages.searchWeight)}
          fullWidth
          formName={'searchWeight'}
          maskOptions={{ mask: Number }}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3} sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography>{formatMessage(ProductGroupPageMessages.rateable)}</Typography>
        <HBSwitchController name={'isRateable'} disabled={false} />
      </Grid>
      <Grid item md={3} />
    </Grid>
  )
}
export default GeneralSpecifications
