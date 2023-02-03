import { FormPatternsEnums } from '@hasty-bazar/admin-shared/core/enums/FormPatterns'
import validationsMessages from '@hasty-bazar-admin/core/translations/validations.messages'
import {
  GetFeatureDisplayTypesQueryResult,
  GetUnitOfMeasurementsQueryResultPagedCollectionQueryResultApiResult,
} from '@hasty-bazar/admin-shared/services/catalogApi.generated'
import { checkPositiveNumber } from '@hasty-bazar/admin-shared/utils/checkPositiveNumber'
import { HBTextFieldController } from '@hasty-bazar/auth'
import { HBAutocompleteController, HBIcon, HBSwitch, HBTag, HBTextField } from '@hasty-bazar/core'
import { Grid, IconButton, Typography } from '@mui/material'
import { ReactNode, SetStateAction, useEffect, useState } from 'react'
import { useFormContext, useWatch } from 'react-hook-form'
import { useIntl } from 'react-intl'
import attributesPageMessages from '../../Attributes.messages'
import { AttributeAddEditFormType } from '../../AttributesAddEditPage'
import { AttributeKindTypeCode, SelectBoxOptionsType } from '../AttributesAddEditForm'
import { TagsWrapper } from '../AttributesAddEditForm.styles'

type AttributeDisplayTypeCodesType = {
  title: ReactNode
  value: any
  iconPath?: ReactNode
  color?: string | undefined
}

export type AttributesFormType = {
  isLoading?: boolean
  AttributeKindTypeCodes: SelectBoxOptionsType
  disabledDataTypeCode: boolean
  AttributeDataTypeCodes: SelectBoxOptionsType
  handleChangeDataTypeCode?: (
    event: React.SyntheticEvent<Element, Event>,
    newValue: { title: ReactNode; value: any },
  ) => void
  dataTypeEnum: number | undefined
  AttributeDisplayTypeCodes: SelectBoxOptionsType
  AttributeGroupTypeCodes: GetFeatureDisplayTypesQueryResult[]
  ProductDisplayKindCodes: SelectBoxOptionsType
  ProductDisplayTypeCodes: SelectBoxOptionsType
  canBeAddedByVendor?: boolean
  unitOfMeasurementData: GetUnitOfMeasurementsQueryResultPagedCollectionQueryResultApiResult
  isCountable: boolean
  minValue: string | number | null | undefined
  maxValue: string | number | null | undefined
  handleAdd: () => void
  setTag: (value: SetStateAction<string>) => void
  defultTag: string[] | undefined
  handleRemove: (index: number) => void
  tag: string
  relatedSelectedData: {
    value: string
    title: string
  }[]
}

const dataTypeBusinessType = {
  Integer: '1017001',
  Date: '1017002',
  FixedList: '1017003',
  DynamicList: '1017004',
  Text: '1017005',
  Decimal: '1017006',
  Color: '1017007',
  Money: '1017008',
  Logical: '1017009',
  Function: '1017010',
  Tokenized: '1017011',
  Programmable: '1017012',
  Hierarchy: '1017013',
}

const displayTypeBusinessType = {
  TextSingleLine: '1018001',
  TextMultiLine: '1018002',
  DropDownList: '1018003',
  ListOfValueSS: '1018004',
  ListOfValueMS: '1018005',
  DateSelection: '1018006',
  DateTimeSelection: '1018007',
  RadioButton: '1018008',
  CheckBox: '1018009',
  ButtonToggle: '1018010',
}

export default function AttributesForm({
  isLoading,
  AttributeKindTypeCodes,
  disabledDataTypeCode,
  AttributeDataTypeCodes,
  handleChangeDataTypeCode,
  dataTypeEnum,
  AttributeDisplayTypeCodes,
  AttributeGroupTypeCodes,
  ProductDisplayKindCodes,
  ProductDisplayTypeCodes,
  canBeAddedByVendor,
  isCountable,
  minValue,
  maxValue,
  handleAdd,
  setTag,
  defultTag,
  handleRemove,
  tag,
  relatedSelectedData,
}: AttributesFormType) {
  const { setValue, control } = useFormContext<AttributeAddEditFormType>()
  const { dataTypeEnum: dataTypeEnumWatch, displayType } = useWatch({
    control,
  })

  const [AttributeDisplayTypeCodesData, setAttributeDisplayTypeCodesData] =
    useState(AttributeDisplayTypeCodes)

  const { formatMessage } = useIntl()

  const isEmptyServerValue = (displayTypes: AttributeDisplayTypeCodesType[]) =>
    displayTypes.find((item) => item.value === displayType?.value) === undefined

  useEffect(() => {
    let displayTypes: AttributeDisplayTypeCodesType[] = []
    switch (dataTypeEnumWatch?.value) {
      case dataTypeBusinessType.Logical:
        displayTypes = AttributeDisplayTypeCodes.filter(
          (item) => item.value === displayTypeBusinessType.RadioButton,
        )
        isEmptyServerValue(displayTypes) &&
          setValue(
            'displayType',
            displayTypes.find((item) => item.value === displayTypeBusinessType.RadioButton),
          )
        break

      case dataTypeBusinessType.Color:
        displayTypes = AttributeDisplayTypeCodes.filter(
          (item) => item.value === displayTypeBusinessType.RadioButton,
        )
        isEmptyServerValue(displayTypes) &&
          setValue(
            'displayType',
            displayTypes.find((item) => item.value === displayTypeBusinessType.RadioButton),
          )
        break

      case dataTypeBusinessType.Decimal:
        displayTypes = AttributeDisplayTypeCodes.filter(
          (item) => item.value === displayTypeBusinessType.TextSingleLine,
        )
        isEmptyServerValue(displayTypes) &&
          setValue(
            'displayType',
            displayTypes.find((item) => item.value === displayTypeBusinessType.TextSingleLine),
          )
        break

      case dataTypeBusinessType.Integer:
        displayTypes = AttributeDisplayTypeCodes.filter(
          (item) => item.value === displayTypeBusinessType.TextSingleLine,
        )
        isEmptyServerValue(displayTypes) &&
          setValue(
            'displayType',
            displayTypes.find((item) => item.value === displayTypeBusinessType.TextSingleLine),
          )
        break

      case dataTypeBusinessType.Text:
        displayTypes = AttributeDisplayTypeCodes.filter(
          (item) =>
            item.value === displayTypeBusinessType.TextMultiLine ||
            item.value === displayTypeBusinessType.TextSingleLine,
        )
        isEmptyServerValue(displayTypes) &&
          setValue(
            'displayType',
            displayTypes.find((item) => item.value === displayTypeBusinessType.TextSingleLine),
          )
        break

      case dataTypeBusinessType.FixedList:
        displayTypes = AttributeDisplayTypeCodes.filter(
          (item) =>
            item.value === displayTypeBusinessType.ListOfValueMS ||
            item.value === displayTypeBusinessType.DropDownList,
        )
        isEmptyServerValue(displayTypes) &&
          setValue(
            'displayType',
            displayTypes.find((item) => item.value === displayTypeBusinessType.DropDownList),
          )
        break

      case dataTypeBusinessType.DynamicList:
        displayTypes = AttributeDisplayTypeCodes.filter(
          (item) => item.value === displayTypeBusinessType.DropDownList,
        )
        isEmptyServerValue(displayTypes) &&
          setValue(
            'displayType',
            displayTypes.find((item) => item.value === displayTypeBusinessType.DropDownList),
          )
        break

      case dataTypeBusinessType.Date:
        displayTypes = AttributeDisplayTypeCodes.filter(
          (item) => item.value === displayTypeBusinessType.DateSelection,
        )
        isEmptyServerValue(displayTypes) &&
          setValue(
            'displayType',
            displayTypes.find((item) => item.value === displayTypeBusinessType.DateSelection),
          )
        break

      case dataTypeBusinessType.Money:
        displayTypes = AttributeDisplayTypeCodes.filter(
          (item) => item.value === displayTypeBusinessType.TextSingleLine,
        )
        isEmptyServerValue(displayTypes) &&
          setValue(
            'displayType',
            displayTypes.find((item) => item.value === displayTypeBusinessType.TextSingleLine),
          )
        break

      default:
        setValue('displayType', '')
        break
    }

    if (displayTypes.length > 0) {
      setAttributeDisplayTypeCodesData(displayTypes || [])
    } else {
      setAttributeDisplayTypeCodesData(AttributeDisplayTypeCodes)
    }
  }, [dataTypeEnumWatch])

  return (
    <Grid container spacing={6}>
      <Grid item xs={12} md={3}>
        <HBAutocompleteController
          label={formatMessage(attributesPageMessages.attributesType)}
          fieldName="kindType"
          isOptionEqualToValue={(o, v) => o.value == v.value}
          getOptionLabel={(option) => `${option.title}`}
          options={AttributeKindTypeCodes}
          formRules={{ required: false }}
          autoCompleteProps={{
            disabled: isLoading,
          }}
        />
      </Grid>
      <Grid item xs={12} md={3}>
        <HBTextFieldController
          required
          formRules={{
            required: true,
            maxLength: 20,
            minLength: {
              value: 4,
              message: formatMessage(validationsMessages.minLengthValidation, { count: 4 }),
            },
          }}
          type="number"
          label={formatMessage(attributesPageMessages.attributesCode)}
          name={'code'}
        />
      </Grid>
      <Grid item xs={12} md={3}>
        <HBTextFieldController
          required
          formRules={{ required: true, maxLength: 150 }}
          name={'name' as keyof AttributeAddEditFormType}
          label={formatMessage(attributesPageMessages.attributesTitle)}
        />
      </Grid>
      <Grid item xs={12} md={3}>
        <HBTextFieldController
          required
          formRules={{
            required: true,
            maxLength: 150,
            pattern: new RegExp(FormPatternsEnums.EnText),
          }}
          name={'orginName' as keyof AttributeAddEditFormType}
          label={formatMessage(attributesPageMessages.originName)}
        />
      </Grid>
      <Grid item xs={12} md={3}>
        <HBAutocompleteController
          label={formatMessage(attributesPageMessages.attributesDataType)}
          fieldName="dataTypeEnum"
          isOptionEqualToValue={(o, v) => o.value == v.value}
          getOptionLabel={(option) => `${option.title}`}
          options={AttributeDataTypeCodes}
          formRules={{ required: true }}
          autoCompleteProps={{
            disabled: isLoading || disabledDataTypeCode,
            onChange: handleChangeDataTypeCode,
            blurOnSelect: true,
          }}
          required
        />
      </Grid>
      <Grid item xs={12} md={3}>
        <HBAutocompleteController
          label={formatMessage(attributesPageMessages.attributesRelationTable)}
          fieldName="businessEntityId"
          isOptionEqualToValue={(o, v) => o.value == v.value}
          getOptionLabel={(option) => `${option.title}`}
          options={relatedSelectedData}
          formRules={{ required: false }}
          autoCompleteProps={{
            disabled: dataTypeEnum != AttributeKindTypeCode.DynamicList,
          }}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <HBTextFieldController
          sx={{ flex: 1 }}
          name={'whereCondition' as keyof AttributeAddEditFormType}
          formRules={{ required: false, maxLength: 4000 }}
          label={formatMessage(attributesPageMessages.attributesConditionalsFilter)}
          disabled={dataTypeEnum != AttributeKindTypeCode.DynamicList}
        />
      </Grid>
      <Grid item xs={12} md={3}>
        <HBTextFieldController
          formRules={{ required: false, max: maxValue || 100, min: 0 }}
          name={'minValue'}
          disabled={!isCountable}
          label={formatMessage(attributesPageMessages.attributesMinValue)}
          type="number"
          onInput={checkPositiveNumber}
        />
      </Grid>
      <Grid item xs={12} md={3}>
        <HBTextFieldController
          name={'maxValue'}
          label={formatMessage(attributesPageMessages.attributesMaxValue)}
          type={'number'}
          disabled={!isCountable}
          formRules={{ required: false, min: minValue || 0 }}
          onInput={checkPositiveNumber}
        />
      </Grid>
      <Grid item xs={12} md={3}>
        <HBTextFieldController
          disabled={
            dataTypeEnum != AttributeKindTypeCode.Money &&
            dataTypeEnum != AttributeKindTypeCode.Decimal
          }
          type="number"
          formRules={{ required: false }}
          label={formatMessage(attributesPageMessages.attributesNumberOfDecimals)}
          name={'numberOfDecimal'}
          onInput={checkPositiveNumber}
        />
      </Grid>
      <Grid
        item
        xs={12}
        md={3}
        justifyContent="space-between"
        sx={{ display: 'flex', alignItems: 'center' }}
      >
        <Typography component="label" variant="body1" color="text.primary">
          {formatMessage(attributesPageMessages.attributesAbilityToAddWithCustomer)}
        </Typography>
        <HBSwitch
          checked={Boolean(canBeAddedByVendor)}
          onChange={(event, value) => setValue('canBeAddedByVendor', value)}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <HBTextFieldController
          name={'displayTitleBefore' as keyof AttributeAddEditFormType}
          formRules={{ required: false, maxLength: 4000 }}
          label={formatMessage(attributesPageMessages.attributesShowTitleBeforeData)}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <HBTextFieldController
          name={'displayTitleAfter' as keyof AttributeAddEditFormType}
          formRules={{ required: false, maxLength: 4000 }}
          label={formatMessage(attributesPageMessages.attributesShowTitleAfterData)}
        />
      </Grid>
      <Grid item xs={12} md={3}>
        <HBAutocompleteController
          label={formatMessage(attributesPageMessages.attributesDisplayMode)}
          fieldName="displayType"
          isOptionEqualToValue={(o, v) => o.value == v.value}
          getOptionLabel={(option) => `${option.title}`}
          options={AttributeDisplayTypeCodesData}
          formRules={{ required: true }}
          required
        />
      </Grid>
      <Grid item xs={12} md={3}>
        <HBAutocompleteController
          label={formatMessage(attributesPageMessages.attributesDemonstrationCategory)}
          fieldName="groupTypeCode"
          isOptionEqualToValue={(o, v) => o.id == v.id}
          getOptionLabel={(option) => `${option.title}`}
          options={AttributeGroupTypeCodes || []}
        />
      </Grid>
      <Grid item xs={12} md={3}>
        <HBAutocompleteController
          label={formatMessage(attributesPageMessages.attributesProductDisplayKind)}
          fieldName="productDisplayKind"
          isOptionEqualToValue={(o, v) => o.value == v.value}
          getOptionLabel={(option) => `${option.title}`}
          options={ProductDisplayKindCodes}
        />
      </Grid>
      <Grid item xs={12} md={3}>
        <HBAutocompleteController
          label={formatMessage(attributesPageMessages.attributesProductDisplayType)}
          fieldName="productDisplayType"
          isOptionEqualToValue={(o, v) => o.value == v.value}
          getOptionLabel={(option) => `${option.title}`}
          options={ProductDisplayTypeCodes}
        />
      </Grid>
      <Grid item xs={12} md={12}>
        <HBTextField
          fullWidth
          name="tag"
          label={formatMessage(attributesPageMessages.attributesDefaultTags)}
          InputProps={{
            endAdornment: (
              <IconButton onClick={handleAdd}>
                <HBIcon sx={{ color: 'primary.main' }} size="medium" type={'plus'} />
              </IconButton>
            ),
          }}
          onChange={(event) => {
            setTag(event.target.value)
          }}
          sx={{ mb: 0 }}
          value={tag}
        />
        <TagsWrapper direction="row" mt={2} gap={2}>
          {defultTag?.map((tag, index) => {
            return (
              <HBTag
                key={String(index + tag)}
                label={tag}
                onDelete={() => handleRemove(index)}
                variant="outlined"
                clickable
              />
            )
          })}
        </TagsWrapper>
      </Grid>
    </Grid>
  )
}
