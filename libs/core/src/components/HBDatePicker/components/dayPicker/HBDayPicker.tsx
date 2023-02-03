export const DAY_SIZE = 36
export const DAY_MARGIN = 2
export const DIALOG_WIDTH = 320
export const VIEW_HEIGHT = 358

const PickerViewRoot = styled('div')({
  overflowX: 'hidden',
  width: 'auto',
  maxHeight: VIEW_HEIGHT,
  display: 'flex',
  flexDirection: 'column',
  margin: '0 auto',
})

import { CalendarPickerClasses, CalendarPickerView } from '@mui/lab'
import { styled, useThemeProps } from '@mui/material/styles'
import * as React from 'react'
import { useDefaultDates, useUtils } from '../../hooks/useUtils'
import {
  BaseDateValidationProps,
  MonthValidationProps,
  YearValidationProps,
} from '../../hooks/useValidation'
import { HBDatePickerHeader } from '../HBDatePickerHeader'
import { DayPicker, DayPickerProps, ExportedDayPickerProps } from './DayPicker'
import { useCalendarState } from './useCalendarState'

export interface CalendarPickerProps<TDate>
  extends ExportedDayPickerProps<TDate>,
    YearValidationProps<TDate>,
    MonthValidationProps<TDate> {
  className?: string
  classes?: Partial<CalendarPickerClasses>

  date: TDate | null

  defaultCalendarMonth?: TDate
  disabled?: boolean
  onViewChange?: (view: CalendarPickerView) => void
  onChange: (date: TDate) => void
  openTo?: CalendarPickerView
  readOnly?: boolean
  reduceAnimations?: boolean
  renderLoading?: () => React.ReactNode
  shouldDisableDate?: (day: TDate) => boolean
  view?: CalendarPickerView
  views?: readonly CalendarPickerView[]
  onYearChange?: (year: TDate) => void
  onMonthChange?: (month: TDate) => void | Promise<void>
  monthClick?: () => void
  yearClick?: () => void
}

export type ExportedCalendarPickerProps<TDate> = Omit<
  CalendarPickerProps<TDate>,
  | 'date'
  | 'view'
  | 'views'
  | 'openTo'
  | 'onChange'
  | 'changeView'
  | 'slideDirection'
  | 'currentMonth'
  | 'className'
  | 'classes'
  | 'components'
  | 'componentsProps'
>

const CalendarPickerRoot = styled(PickerViewRoot, {
  name: 'MuiCalendarPicker',
  slot: 'Root',
  overridesResolver: (props, styles) => styles['root'],
})<{ ownerState: CalendarPickerProps<any> }>({
  display: 'flex',
  flexDirection: 'column',
})

type CalendarPickerComponent = (<TDate>(
  props: CalendarPickerProps<TDate> & React.RefAttributes<HTMLDivElement>,
) => JSX.Element) & { propTypes?: any }

const HBDayPicker = React.forwardRef(function CalendarPicker<TDate>(
  inProps: CalendarPickerProps<TDate>,
  ref: React.Ref<HTMLDivElement>,
) {
  const utils = useUtils<TDate>()
  const defaultDates = useDefaultDates<TDate>()

  const props = useThemeProps({
    props: inProps,
    name: 'MuiCalendarPicker',
  })

  const {
    autoFocus,
    onViewChange,
    date,
    disableFuture,
    disablePast,
    defaultCalendarMonth,
    loading = false,
    onChange,
    onYearChange,
    onMonthChange,
    reduceAnimations = typeof navigator !== 'undefined' && /(android)/i.test(navigator.userAgent),
    renderLoading = () => <span data-mui-test="loading-progress">...</span>,
    shouldDisableDate,
    shouldDisableMonth,
    shouldDisableYear,
    view,
    views = ['year', 'day'],
    openTo = 'day',
    className,
    disabled,
    readOnly,
    minDate = defaultDates.minDate,
    maxDate = defaultDates.maxDate,
    yearClick,
    monthClick,
    ...other
  } = props

  const {
    calendarState,
    changeFocusedDay,
    changeMonth,
    isDateDisabled,
    onMonthSwitchingAnimationEnd,
    handleChangeMonth,
  } = useCalendarState<TDate>({
    date,
    defaultCalendarMonth,
    reduceAnimations,
    onMonthChange,
    minDate,
    maxDate,
    shouldDisableDate,
    disablePast,
    disableFuture,
  })

  const onSelectedDayChange = React.useCallback<DayPickerProps<TDate>['onSelectedDaysChange']>(
    (day: TDate) => {
      if (date && day) {
        // If there is a date already selected, then we want to keep its time
        return onChange(utils.mergeDateAndTime(day, date))
      }

      return onChange(day)
    },
    [utils, date, onChange],
  )

  React.useEffect(() => {
    if (date) {
      changeMonth(date)
    }
  }, [date])

  const ownerState = props

  const baseDateValidationProps: BaseDateValidationProps<TDate> = {
    disablePast,
    disableFuture,
    maxDate,
    minDate,
  }

  return (
    <CalendarPickerRoot ref={ref} ownerState={ownerState} sx={{ paddingTop: 4 }}>
      <HBDatePickerHeader<TDate>
        date={calendarState.currentMonth}
        monthChanged={(month) => {
          handleChangeMonth({ direction: month.direction, newMonth: month.newMonth })
        }}
        yearChanged={(year) =>
          handleChangeMonth({ direction: year.direction, newMonth: year.newMonth })
        }
        monthClicked={monthClick}
        yearClicked={yearClick}
      />
      <DayPicker<TDate>
        {...other}
        {...calendarState}
        {...baseDateValidationProps}
        autoFocus={autoFocus}
        onMonthSwitchingAnimationEnd={onMonthSwitchingAnimationEnd}
        onFocusedDayChange={changeFocusedDay}
        reduceAnimations={reduceAnimations}
        selectedDays={[date]}
        onSelectedDaysChange={onSelectedDayChange}
        loading={loading}
        renderLoading={renderLoading}
        disabled={disabled}
        readOnly={readOnly}
        shouldDisableDate={shouldDisableDate}
        customLabels={['شنبه', 'یک شنبه', 'دو شنبه', 'سه شنبه', 'چهار شنبه', 'پنج شنبه', 'جمعه']}
      />
    </CalendarPickerRoot>
  )
}) as CalendarPickerComponent

export default HBDayPicker
