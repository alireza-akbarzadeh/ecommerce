import { MobileDatePickerProps } from '@mui/lab'
import { useEffect, useState } from 'react'
import { DatePickerProps, HBDatePicker, ModeType } from '../HBDatePicker'
import { HBDialog, HBDialogProps } from '../HBDialog'
export type HBModalDatePickerProps<TDate = Date> = MobileDatePickerProps<TDate>

function HBModalDatePicker<TDate = Date>(props: DatePickerProps & HBDialogProps): JSX.Element {
  const { open, fullWidth, maxWidth, onClose, minDate, maxDate, value, onChange } = props
  const [date, setDate] = useState<Date>(value! ?? new Date())
  const [mode, setMode] = useState<ModeType>('day')

  useEffect(() => {
    if (value) {
      setDate(value)
    }
  }, [value])

  return (
    <HBDialog
      fullWidth={fullWidth}
      maxWidth={maxWidth}
      open={open}
      onClose={onClose}
      acceptBtn={mode === 'day' ? 'تایید' : undefined}
      rejectBtn={mode === 'day' ? 'انصراف' : undefined}
      hideCloseButton
      onAccept={() => {
        onChange(date)
        onClose!({}, 'backdropClick')
      }}
      onReject={() => {
        onClose!({}, 'backdropClick')
      }}
      sx={{
        '& .MuiDialogContent-root': {
          p: 0,
        },
      }}
    >
      <HBDatePicker
        viewChanged={setMode}
        maxDate={maxDate}
        minDate={minDate}
        value={date}
        onChange={setDate}
      />
    </HBDialog>
  )
}
HBModalDatePicker.displayName = 'HBModalDatePicker'
HBModalDatePicker.defaultProps = {}
export default HBModalDatePicker
