import SearchMessages from '@hasty-bazar-commerce/domains/Search/Search.messages'
import {
  addFilterItem,
  removeFilterItem,
  replaceFilterItem,
  selectSelectedFilter,
} from '@hasty-bazar-commerce/domains/Search/SearchFilter.reducer'
import { IFilterItems } from '@hasty-bazar-commerce/domains/Search/searchFilterModels'
import { ProductFilter } from '@hasty-bazar-commerce/services/generalDataApi.generated'
import { HBCheckBox, HBIcon, HBRadioButton, HBTextField } from '@hasty-bazar/core'
import { InputAdornment, Stack, styled, Typography } from '@mui/material'
import { useRouter } from 'next/router'
import { FC, KeyboardEvent, memo, useEffect, useMemo, useState } from 'react'
import { useIntl } from 'react-intl'
import { useDispatch, useSelector } from 'react-redux'

interface IInputVal {
  min: number | null
  max: number | null
}

interface IProps {
  items: IFilterItems[]
  filterName: string
  submitFilters(v: IFilterItems): void
  selectedFilters: ProductFilter
}

const CheckboxFilter: FC<IProps> = (props) => {
  const dispatch = useDispatch()
  const selectSelectedFilterItems = useSelector(selectSelectedFilter)
  const { formatMessage } = useIntl()
  const router = useRouter()
  const [inputVal, setInputVal] = useState<IInputVal>({
    min: null,
    max: null,
  })
  const [search, setSearch] = useState('')

  const handlePriceTitle = (min: number | null, max: number | null) => {
    if (min && max) {
      return `${min.toLocaleString() ?? 0} ${formatMessage(SearchMessages.until)} ${
        max.toLocaleString() ?? 0
      } ${formatMessage(SearchMessages.toman)}`
    }

    if (min) {
      return (
        formatMessage(SearchMessages.upper) +
        ' ' +
        (min ?? 0).toLocaleString() +
        ' ' +
        formatMessage(SearchMessages.toman)
      )
    }
    if (max) {
      return (
        formatMessage(SearchMessages.lower) +
        ' ' +
        (max ?? 0).toLocaleString() +
        ' ' +
        formatMessage(SearchMessages.toman)
      )
    }
    return ''
  }

  const handleSubmitFilter = (e: KeyboardEvent<HTMLDivElement>) => {
    if (
      e.key === 'Enter' &&
      (props.selectedFilters?.price?.min !== inputVal.min ||
        props.selectedFilters?.price?.max !== inputVal.max) &&
      (inputVal.min !== null || inputVal.max !== null)
    ) {
      const itemValue: IFilterItems = {
        id: `${inputVal.min}-${inputVal.max}`,
        filterName: 'price',
        filterComponentType: 'checkbox',
        filterTitle: formatMessage(SearchMessages.price),
        filterItemTitle: handlePriceTitle(inputVal.min, inputVal.max),
        dataTypeCode: 1017008,
        filterSet: 'generalFilters',
        min: inputVal.min,
        max: inputVal.max,
        isRangeFilter: false,
      }
      props.submitFilters(itemValue)
      dispatch(replaceFilterItem(itemValue))
    }
  }

  // filter items with search value
  const items = useMemo(
    () => props.items.filter((item) => item?.filterItemTitle?.includes(search)),
    [search],
  )

  const checked = (item: IFilterItems): boolean => {
    type ICheck = {
      [key in keyof ProductFilter]: boolean
    }
    const check: ICheck = {
      acceptableConditionTypes: props.selectedFilters.acceptableConditionTypes?.some?.(
        (el: any) => String(el) === String(item?.id),
      ),
      booleanProductFilters: props.selectedFilters.booleanProductFilters?.some?.(
        (el: any) => String(el) === String(item?.id),
      ),
      vendors: props.selectedFilters.vendors?.some?.((el: any) => el === item?.id),
      brands: props.selectedFilters.brands?.some?.((el: any) => el === item?.id),
      price:
        props.selectedFilters.price?.min === item?.min &&
        props.selectedFilters.price?.max === item?.max,
      releasedDays: Number(props.selectedFilters.releasedDays) === +item?.id,
      attributes: item.isRangeFilter
        ? item?.ids?.every?.((v) =>
            (
              props.selectedFilters.attributes?.find((x) => x.attributeCode === item.attributeCode)
                ?.values ?? []
            ).includes(v),
          )
        : (
            props.selectedFilters.attributes?.find((x) => x.attributeCode === item.attributeCode)
              ?.values ?? []
          )?.some?.((el: string) => el === item?.id),
    }

    const isCheck = Boolean(check[item.filterName as keyof ProductFilter])
    const isSelectedFilter = selectSelectedFilterItems.some((el) =>
      item.filterName === 'price'
        ? `${item.min}-${item.max}` === `${el.min}-${el.max}`
        : item.isRangeFilter
        ? el.ids?.toString() === item.ids?.toString()
        : el.id === item.id,
    )

    if (isCheck && !isSelectedFilter && props.filterName === 'releasedDays')
      dispatch(replaceFilterItem(item))
    else if (isCheck && !isSelectedFilter) dispatch(addFilterItem(item))
    else if (!isCheck && isSelectedFilter) dispatch(removeFilterItem(item))

    return isCheck
  }

  useEffect(() => {
    if (!('price' in props.selectedFilters)) {
      setInputVal({
        max: null,
        min: null,
      })
    }
    if ('price' in props.selectedFilters && !inputVal.min && !inputVal.max) {
      dispatch(
        replaceFilterItem({
          id: `${props?.selectedFilters?.price?.min}-${props?.selectedFilters?.price?.max}`,
          filterName: 'price',
          filterComponentType: 'checkbox',
          filterTitle: formatMessage(SearchMessages.price),
          filterItemTitle: handlePriceTitle(
            props?.selectedFilters?.price?.min ?? null,
            props?.selectedFilters?.price?.max ?? null,
          ),
          dataTypeCode: 1017008,
          filterSet: 'generalFilters',
          min: props?.selectedFilters?.price?.min ?? null,
          max: props?.selectedFilters?.price?.max ?? null,
          isRangeFilter: false,
        }),
      )
    }
  }, [props.selectedFilters])

  return (
    <Stack
      className={props.filterName !== 'price' && props.items.length > 5 ? 'scroll' : ''}
      direction="column"
      alignItems="start"
    >
      {props.items.length > 5 && (
        <HBTextField
          fullWidth
          margin="normal"
          placeholder={formatMessage(SearchMessages.search)}
          onChange={(v) => setSearch(v.target.value)}
          value={inputVal.min}
          InputProps={{
            endAdornment: <HBIcon type="search" />,
          }}
        />
      )}
      {items.map((item, idx) => (
        <Stack key={item.filterItemTitle + idx} direction="row" alignItems="center">
          {props.filterName === 'price' || props.filterName === 'releasedDays' ? (
            <HBRadioButton
              onClick={() => {
                props.submitFilters(item)
                if (props.filterName === 'price') {
                  setInputVal({
                    min: Number(item.min),
                    max: Number(item.max),
                  })
                  dispatch(replaceFilterItem(item))
                }
              }}
              checked={checked(item)}
            />
          ) : (
            <HBCheckBox
              name={item.filterItemTitle}
              onClick={() => props.submitFilters(item)}
              checked={checked(item)}
              disabled={props?.filterName === 'vendors' && router?.asPath?.startsWith('/vendor')}
            />
          )}
          <Typography
            sx={(theme) => ({
              wordSpacing: theme.spacing(0.5),
            })}
          >
            {item.filterItemTitle}
          </Typography>
        </Stack>
      ))}
      {props.filterName === 'price' && (
        <>
          <StyledTextField
            fullWidth
            margin="normal"
            label={formatMessage(SearchMessages.cheapest)}
            onChange={(v) =>
              setInputVal({
                ...inputVal,
                min: +v.target.value === 0 ? null : +v.target.value,
              })
            }
            onKeyDown={handleSubmitFilter}
            value={inputVal.min}
            InputProps={{
              endAdornment: inputVal.min && (
                <InputAdornment position="start">
                  {formatMessage(SearchMessages.toman)}
                </InputAdornment>
              ),
            }}
            maskOptions={{
              mask: Number,
              thousandsSeparator: ',',
              valueType: 'unmaskedValue',
            }}
          />
          <StyledTextField
            fullWidth
            margin="normal"
            label={formatMessage(SearchMessages.mostExpensive)}
            onChange={(v) =>
              setInputVal({
                ...inputVal,
                max: +v.target.value === 0 ? null : +v.target.value,
              })
            }
            onKeyDown={handleSubmitFilter}
            value={inputVal.max}
            InputProps={{
              endAdornment: inputVal.max && (
                <InputAdornment position="start">
                  {formatMessage(SearchMessages.toman)}
                </InputAdornment>
              ),
            }}
            maskOptions={{
              mask: Number,
              thousandsSeparator: ',',
              valueType: 'unmaskedValue',
            }}
          />
        </>
      )}
    </Stack>
  )
}

export default memo(CheckboxFilter)

export const StyledTextField = styled(HBTextField)(() => ({
  '& input: :-webkit-outer-spin-button,input::-webkit-inner-spin-button': {
    WebkitAppearance: 'none',
    margin: 0,
  },

  '& input[type=number]': {
    MozAppearance: 'textfield',
  },
}))
