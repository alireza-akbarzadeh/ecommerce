import * as React from 'react'
import { MuiPickersAdapterContextValue } from '../LocalizationProvider'
import { useLocalizationContext } from './useUtils'

export interface ValidationProps<TError, TInputValue> {
  /**
   * Callback that fired when input value or new `value` prop validation returns **new** validation error (or value is valid after error).
   * In case of validation error detected `reason` prop return non-null value and `TextField` must be displayed in `error` state.
   * This can be used to render appropriate form error.
   *
   * [Read the guide](https://next.material-ui-pickers.dev/guides/forms) about form integration and error displaying.
   * @DateIOType
   *
   * @template TError, TInputValue
   * @param {TError} reason The reason why the current value is not valid.
   * @param {TInputValue} value The invalid value.
   */
  onError?: (reason: TError, value: TInputValue) => void
  value: TInputValue
}
type InferError<Props> = Props extends ValidationProps<infer TError, any> ? TError : never
type InferDate<Props> = Props extends ValidationProps<any, infer TDate> ? TDate : never

export type Validator<TDate, TProps> = (params: {
  adapter: MuiPickersAdapterContextValue<TDate>
  value: InferDate<TProps>
  props: Omit<TProps, 'value' | 'onError'>
}) => InferError<TProps>

export function useValidation<TDate, TProps extends ValidationProps<any, any>>(
  props: TProps,
  validate: Validator<TDate, TProps>,
  isSameError: (a: InferError<TProps>, b: InferError<TProps> | null) => boolean,
): InferError<TProps> {
  const { value, onError } = props
  const adapter = useLocalizationContext<TDate>()
  const previousValidationErrorRef = React.useRef<InferError<TProps> | null>(null)

  const validationError = validate({ adapter, value, props })

  React.useEffect(() => {
    if (onError && !isSameError(validationError, previousValidationErrorRef.current)) {
      onError(validationError, value)
    }

    previousValidationErrorRef.current = validationError
  }, [isSameError, onError, previousValidationErrorRef, validationError, value])

  return validationError
}

export type ExportedDateValidationProps<TDate> = DayValidationProps<TDate>

export interface DateValidationProps<TInputDate, TDate>
  extends ValidationProps<DateValidationError, TInputDate | null>,
    ExportedDateValidationProps<TDate> {}

export type DateValidationError =
  | 'invalidDate'
  | 'shouldDisableDate'
  | 'disableFuture'
  | 'disablePast'
  | 'minDate'
  | 'maxDate'
  | null

export const validateDate: Validator<any, DateValidationProps<any, any>> = ({
  props,
  value,
  adapter,
}): DateValidationError => {
  const now = adapter.utils.date()!
  const date = adapter.utils.date(value)

  const {
    shouldDisableDate,
    minDate = adapter.defaultDates.minDate,
    maxDate = adapter.defaultDates.maxDate,
    disableFuture,
    disablePast,
  } = props

  if (date === null) {
    return null
  }

  switch (true) {
    case !adapter.utils.isValid(value):
      return 'invalidDate'

    case Boolean(shouldDisableDate && shouldDisableDate(date)):
      return 'shouldDisableDate'

    case Boolean(disableFuture && adapter.utils.isAfterDay(date, now)):
      return 'disableFuture'

    case Boolean(disablePast && adapter.utils.isBeforeDay(date, now)):
      return 'disablePast'

    case Boolean(minDate && adapter.utils.isBeforeDay(date, minDate)):
      return 'minDate'

    case Boolean(maxDate && adapter.utils.isAfterDay(date, maxDate)):
      return 'maxDate'

    default:
      return null
  }
}

export const useIsDayDisabled = <TDate>({
  shouldDisableDate,
  minDate,
  maxDate,
  disableFuture,
  disablePast,
}: DayValidationProps<TDate>) => {
  const adapter = useLocalizationContext<TDate>()

  return React.useCallback(
    (day: TDate | null) =>
      validateDate({
        adapter,
        value: day,
        props: {
          shouldDisableDate,
          minDate,
          maxDate,
          disableFuture,
          disablePast,
        },
      }) !== null,
    [adapter, shouldDisableDate, minDate, maxDate, disableFuture, disablePast],
  )
}

const isSameDateError = (a: DateValidationError, b: DateValidationError) => a === b

export const useDateValidation = <TInputDate, TDate>(
  props: DateValidationProps<TInputDate, TDate>,
): DateValidationError => useValidation(props, validateDate, isSameDateError)

/**
 * Validation props common to all date views
 */
export interface BaseDateValidationProps<TDate> {
  /**
   * If `true` past days are disabled.
   * @default false
   */
  disablePast?: boolean
  /**
   * If `true` future days are disabled.
   * @default false
   */
  disableFuture?: boolean
  /**
   * Maximal selectable date. @DateIOType
   */
  maxDate?: TDate
  /**
   * Minimal selectable date. @DateIOType
   */
  minDate?: TDate
}

/**
 * Props used to validate a day value.
 */
export interface DayValidationProps<TDate> extends BaseDateValidationProps<TDate> {
  /**
   * Disable specific date. @DateIOType
   * @template TDate
   * @param {TDate} day The date to test.
   * @returns {boolean} Returns `true` if the date should be disabled.
   */
  shouldDisableDate?: (day: TDate) => boolean
}

/**
 * Props used to validate a month value
 */
export interface MonthValidationProps<TDate> extends BaseDateValidationProps<TDate> {
  /**
   * Disable specific months dynamically.
   * Works like `shouldDisableDate` but for month selection view @DateIOType.
   * @template TDate
   * @param {TDate} month The month to check.
   * @returns {boolean} If `true` the month will be disabled.
   */
  shouldDisableMonth?: (month: TDate) => boolean
}

/**
 * Props used to validate a year value
 */
export interface YearValidationProps<TDate> extends BaseDateValidationProps<TDate> {
  /**
   * Disable specific years dynamically.
   * Works like `shouldDisableDate` but for year selection view @DateIOType.
   * @template TDate
   * @param {TDate} year The year to test.
   * @returns {boolean} Returns `true` if the year should be disabled.
   */
  shouldDisableYear?: (year: TDate) => boolean
}
