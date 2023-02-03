import { styled, Theme, useThemeProps } from '@mui/material/styles'
import { SxProps } from '@mui/system'
import * as React from 'react'
import { useDefaultDates, useNow, useUtils } from '../../hooks/useUtils'
import { MonthValidationProps } from '../../hooks/useValidation'
import { PickersMonth } from './PickersMonth'

export interface MonthPickerProps<TDate> extends MonthValidationProps<TDate> {
  className?: string
  date: TDate | null
  disabled?: boolean
  onChange: (date: TDate) => void
  readOnly?: boolean
  sx?: SxProps<Theme>
}
const MonthPickerRoot = styled('div', {
  name: 'MuiMonthPicker',
  slot: 'Root',
  overridesResolver: (props, styles) => styles['root'],
})<{ ownerState: MonthPickerProps<any> }>({
  width: 360,
  display: 'flex',
  flexWrap: 'wrap',
  alignContent: 'stretch',
  margin: '0 4px',
})

type MonthPickerComponent = (<TDate>(
  props: MonthPickerProps<TDate> & React.RefAttributes<HTMLDivElement>,
) => JSX.Element) & { propTypes?: any }

const HBMonthPicker = React.forwardRef(function MonthPicker<TDate>(
  inProps: MonthPickerProps<TDate>,
  ref: React.Ref<HTMLDivElement>,
) {
  const utils = useUtils<TDate>()
  const now = useNow<TDate>()
  const defaultDates = useDefaultDates<TDate>()

  const props = useThemeProps<Theme, MonthPickerProps<TDate>, 'MuiMonthPicker'>({
    props: inProps,
    name: 'MuiMonthPicker',
  })

  const {
    className,
    date: propDate,
    disabled,
    disableFuture,
    disablePast,
    maxDate = defaultDates.maxDate,
    minDate = defaultDates.minDate,
    onChange,
    shouldDisableMonth,
    readOnly,
    ...other
  } = props
  const ownerState = props

  const currentDate = propDate ?? now
  const currentMonth = utils.getMonth(currentDate)

  const isMonthDisabled = (month: TDate) => {
    const firstEnabledMonth = utils.startOfMonth(
      disablePast && utils.isAfter(now, minDate) ? now : minDate,
    )

    const lastEnabledMonth = utils.startOfMonth(
      disableFuture && utils.isBefore(now, maxDate) ? now : maxDate,
    )

    if (utils.isBefore(month, firstEnabledMonth)) {
      return true
    }

    if (utils.isAfter(month, lastEnabledMonth)) {
      return true
    }

    if (!shouldDisableMonth) {
      return false
    }

    return shouldDisableMonth(month)
  }

  const onMonthSelect = (month: number) => {
    if (readOnly) {
      return
    }

    const newDate = utils.setMonth(currentDate, month)
    onChange(newDate)
  }

  return (
    <MonthPickerRoot ref={ref} ownerState={ownerState} {...other}>
      {utils.getMonthArray(currentDate).map((month: TDate) => {
        const monthNumber = utils.getMonth(month)
        const monthText = utils.format(month, 'month')

        return (
          <PickersMonth
            key={monthText}
            value={monthNumber}
            selected={monthNumber === currentMonth}
            onSelect={onMonthSelect}
            disabled={disabled || isMonthDisabled(month)}
          >
            {monthText}
          </PickersMonth>
        )
      })}
    </MonthPickerRoot>
  )
}) as MonthPickerComponent

export default HBMonthPicker
