import { HBAutoComplete, HBTextField } from '@hasty-bazar/core'
import { Field, FieldSelectorProps } from '@hasty-bazar/query-builder'
import { Box } from '@mui/material'
import { FC, useEffect, useState } from 'react'

const FieldSelector: FC<FieldSelectorProps> = (props) => {
  const [attributeValue, setAttributeValue] = useState<string>('')
  const [conditionValue, setConditionValue] = useState<string>('')
  const [selectedValue, setSelectedValue] = useState<{}>({})
  const [selectedAttributeValue, setSelectedAttributeValue] = useState<{}>({})

  const onChangeFiled = (event: React.SyntheticEvent, newValue: Field) => {
    newValue?.name && setConditionValue(newValue?.name)
    setAttributeValue('')
  }

  const onChangeAttribute = (event: React.SyntheticEvent, newValue: Field) => {
    newValue?.name && setAttributeValue(newValue?.name)
  }

  useEffect(() => {
    const data = props.value!.split('.')
    if (data.length > 2 && data[1] === 'AttributeFilters') {
      setConditionValue(`${data[0]}.${data[1]}`)
      setAttributeValue(props.value!)
    } else {
      if (data.length > 0 && data[0] === 'AttributeFilters') {
        setConditionValue(data[0])
        data.length > 1 && setAttributeValue(props.value!)
      } else {
        setConditionValue(props.value!)
      }
    }
  }, [props.value])

  useEffect(() => {
    if (attributeValue) {
      props.handleOnChange(attributeValue)
      if ((props.options as Field[]).filter((item) => !item['isShow']).length > 0) {
        setSelectedAttributeValue(
          (props.options as Field[]).filter((item) => item.name === attributeValue)[0],
        )
      }
    }
  }, [attributeValue, props.options])

  useEffect(() => {
    if (conditionValue.indexOf('AttributeFilters') === -1) {
      conditionValue && props.handleOnChange(conditionValue)
    }

    conditionValue &&
      setSelectedValue(
        (props.options as Field[])
          .filter((item) => item.name === conditionValue)
          .map((item) => {
            return { name: item.name, label: item.label }
          })[0],
      )
  }, [conditionValue])

  return (
    <Box
      sx={{
        float: 'left',
        mr: 2,
        maxWidth: conditionValue.indexOf('AttributeFilters') !== -1 ? 520 : 250,
      }}
    >
      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
        <HBAutoComplete
          value={selectedValue}
          onChange={onChangeFiled}
          options={(props.options as Field[])
            .filter((item) => !!item['isShow'])
            .map((item) => {
              return { name: item.name, label: item.label }
            })}
          getOptionLabel={(option: any) => option.label || ''}
          renderInput={(params) => (
            <HBTextField {...params} label={''} placeholder={''} sx={{ verticalAlign: 'unset' }} />
          )}
          size="small"
          sx={{ maxWidth: 250, minWidth: 250 }}
          disabled={false}
        />
        {conditionValue.indexOf('AttributeFilters') !== -1 && (
          <HBAutoComplete
            value={selectedAttributeValue}
            onChange={onChangeAttribute}
            options={(props.options as Field[]).filter((item) => !item['isShow'])}
            getOptionLabel={(option: any) => option.label || ''}
            renderInput={(params) => (
              <HBTextField
                {...params}
                label={''}
                placeholder={''}
                sx={{ verticalAlign: 'unset' }}
              />
            )}
            size="small"
            sx={{ maxWidth: 250, minWidth: 250 }}
            disabled={false}
          />
        )}
      </Box>
    </Box>
  )
}

export default FieldSelector
