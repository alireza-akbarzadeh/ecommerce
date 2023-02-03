import { HBIconButton, HBToolTip } from '@hasty-bazar/core'
import { Paper } from '@mui/material'
import { isEmpty } from 'ramda'
import { FC } from 'react'
import { useSelector } from 'react-redux'
import { selectSelectedFilterItemsGroupBy } from '../../SearchFilter.reducer'
import { IFilterItems } from '../../searchFilterModels'
import { StyledHBChip } from './Filter.style'

interface IProps {
  clearFilterGroup(filter: IFilterItems): void
}
export const SelectedFilterChips: FC<IProps> = (props) => {
  const selectedFilterItemsGroupByFilterName = useSelector(selectSelectedFilterItemsGroupBy)
  return !isEmpty(selectedFilterItemsGroupByFilterName) ? (
    <Paper elevation={0} sx={{ display: { xs: 'none', md: 'block' }, p: 3 }}>
      {Object.values(selectedFilterItemsGroupByFilterName)?.map?.((value) => (
        <HBToolTip
          key={value.map((item) => ' ' + item.id).toString()}
          title={value[0].filterTitle + ': ' + value.map((item) => ' ' + item.filterItemTitle)}
          placement="top-start"
          enterDelay={400}
          arrow
          componentsProps={{
            tooltip: {
              sx: {
                color: 'common.white',
                backgroundColor: 'secondary.main',
              },
            },
            arrow: {
              sx: {
                color: 'secondary.main',
              },
            },
          }}
        >
          <StyledHBChip
            text={value[0].filterTitle + ': ' + value.map((item) => ' ' + item.filterItemTitle)}
            variant="caption"
            leftIcon={
              <HBIconButton
                iconSize="small"
                variant="text"
                icon="multiply"
                disableRipple
                onClick={() => props.clearFilterGroup(value[0])}
              />
            }
          />
        </HBToolTip>
      ))}
    </Paper>
  ) : null
}
