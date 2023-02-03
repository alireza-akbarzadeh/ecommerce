import SearchMessages from '@hasty-bazar-commerce/domains/Search/Search.messages'
import {
  removeFilterItem,
  replaceFilterItem,
} from '@hasty-bazar-commerce/domains/Search/SearchFilter.reducer'
import { IFilterItems } from '@hasty-bazar-commerce/domains/Search/searchFilterModels'
import {
  DecimalMinMax,
  ProductFilter,
} from '@hasty-bazar-commerce/services/generalDataApi.generated'
import { HBIcon, HBRadioButton, HBRating } from '@hasty-bazar/core'
import { Stack } from '@mui/material'
import { FC, memo } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import { useDispatch } from 'react-redux'

interface IProps {
  items: IFilterItems[]
  filterType: string
  submitFilters(v: IFilterItems): void
  selectedFilters: ProductFilter
}
const RatingFilter: FC<IProps> = (props) => {
  const { formatMessage } = useIntl()
  const dispatch = useDispatch()

  const checked = (item: IFilterItems): boolean => {
    const productRatingItem: DecimalMinMax = props.selectedFilters[
      item.filterName as keyof ProductFilter
    ] as any
    const isChecked = Boolean(productRatingItem?.min === item.min)
    if (isChecked)
      dispatch(
        replaceFilterItem({
          ...item,
          filterItemTitle: (item.min ?? 0) + ' ' + formatMessage(SearchMessages.toUp),
        }),
      )
    else
      dispatch(
        removeFilterItem({
          ...item,
          filterItemTitle: (item.min ?? 0) + ' ' + formatMessage(SearchMessages.toUp),
        }),
      )
    return isChecked
  }
  return (
    <Stack direction="column" alignItems="start">
      {props.items
        .slice(0, 4)
        .reverse()
        .map((item) => (
          <Stack direction="row" alignItems="center" key={item.id}>
            <HBRadioButton
              value={String(item.min)}
              onClick={() => props.submitFilters(item)}
              checked={checked(item)}
            />
            <HBRating
              value={Number(item.min)}
              readOnly
              dir="ltr"
              emptyIcon={<HBIcon type="favorite" />}
              sx={{
                color: 'warning.main',
                '& .MuiRating-iconEmpty': {
                  color: 'warning.main',
                },
              }}
            />
            <FormattedMessage {...SearchMessages.toUp} />
          </Stack>
        ))}
    </Stack>
  )
}

export default memo(RatingFilter)
