import { Theme } from '@mui/material'
import { SxProps } from '@mui/system'
import React, { forwardRef, ReactElement } from 'react'
import {
  FormProvider,
  SubmitErrorHandler,
  SubmitHandler,
  useForm,
  UseFormProps,
  UseFormReturn,
} from 'react-hook-form'
import { HBFormRootStyle } from './HBForm.styles'
// declare module 'react' {
//   function forwardRef<T, P>(
//     render: (props: P, ref: React.Ref<T>) => React.ReactElement | null,
//   ): (props: P & React.RefAttributes<T>) => React.ReactElement | null
// }

type functionalChildren<T> = (props: UseFormReturn<T>) => JSX.Element
type children<T> = ReactElement<UseFormReturn> | functionalChildren<T>
type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>
type HBUseFormProps<T> = Optional<
  UseFormReturn<T>,
  | 'clearErrors'
  | 'control'
  | 'formState'
  | 'getFieldState'
  | 'getValues'
  | 'handleSubmit'
  | 'register'
  | 'reset'
  | 'resetField'
  | 'setError'
  | 'setFocus'
  | 'setValue'
  | 'trigger'
  | 'unregister'
  | 'watch'
>
export type HBFormFCProps<T extends object> = (props: HBUseFormProps<T>) => JSX.Element

export type HBFormProps<T> = {
  children?: children<T>[] | children<T>
  style?: React.CSSProperties
  onSubmit: SubmitHandler<T>
  id?: string
  onInvalid?: SubmitErrorHandler<T>
  sx?: SxProps<Theme>
  formProviderProps?: UseFormReturn<T, any>
} & UseFormProps<T>

function _HBForm<T>(props: HBFormProps<T>, ref: React.ForwardedRef<HTMLFormElement>) {
  const { children, style, onSubmit, onInvalid, formProviderProps, sx, id, ...useFormProps } = props
  const Form = formProviderProps
    ? formProviderProps
    : useForm<T>({
        ...useFormProps,
        mode: useFormProps.mode || 'onBlur',
      })

  const getChild = <T,>(item: T) => {
    if (typeof item === 'function') {
      return item(Form)
    } else return item
  }
  const newChild = () => {
    if (children && Array.isArray(children))
      return children.map((item) => getChild<children<T>>(item))
    else if (children) return getChild(children)
    else return null
  }

  return (
    <FormProvider {...Form}>
      <HBFormRootStyle
        sx={{ ...style, ...sx }}
        ref={ref}
        id={id}
        onSubmit={Form.handleSubmit(onSubmit, onInvalid)}
      >
        {newChild()}
      </HBFormRootStyle>
    </FormProvider>
  )
}

const HBForm = forwardRef(_HBForm) as <T>(
  props: HBFormProps<T> & { ref?: React.ForwardedRef<HTMLFormElement> },
) => ReturnType<typeof _HBForm>

export default HBForm
