import SearchMessages from '@hasty-bazar-commerce/domains/Search/Search.messages'
import {
  clearFilterItemsGroup,
  replaceFilterItem,
} from '@hasty-bazar-commerce/domains/Search/SearchFilter.reducer'
import {
  IFilterItems,
  IFilterParams,
} from '@hasty-bazar-commerce/domains/Search/searchFilterModels'
import { ProductFilter } from '@hasty-bazar-commerce/services/generalDataApi.generated'
import { HBIcon } from '@hasty-bazar/core'
import { Box, Collapse, List, ListItem, styled, Typography, useTheme } from '@mui/material'
import { FC, memo, useState } from 'react'
import { useIntl } from 'react-intl'
import { useDispatch } from 'react-redux'

interface IProps {
  items: IFilterItems[]
  filterType: string
  submitFilters(v: IFilterItems): void
  selectedFilters: ProductFilter
  params: IFilterParams
}
const TreeViewFilter: FC<IProps> = (props) => {
  const { spacing } = useTheme()
  const dispatch = useDispatch()
  const { formatMessage } = useIntl()
  const [openedItems, setOpenedItems] = useState<string[]>(
    // if filter categories is just 1 set its category Id
    // else set selected category Id
    (props.items.length === 1 ? [props.items[0].id] : props.selectedFilters?.categories) ?? [],
  )

  const handleSelectAllCategories = () => {
    if (props.selectedFilters?.categories) {
      const filterItem: IFilterItems = {
        id: '',
        filterItemTitle: '',
        filterName: 'categories',
        filterComponentType: 'category',
        filterSet: 'generalFilters',
        dataTypeCode: 1017012,
        min: null,
        max: null,
      }
      props.submitFilters(filterItem)
      dispatch(clearFilterItemsGroup(filterItem))
    }
  }

  const isOpened = (id: string) => openedItems?.some((x) => x === id)
  const isSelected = (item: IFilterItems) => {
    // if some selected category ||
    // filter parent categories is just 1 ||
    // filter parent categories & child categories is just 1 return true
    const selected = Boolean(
      props.selectedFilters?.categories?.some?.((x) => x === item.id) ||
        props.selectedFilters.baseFilter?.categories?.some?.((x) => x === item.id) ||
        (props.items.length === 1 && props.items[0].id === item.id) ||
        (props.items.length === 1 && props.items[0].children?.length === 1),
    )
    return selected
  }

  const handleClick = (item: IFilterItems) => {
    if (!isSelected(item)) {
      props.submitFilters(item)
      dispatch(replaceFilterItem(item))
    }
  }

  return (
    <List dense>
      {props.items.length !== 1 && (props?.params?.query || props?.params?.collectionId) && (
        <StyledListItem>
          <Typography
            variant="subtitle2"
            sx={{
              color: !props.selectedFilters?.categories?.length ? 'primary.main' : 'grey.700',
            }}
            pl={6.4}
            onClick={handleSelectAllCategories}
          >
            {formatMessage(SearchMessages.allCategories)}
          </Typography>
        </StyledListItem>
      )}

      {props?.items?.map((item: IFilterItems) => (
        <>
          <StyledListItem key={item.filterItemTitle} onClick={() => handleClick(item)}>
            <Box
              onClick={(e) => {
                e.stopPropagation()
                isOpened(item.id)
                  ? setOpenedItems((pre) => [...pre.filter((x) => x !== item.id)])
                  : setOpenedItems((pre) => [...pre, item.id])
              }}
              sx={{ display: 'flex', justifyItems: 'center' }}
            >
              {item?.children?.length ? (
                <HBIcon
                  type={isOpened(item.id) ? 'angleUp' : 'angleDown'}
                  size={'small'}
                  sx={{ pt: 1 }}
                />
              ) : (
                <HBIcon type={'minus'} size={'small'} sx={{ pt: 1 }} />
              )}
            </Box>
            <Typography
              variant="subtitle2"
              sx={{
                color: isSelected(item) ? 'primary.main' : 'grey.700',
              }}
            >
              {item.filterItemTitle}
            </Typography>
          </StyledListItem>
          <Collapse in={isOpened(item.id)} timeout="auto">
            {item?.children?.map?.((child) => (
              <StyledListItem
                key={child.filterItemTitle}
                onClick={() => handleClick(child)}
                sx={{
                  pl: 10,
                }}
              >
                <Typography
                  variant="subtitle2"
                  sx={{
                    color: isSelected(child) ? 'primary.main' : 'grey.700',
                  }}
                >
                  {child.filterItemTitle}
                </Typography>
              </StyledListItem>
            ))}
          </Collapse>
        </>
      ))}
    </List>
  )
}

export default memo(TreeViewFilter)

const StyledListItem = styled(ListItem)(({ theme }) => ({
  backgroundColor: 'common.white',
  cursor: 'pointer',
  padding: theme.spacing(1),
}))
