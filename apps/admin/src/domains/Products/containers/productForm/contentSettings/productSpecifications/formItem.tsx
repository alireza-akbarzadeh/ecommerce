import HBCheckboxController from '@hasty-bazar/admin-shared/containers/HBCheckboxController'
import HBDatePickerController from '@hasty-bazar/admin-shared/containers/HBDatePickerController'
import HBDateTimePickerController from '@hasty-bazar/admin-shared/containers/HBDateTimePickerController'
import HBRadioController from '@hasty-bazar/admin-shared/containers/HBRadioController'
import HBSelectController from '@hasty-bazar/admin-shared/containers/HBSelectController'
import { HBSwitchController } from '@hasty-bazar/admin-shared/containers/HBSwitchController'
import HBTextFieldController from '@hasty-bazar/admin-shared/containers/HBTextFieldController'
import validationsMessages from '@hasty-bazar-admin/core/translations/validations.messages'
import {
  CategoryAttributeModel,
  ProductAttribute,
  StaticDataModel,
} from '@hasty-bazar/admin-shared/services/catalogApi.generated'
import { HBIcon, HBTextField, maskOptionsType } from '@hasty-bazar/core'
import { IconButton, Stack, TextField, Typography } from '@mui/material'
import { memo, useCallback, useEffect, useMemo, useState } from 'react'
import { Controller, useFormContext, useWatch } from 'react-hook-form'
import { useIntl } from 'react-intl'
import { NumericFormat } from 'react-number-format'
import ContentSettingsMessages from '../ContentSettings.messages'
import DynamicList from './dynamicList'

export const enum AttributeDataType {
  Integer = 1017001,
  Date = 1017002,
  FixedList = 1017003,
  DynamicList = 1017004,
  Text = 1017005,
  Decimal = 1017006,
  Color = 1017007,
  Money = 1017008,
}
export const enum AttributeDisplayType {
  TextSingleLine = 1018001,
  TextMultiLine = 1018002,
  DropDownList = 1018003,
  ListOfValueSS = 1018004,
  ListOfValueMS = 1018005,
  DateSelection = 1018006,
  DateTimeSelection = 1018007,
  RadioButton = 1018008,
  CheckBox = 1018009,
  ButtonToggle = 1018010,
}
export const enum importantTypeCode {
  Optional = 1026001,
  Mandatory = 1026002,
  Suggested = 1026003,
  MandatoryInFuture = 1026004,
}
export interface FormItemProps {
  attribute: CategoryAttributeModel
  disabled?: boolean
  hasFormRule?: boolean
}

export interface SelectItemType {
  title: string
  value: string
  color: string
  iconPath: string
}
function FormItem({ attribute, hasFormRule, disabled: _disabled }: FormItemProps): JSX.Element {
  const { control, setValue } = useFormContext()
  const { formatMessage } = useIntl()
  const formData = useWatch({ control })
  const value = useMemo(
    () => getValue(attribute.attributeValues || [], attribute.attributeDisplayType!),
    [attribute.attributeValues, attribute.attributeDisplayType],
  )

  const disabled = Boolean(_disabled || attribute.isReadonly)
  const addTitle = formatMessage(ContentSettingsMessages.addNewValue)
  const canBeAddedByVendor = attribute.canBeAddedByVendor || false
  const [newMultiSelectItem, setNewMultiSelectItem] = useState(false)
  const items = convertStaticDataToSelectOptions(
    attribute.staticData!,
    canBeAddedByVendor,
    addTitle,
  )
  const [multiSelectItems, setMultiSelectItems] = useState(items)

  const newFieldLabel =
    attribute.attributeName + '-' + formatMessage(ContentSettingsMessages.userValue)
  const handleMultiSelectChange = useCallback((value: string[]) => {
    setValue(attribute.attributeId as any, value)
    if (value.includes(addTitle)) {
      setNewMultiSelectItem(true)
    } else {
      setNewMultiSelectItem(false)
    }
  }, [])
  const [newField, setNewField] = useState('')
  const newFieldName = `${attribute.attributeId}-new`
  const field = formData[attribute.attributeId as keyof typeof formData]
  const isNew = field === addTitle

  const newFieldValue = formData[newFieldName as keyof typeof formData]
  useEffect(() => {
    if (value) {
      setValue(attribute.attributeId as any, value)
    }
  }, [value])

  const handleAdd = () => {
    if (newField) {
      setMultiSelectItems([
        ...multiSelectItems,
        {
          title: newField,
          value: newField,
          iconPath: '',
          color: '',
        },
      ])
      setNewField('')
    }
  }
  const handleNewFieldChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(newFieldName, event.target.value)
  }

  const isRequired = hasFormRule
    ? Number(attribute.importantTypeCode) === importantTypeCode.Mandatory
    : false

  const showRequiredStar = Number(attribute.importantTypeCode) === importantTypeCode.Mandatory

  const formRules: any = {
    required: {
      value: isRequired,
      message: `${formatMessage(validationsMessages.isRequired, {
        msg: attribute.attributeName,
      })}`,
    },
    ...(attribute.validateNumericalValue
      ? {
          min: {
            value: attribute.validateNumericalValue.minValue,
            message: `${formatMessage(validationsMessages.minValue, {
              minValue: attribute.validateNumericalValue.minValue,
            })}`,
          },
          max: {
            value: attribute.validateNumericalValue.maxValue,
            message: `${formatMessage(validationsMessages.maxValue, {
              maxValue: attribute.validateNumericalValue.maxValue,
            })}`,
          },
        }
      : {}),
  }

  const isNumber =
    attribute.displayDataType === AttributeDataType.Integer ||
    attribute.displayDataType === AttributeDataType.Decimal ||
    attribute.displayDataType === AttributeDataType.Money

  const maskOptions: maskOptionsType | undefined = undefined

  switch (attribute.attributeDisplayType) {
    case AttributeDisplayType.TextSingleLine:
      if (isNumber) {
        return (
          <Controller
            control={control}
            rules={formRules}
            name={attribute.attributeId as any}
            render={({ field: { onChange, value, ...rest }, fieldState }) => (
              <NumericFormat
                onValueChange={(values) => {
                  setValue(attribute.attributeId as any, values.value)
                }}
                {...rest}
                value={value}
                disabled={disabled}
                label={`${attribute.attributeName!}` as string}
                max={attribute.validateNumericalValue?.maxValue || undefined}
                min={attribute.validateNumericalValue?.minValue || undefined}
                decimalScale={attribute.validateNumericalValue?.numberOfDecimal || undefined}
                size="small"
                error={!!fieldState.error?.message}
                helperText={fieldState.error?.message}
                customInput={TextField}
              />
            )}
          />
        )
      }
      return (
        <HBTextFieldController
          label={`${attribute.attributeName!}` as string}
          name={attribute.attributeId!}
          fullWidth
          type={isNumber ? 'number' : 'text'}
          InputLabelProps={{
            required: showRequiredStar,
          }}
          disabled={disabled}
          maskOptions={maskOptions}
          formRules={formRules}
        />
      )
    case AttributeDisplayType.TextMultiLine:
      return (
        <HBTextFieldController
          label={`${attribute.attributeName!}` as string}
          name={attribute.attributeId!}
          formRules={formRules}
          multiline
          InputLabelProps={{
            required: showRequiredStar,
          }}
          rows={3}
          disabled={disabled}
          maskOptions={undefined}
          fullWidth
          maxRows={4}
        />
      )
    case AttributeDisplayType.DropDownList: {
      if (AttributeDataType.DynamicList === attribute.displayDataType) {
        return <DynamicList attribute={attribute} hasFormRule={hasFormRule} disabled={disabled} />
      }
      return (
        <>
          <HBSelectController
            fullWidth
            required={showRequiredStar}
            disabled={disabled}
            showErrorMessage
            label={`${attribute.attributeName!}` as string}
            name={attribute.attributeId!}
            formRules={formRules}
            menuItem={items}
          />
          {isNew && (
            <HBTextField
              name={newFieldName}
              fullWidth
              maskOptions={maskOptions}
              value={newFieldValue}
              onChange={handleNewFieldChange}
              label={newFieldLabel}
            />
          )}
        </>
      )
    }
    case AttributeDisplayType.ListOfValueSS:
      return (
        <>
          <HBSelectController
            fullWidth
            disabled={disabled}
            required={showRequiredStar}
            showErrorMessage
            label={`${attribute.attributeName!}` as string}
            name={attribute.attributeId!}
            formRules={formRules}
            menuItem={items}
          />
          {isNew && (
            <HBTextField
              name={newFieldName}
              fullWidth
              maskOptions={maskOptions}
              value={newFieldValue}
              onChange={handleNewFieldChange}
              label={newFieldLabel}
            />
          )}
        </>
      )
    case AttributeDisplayType.ListOfValueMS:
      return (
        <>
          <HBSelectController
            fullWidth
            disabled={disabled}
            required={showRequiredStar}
            label={`${attribute.attributeName!}` as string}
            name={attribute.attributeId!}
            formRules={formRules}
            menuItem={multiSelectItems}
            multiple
            showErrorMessage
            onChange={(e) => {
              handleMultiSelectChange(e.target.value as string[])
            }}
          />
          {newMultiSelectItem && (
            <HBTextField
              name="newField"
              maskOptions={maskOptions}
              label={newFieldLabel}
              InputProps={{
                endAdornment: (
                  <IconButton onClick={handleAdd}>
                    <HBIcon
                      sx={{
                        color: 'primary.main',
                      }}
                      size="medium"
                      type={'plus'}
                    />
                  </IconButton>
                ),
              }}
              onChange={(event) => {
                setNewField(event.target.value)
              }}
              sx={{
                mb: 0,
              }}
              value={newField}
            />
          )}
        </>
      )
    case AttributeDisplayType.DateTimeSelection:
      return (
        <HBDateTimePickerController
          label={`${attribute.attributeName!}` as string}
          name={attribute.attributeId!}
          formRules={formRules}
          inputProps={{
            InputLabelProps: {
              required: showRequiredStar,
            },
          }}
          disabled={disabled}
        />
      )
    case AttributeDisplayType.DateSelection:
      return (
        <HBDatePickerController
          label={`${attribute.attributeName!}` as string}
          name={attribute.attributeId!}
          formRules={formRules}
          inputProps={{
            InputLabelProps: {
              required: showRequiredStar,
            },
          }}
          disabled={disabled}
        />
      )

    case AttributeDisplayType.RadioButton:
      return (
        <>
          <HBRadioController
            name={attribute.attributeId!}
            formRules={formRules}
            disabled={disabled}
            InputLabelProps={{
              required: showRequiredStar,
            }}
            label={`${attribute.attributeName}` as string}
            radioGroupItem={items}
          />
          {isNew && (
            <HBTextField
              label={newFieldLabel}
              name={newFieldName}
              fullWidth
              maskOptions={maskOptions}
              value={newFieldValue}
              onChange={handleNewFieldChange}
            />
          )}
        </>
      )

    case AttributeDisplayType.ButtonToggle:
      return (
        <>
          {convertStaticDataToSelectOptions(
            attribute.staticData!,
            canBeAddedByVendor,
            addTitle,
          ).map((item, index) => {
            return (
              <Stack
                justifyContent="space-between"
                direction="row"
                key={index}
                width={{
                  xs: '100%',
                  sm: 300,
                }}
              >
                <Typography component="label" variant="body1" color="text.primary">
                  {item.title}
                </Typography>
                <HBSwitchController
                  disabled={disabled}
                  formRules={
                    formRules
                      ? formRules
                      : {
                          required: false,
                        }
                  }
                  name={attribute.attributeId!}
                />
              </Stack>
            )
          })}
          {isNew && (
            <HBTextField
              name={attribute.attributeId}
              fullWidth
              maskOptions={maskOptions}
              value={newFieldValue}
              onChange={handleNewFieldChange}
              label={newFieldLabel}
            />
          )}
        </>
      )

    case AttributeDisplayType.CheckBox:
      return (
        <>
          <HBCheckboxController
            name={attribute.attributeId!}
            formRules={formRules}
            disabled={disabled}
            InputLabelProps={{
              required: showRequiredStar,
            }}
            label={`${attribute.attributeName}` as string}
            checkBoxItems={items}
          />
          {isNew && (
            <HBTextField
              name={attribute.attributeId}
              fullWidth
              maskOptions={maskOptions}
              value={newFieldValue}
              onChange={handleNewFieldChange}
              label={newFieldLabel}
            />
          )}
        </>
      )
    default:
      return (
        <>
          <HBTextFieldController
            label={`${attribute.attributeName!}` as string}
            name={attribute.attributeId!}
            fullWidth
            InputLabelProps={{
              required: showRequiredStar,
            }}
            disabled={disabled}
            formRules={formRules}
          />
          {isNew && (
            <HBTextField
              name={attribute.attributeId}
              fullWidth
              maskOptions={maskOptions}
              value={newFieldValue}
              onChange={handleNewFieldChange}
              label={newFieldLabel}
            />
          )}
        </>
      )
  }
}

export default memo(FormItem)

function convertStaticDataToSelectOptions(
  staticData: StaticDataModel[],
  canBeAddedByVendor: boolean,
  addTitle: string,
): Array<SelectItemType> {
  if (!staticData) {
    return []
  }
  const result: Array<SelectItemType> = [...staticData]
    .sort((a, b) => Number(a.sortOrder || 0) - Number(b.sortOrder))
    .map((item) => {
      return {
        title: item.value!,
        value: item.id!,
        color: item?.color || '',
        iconPath: item.iconPath || '',
      }
    })

  if (canBeAddedByVendor) {
    return [...result, { title: addTitle, value: addTitle, iconPath: '', color: '' }]
  }
  return result
}

export function getValue(
  values: ProductAttribute[],
  displayType: AttributeDisplayType,
): string | string[] {
  const singleValue = values[0]?.values?.[0] as string
  const multiValues = values[0]?.values as string[]

  switch (displayType) {
    case AttributeDisplayType.ListOfValueMS:
      return multiValues
    case AttributeDisplayType.CheckBox:
      return multiValues
    default:
      return singleValue
  }
}
