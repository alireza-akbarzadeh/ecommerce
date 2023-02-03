import HBCommerceDateRangePicker from '@hasty-bazar-commerce/components/HBCommerceDateRangePicker/HBCommerceDateRangePicker'
import SearchMessages from '@hasty-bazar-commerce/domains/Search/Search.messages'
import {
  removeFilterItem,
  replaceFilterItem,
} from '@hasty-bazar-commerce/domains/Search/SearchFilter.reducer'
import { IFilterItems } from '@hasty-bazar-commerce/domains/Search/searchFilterModels'
import { ProductFilter } from '@hasty-bazar-commerce/services/generalDataApi.generated'
import { Stack, SxProps, useTheme } from '@mui/material'
import { Theme } from '@mui/system'
import { DateRange } from '@mui/x-date-pickers-pro'
import { FC, memo, useEffect, useState } from 'react'
import { useIntl } from 'react-intl'
import { useDispatch } from 'react-redux'

interface IProps {
  item: IFilterItems
  filterName: string
  submitFilters(v: IFilterItems): void
  selectedFilters: ProductFilter
}

const DateFilter: FC<IProps> = (props) => {
  const { palette } = useTheme()
  const dispatch = useDispatch()
  const { formatMessage } = useIntl()
  const [date, setDate] = useState<DateRange<Date>>([null, null])

  const handleSubmit = (value: DateRange<Date>) => {
    if (value[0] && value[1]) {
      const itemValue: IFilterItems = {
        ...props.item,
        filterItemTitle: `${formatMessage(SearchMessages.from)} ${value[0].toLocaleString('fa-IR', {
          dateStyle: 'short',
        })} ${formatMessage(SearchMessages.until)} ${value[1].toLocaleString('fa-IR', {
          dateStyle: 'short',
        })} `,
        min: new Date(value[0].getFullYear(), value[0].getMonth(), value[0].getDate(), 0, 0, 0),
        max: new Date(value[1].getFullYear(), value[1].getMonth(), value[1].getDate(), 23, 59, 59),
      }

      props.submitFilters(itemValue)

      if (props.item.min === value[0] && props.item.max === value[1]) {
        dispatch(removeFilterItem(itemValue))
      } else {
        dispatch(replaceFilterItem(itemValue))
      }
    }
  }

  useEffect(() => {
    if (
      !props.selectedFilters.attributes?.some(
        (attr) => attr.attributeCode === props.item.attributeCode,
      ) &&
      props.item.min &&
      props.item.max
    ) {
      setDate([new Date(props.item.min), new Date(props.item.max)])
    }
  }, [props.selectedFilters])

  const datePickerBtnSx: SxProps<Theme> = {
    width: 24,
    height: 24,
    border: `2px solid ${palette.grey[200]}`,
    borderRadius: 2,
  }

  return (
    <Stack
      sx={{
        '.MuiBox-root': {
          flexDirection: 'column',
        },
      }}
    >
      <HBCommerceDateRangePicker
        value={date}
        onChange={(newValue) => setDate(newValue)}
        onAccept={(newValue) => handleSubmit(newValue)}
        calendars={1}
        minDate={props.item.min ? new Date(props.item.min) : undefined}
        maxDate={props.item.max ? new Date(new Date(props.item.max).setDate(31)) : undefined}
        componentsProps={{
          leftArrowButton: {
            sx: datePickerBtnSx,
          },
          rightArrowButton: {
            sx: datePickerBtnSx,
          },
          switchViewButton: {
            sx: datePickerBtnSx,
          },
        }}
      />
    </Stack>
  )
}

export default memo(DateFilter)
