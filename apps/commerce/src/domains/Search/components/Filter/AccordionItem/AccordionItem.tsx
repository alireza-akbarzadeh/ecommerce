import { selectSelectedFilterItemsGroupBy } from '@hasty-bazar-commerce/domains/Search/SearchFilter.reducer'
import { ProductFilter } from '@hasty-bazar-commerce/services/generalDataApi.generated'
import { HBIcon, HBIconButton } from '@hasty-bazar/core'
import { Divider, Stack, useTheme } from '@mui/material'
import Accordion from '@mui/material/Accordion'
import AccordionDetails from '@mui/material/AccordionDetails'
import AccordionSummary from '@mui/material/AccordionSummary'
import Typography from '@mui/material/Typography'
import { isEmpty } from 'ramda'
import { FC, memo, useState } from 'react'
import { useSelector } from 'react-redux'
import { FilterTypeEnums, IFilter, IFilterItems, IFilterParams } from '../../../searchFilterModels'
import { HBFilterListClasses, StyledHBChip } from '../Filter.style'
import CheckboxFilter from '../FilterItems/CheckboxFilter/CheckboxFilter'
import DateFilter from '../FilterItems/DateFilter/DateFilter'
import RatingFilter from '../FilterItems/RatingFilter/RatingFilter'
import SliderFilter from '../FilterItems/SliderFilter/SliderFilter'
import SwitchFilter from '../FilterItems/SwitchFilter/SwitchFilter'
import TreeViewFilter from '../FilterItems/TreeviewFilter/TreeViewFilter'

interface IProps {
  item: IFilter
  handleSubmitFilters(v: IFilterItems): void
  selectedFilters: ProductFilter
  params: IFilterParams
}

const AccordionItem: FC<IProps> = (props) => {
  const theme = useTheme()
  const [collapsed, setCollapsed] = useState(
    [
      ...Object.keys(props.selectedFilters?.baseFilter ?? {}),
      ...Object.keys(props.selectedFilters ?? {}),
      ...Object.keys(props.selectedFilters.booleanProductFilters ?? {}),
      ...(props?.selectedFilters?.attributes?.map?.((attr) => attr.attributeCode) ?? []),
    ].some((item) => item === props.item.name),
  )
  const selectedFilterItemsGroupByFilterName = useSelector(selectSelectedFilterItemsGroupBy)

  const handleExpand = () => setCollapsed(!collapsed)
  return (
    <>
      <Accordion elevation={0} disableGutters onChange={() => handleExpand()} expanded={collapsed}>
        <AccordionSummary
          expandIcon={<HBIcon type="angleDown" size="small" sx={{ color: 'grey.500' }} />}
          aria-controls="panel2a-content"
          id="panel2a-header"
        >
          <Stack>
            <Typography variant="subtitle1">{props.item.title}</Typography>
          </Stack>
        </AccordionSummary>

        <AccordionDetails className={HBFilterListClasses.accordionDetail}>
          {handleFilterType(props)}
        </AccordionDetails>
      </Accordion>
      {!collapsed && (
        <Stack direction="row" sx={{ display: { md: 'none' }, p: 3 }}>
          {!isEmpty(selectedFilterItemsGroupByFilterName) &&
            selectedFilterItemsGroupByFilterName[props.item.name]?.map?.((filterItem) => (
              <StyledHBChip
                key={filterItem.id}
                text={filterItem.filterItemTitle}
                variant="subtitle2"
                sx={{
                  maxWidth: 'auto',
                  backgroundColor: 'grey.100',
                }}
                leftIcon={
                  <HBIconButton
                    iconSize="small"
                    variant="text"
                    icon="multiply"
                    disableRipple
                    onClick={() => props.handleSubmitFilters(filterItem)}
                  />
                }
              />
            ))}
        </Stack>
      )}
      <Divider color={theme.palette.grey[200]} />
    </>
  )
}

const handleFilterType = (p: IProps): JSX.Element => {
  switch (p.item.filterType) {
    case FilterTypeEnums.Checkbox:
      return (
        <CheckboxFilter
          items={p.item.items}
          filterName={p.item.name}
          submitFilters={p.handleSubmitFilters}
          selectedFilters={p.selectedFilters}
        />
      )

    case FilterTypeEnums.Rating:
      return (
        <RatingFilter
          items={p.item.items}
          filterType={p.item.filterType}
          submitFilters={p.handleSubmitFilters}
          selectedFilters={p.selectedFilters}
        />
      )

    case FilterTypeEnums.Category:
      return (
        <TreeViewFilter
          items={p.item.items}
          filterType={p.item.filterType}
          submitFilters={p.handleSubmitFilters}
          selectedFilters={p.selectedFilters}
          params={p.params}
        />
      )

    case FilterTypeEnums.Range:
      return (
        <SliderFilter
          item={p.item.items[0]}
          filterName={p.item.name}
          filterType={p.item.filterType}
          submitFilters={p.handleSubmitFilters}
          selectedFilters={p.selectedFilters}
        />
      )

    case FilterTypeEnums.Date:
      return (
        <DateFilter
          item={p.item.items[0]}
          filterName={p.item.name}
          submitFilters={p.handleSubmitFilters}
          selectedFilters={p.selectedFilters}
        />
      )

    case FilterTypeEnums.Switch:
      return <SwitchFilter />

    default:
      return <div />
  }
}

export default memo(AccordionItem)
