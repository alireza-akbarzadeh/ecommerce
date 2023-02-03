import HBSelectController from '@hasty-bazar/admin-shared/containers/HBSelectController'
import { CategoryAttributeModel } from '@hasty-bazar/admin-shared/services/catalogApi.generated'
import { Grid } from '@mui/material'
import { useEffect, useMemo } from 'react'
import { useFormContext } from 'react-hook-form'
import { useIntl } from 'react-intl'
import ContentSettingsMessages from '../ContentSettings.messages'
export const CONTROL_FILED_NAME_PREFIX = 'control-'
function ControlUpdateAttribute({
  attribute,
  disabled,
}: { attribute: CategoryAttributeModel } & {
  disabled?: boolean
}) {
  const { formatMessage } = useIntl()
  const { setValue } = useFormContext()
  const controlUpdateAttributeFieldName = `${CONTROL_FILED_NAME_PREFIX}${attribute.attributeId}`
  const value = useMemo(
    () => (attribute.attributeValues?.[0]?.isAddedByParent ? 1 : 0),
    [attribute.attributeValues],
  )
  useEffect(() => {
    if (value) {
      setValue(controlUpdateAttributeFieldName, value)
    } else {
      setValue(controlUpdateAttributeFieldName, 1)
    }
  }, [value])

  return (
    <Grid item display={'flex'} direction="column" sm={3} xs={12}>
      <HBSelectController
        name={controlUpdateAttributeFieldName}
        disabled={disabled}
        label={formatMessage(ContentSettingsMessages.controlUpdateAttribute)}
        menuItem={[
          {
            title: formatMessage(ContentSettingsMessages.changeAbleInChildLevel),
            value: 0,
          },
          {
            title: formatMessage(ContentSettingsMessages.changeAbleInParentLevel),
            value: 1,
          },
        ]}
      />
    </Grid>
  )
}

export default ControlUpdateAttribute
