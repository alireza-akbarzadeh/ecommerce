import { Stack } from '@mui/material'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import * as React from 'react'
import { useNow, useUtils } from '../../hooks/useUtils'
import { DayValidationProps, useIsDayDisabled } from '../../hooks/useValidation'
import {
  PickersSlideTransition,
  SlideDirection,
  SlideTransitionProps,
} from '../PickersSlideTransition'
import { PickersDay, PickersDayProps } from './PickersDay/PickersDay'

export interface ExportedDayPickerProps<TDate>
  extends DayValidationProps<TDate>,
    Pick<PickersDayProps<TDate>, 'disableHighlightToday' | 'showDaysOutsideCurrentMonth'> {
  autoFocus?: boolean

  loading?: boolean

  renderDay?: (
    day: TDate,
    selectedDays: TDate[],
    pickersDayProps: PickersDayProps<TDate>,
  ) => JSX.Element

  renderLoading?: () => React.ReactNode
}

export interface DayPickerProps<TDate> extends ExportedDayPickerProps<TDate> {
  autoFocus?: boolean
  className?: string
  currentMonth: TDate
  selectedDays: (TDate | null)[]
  onSelectedDaysChange: (date: TDate) => void
  disabled?: boolean
  focusedDay: TDate | null
  isMonthSwitchingAnimating: boolean
  onFocusedDayChange: (newFocusedDay: TDate) => void
  onMonthSwitchingAnimationEnd: () => void
  readOnly?: boolean
  reduceAnimations: boolean
  slideDirection: SlideDirection
  TransitionProps?: Partial<SlideTransitionProps>
  customLabels?: string[]
}

const PickersCalendarWeekDayLabel = styled(Typography)(({ theme }) => ({
  width: 36,
  height: 40,
  textAlign: 'center',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  color: theme.palette.text.secondary,
  fontSize: '8px',
}))

const PickersCalendarLoadingContainer = styled('div')({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
})

const PickersCalendarSlideTransition = styled(PickersSlideTransition)({})

const PickersCalendarWeekContainer = styled('div')({ overflow: 'hidden' })

const PickersCalendarWeek = styled('div')({
  display: 'flex',
  justifyContent: 'center',
})
export function DayPicker<TDate>(props: DayPickerProps<TDate>) {
  const now = useNow<TDate>()
  const utils = useUtils<TDate>()
  const {
    autoFocus,
    onFocusedDayChange,
    className,
    currentMonth,
    selectedDays,
    disabled,
    disableHighlightToday,
    focusedDay,
    isMonthSwitchingAnimating,
    loading,
    onSelectedDaysChange,
    onMonthSwitchingAnimationEnd,
    readOnly,
    reduceAnimations,
    renderDay,
    renderLoading = () => <span data-mui-test="loading-progress">...</span>,
    showDaysOutsideCurrentMonth,
    slideDirection,
    TransitionProps,
    disablePast,
    disableFuture,
    minDate,
    maxDate,
    shouldDisableDate,
    customLabels,
  } = props

  const isDateDisabled = useIsDayDisabled({
    shouldDisableDate,
    minDate,
    maxDate,
    disablePast,
    disableFuture,
  })

  const handleDaySelect = React.useCallback(
    (day: TDate) => {
      if (readOnly) {
        return
      }

      onSelectedDaysChange(day)
    },
    [onSelectedDaysChange, readOnly],
  )

  const currentMonthNumber = utils.getMonth(currentMonth)
  const validSelectedDays = selectedDays
    .filter((day): day is TDate => !!day)
    .map((day) => utils.startOfDay(day))

  // need a new ref whenever the `key` of the transition changes: http://reactcommunity.org/react-transition-group/transition/#Transition-prop-nodeRef.
  const transitionKey = currentMonthNumber
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const slideNodeRef = React.useMemo(() => React.createRef<HTMLDivElement>(), [transitionKey])

  return (
    <React.Fragment>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="center"
        spacing={1}
        sx={{ width: 'min-content' }}
      >
        {(!customLabels ? utils.getWeekdays() : customLabels).map((day: any, i: any) => (
          <PickersCalendarWeekDayLabel
            sx={{ ...(!!customLabels && { width: 48 }) }}
            aria-hidden
            key={day + i.toString()}
            variant="caption"
          >
            {!customLabels ? day.charAt(0).toUpperCase() : day}
          </PickersCalendarWeekDayLabel>
        ))}
      </Stack>

      {loading ? (
        <PickersCalendarLoadingContainer>{renderLoading()}</PickersCalendarLoadingContainer>
      ) : (
        <PickersCalendarSlideTransition
          transKey={transitionKey}
          onExited={onMonthSwitchingAnimationEnd}
          reduceAnimations={reduceAnimations}
          slideDirection={slideDirection}
          className={className}
          {...TransitionProps}
          nodeRef={slideNodeRef}
        >
          <PickersCalendarWeekContainer
            data-mui-test="pickers-calendar"
            ref={slideNodeRef}
            role="grid"
          >
            {utils.getWeekArray(currentMonth).map((week: any) => (
              <PickersCalendarWeek role="row" key={`week-${week[0]}`}>
                {week.map((day: any) => {
                  const pickersDayProps: PickersDayProps<TDate> = {
                    // key: (day as any)?.toString(),
                    day,
                    isAnimating: isMonthSwitchingAnimating,
                    disabled: disabled || isDateDisabled(day),
                    // autoFocus: autoFocus && focusedDay !== null && utils.isSameDay(day, focusedDay),
                    today: utils.isSameDay(day, now),
                    outsideCurrentMonth: utils.getMonth(day) !== currentMonthNumber,
                    selected: validSelectedDays.some((selectedDay) =>
                      utils.isSameDay(selectedDay, day),
                    ),
                    disableHighlightToday,
                    showDaysOutsideCurrentMonth,
                    onDayFocus: onFocusedDayChange,
                    onDaySelect: handleDaySelect,
                  }

                  return renderDay ? (
                    renderDay(day, validSelectedDays, pickersDayProps)
                  ) : (
                    <div
                      role="cell"
                      // key={pickersDayProps.key}
                    >
                      <PickersDay
                        {...pickersDayProps}
                        sx={{
                          width: customLabels ? 48 : 36,
                          fontSize: '12px',
                          height: customLabels ? 48 : 36,
                          borderRadius: 2,
                        }}
                      />
                    </div>
                  )
                })}
              </PickersCalendarWeek>
            ))}
          </PickersCalendarWeekContainer>
        </PickersCalendarSlideTransition>
      )}
    </React.Fragment>
  )
}
