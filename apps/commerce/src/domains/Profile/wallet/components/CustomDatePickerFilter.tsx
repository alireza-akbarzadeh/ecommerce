import AdapterDateFns from '@date-io/date-fns-jalali'
import { HBDatePicker } from '@hasty-bazar/core'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { IDateParams } from 'ag-grid-community'
import { forwardRef, useImperativeHandle, useRef, useState } from 'react'

const CustomDatePickerFilter = forwardRef<any, IDateParams>(({ onDateChanged }, ref) => {
  const dateRef = useRef<Date | null>(null)
  const [date, setDate] = useState<Date>(new Date())
  useImperativeHandle(ref, () => ({
    getDate() {
      return dateRef.current
    },

    setDate(date: Date) {
      dateRef.current = date
      setDate(date)
    },

    // setInputPlaceholder(placeholder: string) {
    //   if (refInput.current) {
    //     refInput.current.setAttribute('placeholder', placeholder)
    //   }
    // },

    // setInputAriaLabel(label: string) {
    //   if (refInput.current) {
    //     refInput.current.setAttribute('aria-label', label)
    //   }
    // },
  }))

  const onDateChnage = (date: Date) => {
    setDate(date)
    dateRef.current = date
    onDateChanged()
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <HBDatePicker value={date} onChange={onDateChnage} />
    </LocalizationProvider>
  )
})

export default CustomDatePickerFilter
