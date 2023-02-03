import { Autocomplete, AutocompleteProps, formHelperTextClasses, TextField } from '@mui/material'
import { forwardRef, Ref } from 'react'
import { HBTextFieldProps } from '../HBTextField'

export type HBAutocompleteProps<
  T,
  Multiple extends boolean | undefined,
  DisableClearable extends boolean | undefined,
  FreeSolo extends boolean | undefined,
> = Omit<AutocompleteProps<T, Multiple, DisableClearable, FreeSolo>, 'css' | 'ref'> & {
  renderInputProps?: HBTextFieldProps
}

const HBAutoComplete = forwardRef(
  <
    T,
    Multiple extends boolean | undefined,
    DisableClearable extends boolean | undefined,
    FreeSolo extends boolean | undefined,
  >(
    {
      disableClearable = true,
      renderInput = (params) => <TextField {...params} />,
      ...props
    }: HBAutocompleteProps<T, Multiple, DisableClearable, FreeSolo>,
    ref?: Ref<any>,
  ) => {
    return (
      <Autocomplete<T, Multiple, DisableClearable, FreeSolo>
        renderInput={renderInput}
        ref={ref}
        {...props}
        open={props.disabled ? false : props.open}
      />
    )
  },
)

HBAutoComplete.displayName = 'HBAutoComplete'
HBAutoComplete.defaultProps = {}

export default HBAutoComplete as <
  T,
  Multiple extends boolean | undefined,
  DisableClearable extends boolean | undefined,
  FreeSolo extends boolean | undefined,
>(
  props: HBAutocompleteProps<T, Multiple, DisableClearable, FreeSolo> & {
    ref?: Ref<HTMLFormElement>
  },
) => JSX.Element
