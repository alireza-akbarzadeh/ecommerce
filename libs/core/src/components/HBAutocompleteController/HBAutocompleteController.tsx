import {
  HBAutoComplete,
  HBAutocompleteProps,
  HBTextField,
  HBTextFieldProps,
} from '@hasty-bazar/core'
import { autocompleteClasses, Popper, styled } from '@mui/material'
import { forwardRef, ReactNode, useMemo } from 'react'
import {
  Controller,
  ControllerProps,
  FieldPath,
  FieldValues,
  RegisterOptions,
} from 'react-hook-form'
import ListBox from './ListBox'

const StyledPopper = styled(Popper)(({ theme }) => ({
  [`& .${autocompleteClasses.listbox}`]: {
    width: '100% !important',
    boxSizing: 'border-box',
    overflow: 'hidden',
    overflowY: 'auto',
    '& ul': {
      width: '100%',
      padding: 0,
      direction: 'ltr',
      listStyleType: 'none',
    },
  },
  [`& .${autocompleteClasses.option}`]: {
    paddingRight: '0 !important',
    paddingLeft: `${theme.spacing(1)} !important`,
  },
}))

export type AutoCompleteMenuItemDependency = {
  title?: ReactNode
  value?: string | number
  iconPath?: string
}

export interface IPaginationProps {
  totalItems: number
}

export interface HBAutocompleteControllerProps<
  FieldValueType extends FieldValues,
  AutoCompleteItemType extends object,
  Multiple extends boolean | undefined,
  DisableClearable extends boolean | undefined,
  FreeSolo extends boolean | undefined,
> extends Pick<
    HBAutocompleteProps<AutoCompleteItemType, Multiple, DisableClearable, FreeSolo>,
    'getOptionLabel' | 'isOptionEqualToValue'
  > {
  autoCompleteProps?: Omit<
    Partial<HBAutocompleteProps<AutoCompleteItemType, Multiple, DisableClearable, FreeSolo>>,
    'renderInput' | 'getOptionLabel' | 'isOptionEqualToValue' | 'options' | 'ListboxComponent'
  >
  controllerProps?: Partial<ControllerProps<FieldValueType>>
  textFiledProps?: Omit<HBTextFieldProps, 'value' | 'onChange'>
  fieldName: FieldPath<FieldValueType>
  formRules?: RegisterOptions
  label?: string
  required?: boolean
  valueExtractor?: (item: AutoCompleteItemType) => any
  disabled?: boolean
  options: AutoCompleteItemType[]
  paginationProps?: IPaginationProps
  startAdornment?: ReactNode
  endAdornment?: ReactNode
  groupBy?: (option: AutoCompleteItemType) => string
}

const HBAutocompleteController = <
  FieldValueType extends FieldValues,
  AutoCompleteItemType extends object,
  Multiple extends boolean = false,
  DisableClearable extends boolean = false,
  FreeSolo extends boolean = false,
>({
  fieldName,
  formRules,
  label,
  disabled,
  required = false,
  options,
  startAdornment,
  endAdornment,
  groupBy,
  valueExtractor,
  ...props
}: HBAutocompleteControllerProps<
  FieldValueType,
  AutoCompleteItemType,
  Multiple,
  DisableClearable,
  FreeSolo
>) => {
  const ListboxComponent = forwardRef(function ListboxComponent(args: any, ref) {
    return (
      <ListBox
        children={args?.children}
        paginationProps={props.paginationProps}
        ref={ref}
        {...args}
      />
    )
  })
  return (
    <Controller<FieldValueType>
      {...props?.controllerProps}
      name={fieldName}
      rules={{
        required,
        ...props?.controllerProps?.rules,
      }}
      render={({ field, fieldState }) => {
        const errorMessage = fieldState.error?.message
        const hasError = !!fieldState.error
        const otherValue = props.autoCompleteProps?.multiple ? [] : null
        const value =
          useMemo(() => {
            return typeof field.value === 'string' || typeof field.value === 'number'
              ? options.find((item) => props?.isOptionEqualToValue?.(item, field.value))
              : field.value
          }, [field.value, options]) || otherValue

        return (
          <HBAutoComplete<AutoCompleteItemType, Multiple, DisableClearable, FreeSolo>
            groupBy={groupBy}
            size="small"
            sx={props?.autoCompleteProps?.sx}
            {...field}
            value={value as unknown as any}
            {...props}
            getOptionLabel={props.getOptionLabel}
            isOptionEqualToValue={props.isOptionEqualToValue}
            options={options}
            PopperComponent={StyledPopper}
            ListboxComponent={props?.paginationProps ? ListboxComponent : undefined}
            onChange={(e, val, r, d) => {
              if (valueExtractor) {
                field.onChange(valueExtractor(val as unknown as AutoCompleteItemType))
              } else {
                field?.onChange(val)
              }
              props?.autoCompleteProps?.onChange?.(e, val, r, d)
            }}
            {...props?.autoCompleteProps}
            readOnly={disabled}
            renderInput={(params) => (
              <HBTextField
                {...params}
                {...props?.textFiledProps}
                InputProps={{
                  ...params.InputProps,
                  ...props?.textFiledProps?.InputProps,
                  endAdornment: (
                    <>
                      {params.InputProps?.endAdornment} {endAdornment}
                    </>
                  ),
                }}
                disabled={disabled}
                helperText={errorMessage}
                InputLabelProps={{ required, ...props?.textFiledProps?.InputLabelProps }}
                error={!!errorMessage || hasError}
                label={label}
              />
            )}
          />
        )
      }}
    />
  )
}

export default HBAutocompleteController
