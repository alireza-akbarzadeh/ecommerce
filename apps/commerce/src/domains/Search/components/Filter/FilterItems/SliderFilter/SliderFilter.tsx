import SearchMessages from '@hasty-bazar-commerce/domains/Search/Search.messages'
import {
  removeFilterItem,
  replaceFilterItem,
} from '@hasty-bazar-commerce/domains/Search/SearchFilter.reducer'
import { IFilterItems } from '@hasty-bazar-commerce/domains/Search/searchFilterModels'
import { ProductFilter } from '@hasty-bazar-commerce/services/generalDataApi.generated'
import { HBSlider } from '@hasty-bazar/core'
import { Stack, styled, Typography } from '@mui/material'
import { FC, memo, useEffect, useState } from 'react'
import { useIntl } from 'react-intl'
import { useDispatch } from 'react-redux'

interface IProps {
  item: IFilterItems
  filterName: string
  filterType: string
  submitFilters(v: IFilterItems): void
  selectedFilters: ProductFilter
}

const SliderFilter: FC<IProps> = (props) => {
  const { formatMessage } = useIntl()
  const dispatch = useDispatch()
  const [value, setValue] = useState<number[]>(
    typeof props.item.min === 'number' && typeof props.item.max === 'number'
      ? [props.item.min, props.item.max]
      : [0, 0],
  )
  const handleSubmit = (_: Event | React.SyntheticEvent<Element, Event>, v: number[]) => {
    props.submitFilters({
      id: '',
      filterName: props.item.filterName,
      filterComponentType: props.item.filterComponentType,
      filterItemTitle: `${formatMessage(SearchMessages.from)} ${v[0]} ${formatMessage(
        SearchMessages.until,
      )} ${v[1]} `,
      attributeCode: props.item.attributeCode,
      dataTypeCode: props.item.dataTypeCode,
      filterSet: props.item.filterSet,
      min: v[0],
      max: v[1],
      isRangeFilter: props.item.isRangeFilter,
    })
    if (props.item.min === v[0] && props.item.max === v[1]) {
      dispatch(
        removeFilterItem({
          ...props.item,
          filterItemTitle: `${formatMessage(SearchMessages.from)} ${v[0]} ${formatMessage(
            SearchMessages.until,
          )} ${v[1]} `,
        }),
      )
    } else {
      dispatch(
        replaceFilterItem({
          ...props.item,
          filterItemTitle: `${formatMessage(SearchMessages.from)} ${v[0]} ${formatMessage(
            SearchMessages.until,
          )} ${v[1]} `,
        }),
      )
    }
  }

  useEffect(() => {
    if (
      !props.selectedFilters.attributes?.some(
        (attr) => attr.attributeCode === props.item.attributeCode,
      )
    )
      setValue(
        typeof props.item.min === 'number' && typeof props.item.max === 'number'
          ? [props.item.min, props.item.max]
          : [0, 0],
      )
  }, [props.selectedFilters])

  return (
    <Stack>
      <Stack direction="row" justifyContent="space-between">
        <Typography variant="subtitle2" color="text.secondary">
          {value[0]}
        </Typography>
        <Typography variant="subtitle2" color="text.secondary">
          {value[1]}
        </Typography>
      </Stack>
      <Stack direction="row" justifyContent="space-between">
        <HBFilterSlider
          min={typeof props.item.min === 'number' ? props.item.min : 0}
          max={typeof props.item.max === 'number' ? props.item.max : 0}
          color="primary"
          value={value}
          onChange={(_, v) => setValue(v as number[])}
          onChangeCommitted={handleSubmit}
        />
      </Stack>
    </Stack>
  )
}

export default memo(SliderFilter)

const HBFilterSlider = styled(HBSlider)(({ theme }) => ({
  height: 6,
  '& .MuiSlider-track': {
    border: 'none',
  },
  '& .MuiSlider-rail': {
    color: theme.palette.grey[200],
    opacity: 100,
  },
  '& .MuiSlider-thumb': {
    height: 18,
    width: 18,
    backgroundColor: theme.palette.common.white,
    border: '1px solid currentColor',

    '&:focus, &:hover, &.Mui-focusVisible': {
      boxShadow: `0 0 0 6px ${theme.palette.primary.main}30`,
    },
    '&.Mui-active': {
      boxShadow: `0 0 0 8px ${theme.palette.primary.main}30`,
    },

    '&:before': {
      height: 10,
      width: 10,
      backgroundColor: theme.palette.primary.main,
      boxShadow: 'none',
    },
  },
}))
