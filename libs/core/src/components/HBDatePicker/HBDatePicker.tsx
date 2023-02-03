import { YearPicker, YearPickerProps } from '@mui/x-date-pickers'
import { Stack } from '@mui/material'
import { styled } from '@mui/system'
import { FC, useEffect, useRef, useState } from 'react'
import { HBDayPicker, HBMonthPicker } from './components'

export type ModeType = 'day' | 'month' | 'year'

type CustomPickerYearProps = YearPickerProps<Date | null>

const CustomPickersYear = styled(YearPicker, {
  shouldForwardProp: (prop) => true,
})<CustomPickerYearProps>(({ theme }) => ({
  '&.MuiYearPicker-root': {
    width: '100%',
    '& .PrivatePickersYear-root': {
      '& button': {
        width: 86,
        height: 40,
        '&.Mui-selected': {
          borderRadius: 8,
        },
      },
    },
  },
})) as React.ComponentType<CustomPickerYearProps>

export interface DatePickerProps {
  views?: Array<'day' | 'month' | 'year'>
  onChange: (date: Date) => void
  value?: Date | null
  minDate?: Date
  maxDate?: Date
  viewChanged?: (view: ModeType) => void
}

const HBDatePicker: FC<DatePickerProps> = (props) => {
  const { onChange, views, value = null, minDate = null, maxDate = null, viewChanged } = props
  const [date, setDate] = useState<Date | null>(value ?? new Date())
  const [mode, setMode] = useState<ModeType>('day')
  const dayPickerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (value) {
      setDate(value)
    }
  }, [value])

  useEffect(() => {
    if (viewChanged) viewChanged(mode)
  }, [mode])

  return (
    <Stack alignItems="center" justifyContent="center">
      <Stack alignItems="center" justifyContent="center">
        {mode === 'day' && (
          <HBDayPicker<Date | null>
            ref={dayPickerRef}
            date={date}
            onChange={(newDate) => {
              setDate(date)
              onChange(newDate as Date)
            }}
            showDaysOutsideCurrentMonth
            minDate={minDate}
            maxDate={maxDate}
            monthClick={() => setMode('month')}
            yearClick={() => setMode('year')}
          />
        )}
        {mode === 'month' && (
          <HBMonthPicker<Date | null>
            minDate={minDate}
            maxDate={maxDate}
            onChange={(newDate) => {
              if (!(!!views && !views?.includes('day'))) {
                setDate(newDate)
                setMode('day')
              }
              onChange(newDate as Date)
            }}
            date={date}
          />
        )}
        {mode === 'year' && (
          <Stack alignItems="center" justifyContent="center" sx={{ maxHeight: 230, width: 360 }}>
            <CustomPickersYear
              date={date}
              isDateDisabled={() => false}
              minDate={minDate || new Date(new Date().getFullYear() - 100, 1, 1)}
              maxDate={maxDate || new Date(new Date().getFullYear() + 100, 12, 31)}
              autoFocus
              onChange={(newDate) => {
                if (!(!!views && !views?.includes('month'))) {
                  setDate(newDate)
                  setMode('month')
                }
                onChange(newDate as Date)
              }}
            />
          </Stack>
        )}
      </Stack>
    </Stack>
  )
}

export default HBDatePicker
