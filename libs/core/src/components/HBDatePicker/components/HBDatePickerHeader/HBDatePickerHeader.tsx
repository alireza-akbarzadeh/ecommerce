import { Stack, styled, Typography } from '@mui/material'
import { HBIcon } from '../../../HBIcon'
import { HBIconButton } from '../../../HBIconButton'
import { useUtils } from '../../hooks/useUtils'
import { ChangeMonthPayload } from '../dayPicker/useCalendarState'

interface IHBDatePickerHeader<TDate> {
  date: TDate
  monthClicked?: () => void
  yearClicked?: () => void
  monthChanged: (monthValue: ChangeMonthPayload<TDate>) => void
  yearChanged: (year: ChangeMonthPayload<TDate>) => void
}

const TextStyle = styled(Typography)(() => ({
  cursor: 'pointer',
}))

function HBDatePickerHeader<TDate>(props: IHBDatePickerHeader<TDate>) {
  const { date, monthClicked, yearClicked, monthChanged, yearChanged } = props
  const utils = useUtils<TDate>()

  const selectNextMonth = () =>
    monthChanged({ direction: 'right', newMonth: utils.getNextMonth(date) })
  const selectPreviousMonth = () =>
    monthChanged({ direction: 'left', newMonth: utils.getPreviousMonth(date) })

  const selectNextYear = () =>
    yearChanged({ newMonth: utils.addDays(date, 365), direction: 'right' })
  const selectPreviousYear = () =>
    yearChanged({ newMonth: utils.addDays(date, -365), direction: 'left' })

  return (
    <Stack direction="row" alignItems="center" justifyContent="center" spacing={1.5}>
      <HBIconButton onClick={selectPreviousYear} icon={<HBIcon type="angleDoubleRight" />} />
      <HBIconButton onClick={selectPreviousMonth} icon={<HBIcon type="angleRight" />} />

      <Stack spacing={0.5} direction="row" alignItems="center">
        <TextStyle onClick={monthClicked} variant="caption" color="text.primary">
          {utils.format(date, 'month')}
        </TextStyle>
        <TextStyle onClick={yearClicked} variant="caption" color="text.primary">
          {utils.format(date, 'year')}
        </TextStyle>
      </Stack>
      <HBIconButton onClick={selectNextMonth} icon={<HBIcon type="angleLeft" />} />
      <HBIconButton onClick={selectNextYear} icon={<HBIcon type="angleDoubleLeft" />} />
    </Stack>
  )
}

export default HBDatePickerHeader
