import { ProductFilter } from '@hasty-bazar-commerce/services/generalDataApi.generated'
import { HBButton, HBIconButton } from '@hasty-bazar/core'
import { pxToRem } from '@hasty-bazar/material-provider'
import {
  Accordion,
  AccordionSummary,
  Divider,
  Grid,
  Paper,
  Skeleton,
  Stack,
  Typography,
  useTheme,
} from '@mui/material'
import { FC, memo } from 'react'
import { FormattedMessage } from 'react-intl'
import SearchMessages from '../../Search.messages'
import { IFilter, IFilterItems, IFilterParams } from '../../searchFilterModels'
import AccordionItem from './AccordionItem/AccordionItem'
import { HBFilterListClasses, HBFilterRoot } from './Filter.style'
import { SelectedFilterChips } from './SelectedFilterChips'

interface IProps {
  filterItems: IFilter[]
  setDrawerOpen(v: boolean): void
  handleSubmitFilters(v: IFilterItems): void
  searchQty: number
  selectedFilters: ProductFilter
  resetFilter(): void
  clearFilterGroup(filter: IFilterItems): void
  params: IFilterParams
}
const FilterBody: FC<IProps> = ({
  filterItems,
  setDrawerOpen,
  handleSubmitFilters,
  searchQty,
  selectedFilters,
  resetFilter,
  clearFilterGroup,
  params,
}) => {
  const theme = useTheme()

  return (
    <HBFilterRoot className={HBFilterListClasses.root}>
      <Accordion elevation={0} expanded={false} className={HBFilterListClasses.accordion}>
        <AccordionSummary aria-controls="panel1a-content" id="panel1a-header">
          <Grid container justifyContent="space-between" alignItems="center">
            <Grid item xs={6} sm={5} container justifyContent="space-between" alignItems="center">
              <HBIconButton
                variant="text"
                iconStyle={{
                  color: theme.palette.grey[500],
                  margin: theme.spacing(0, 1, 0, 2),
                  fontSize: pxToRem(20),
                }}
                sx={{
                  display: {
                    md: 'none',
                  },
                }}
                icon="times"
                onClick={() => setDrawerOpen(false)}
              />
              {filterItems.length === 0 ? (
                <Skeleton
                  width={65}
                  height={32}
                  variant="rounded"
                  sx={{
                    marginLeft: 2.2,
                    borderRadius: 2,
                  }}
                />
              ) : (
                <Typography variant="h6">
                  <FormattedMessage {...SearchMessages.filters} />
                </Typography>
              )}
            </Grid>

            {((selectedFilters.baseFilter !== undefined &&
              Object.keys(selectedFilters).length >
                Object.keys(selectedFilters.baseFilter ?? {}).length + 1) ||
              (selectedFilters.baseFilter === undefined &&
                Object.keys(selectedFilters).length > 0)) && (
              <Grid item xs={6} sm={7} container justifyContent="flex-end" alignItems="center">
                <HBButton variant="text" size="small" onClick={() => resetFilter()}>
                  <Typography variant="subtitle2" sx={{ color: 'info.main' }}>
                    <FormattedMessage {...SearchMessages.clearFilters} />
                  </Typography>
                </HBButton>
              </Grid>
            )}
          </Grid>
        </AccordionSummary>
      </Accordion>
      <SelectedFilterChips {...{ clearFilterGroup }} />
      {filterItems.length === 0
        ? Array.from({ length: 8 }).map((_, idx) => (
            <Paper key={idx} elevation={0} square>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                sx={({ spacing }) => ({ padding: spacing(3, 4) })}
              >
                <Skeleton
                  width={118}
                  height={20}
                  variant="rounded"
                  sx={{
                    borderRadius: 4,
                  }}
                />
                <Skeleton
                  width={26}
                  height={28}
                  variant="rounded"
                  sx={{
                    borderRadius: 2,
                  }}
                />
              </Stack>
              <Divider color={theme.palette.grey[200]} sx={{ marginX: 4 }} />
            </Paper>
          ))
        : filterItems?.map((item) => (
            <AccordionItem
              key={item.title + item.name + item.items.length}
              {...{ item, handleSubmitFilters, selectedFilters, params }}
            />
          ))}
    </HBFilterRoot>
  )
}

export default memo(FilterBody)
