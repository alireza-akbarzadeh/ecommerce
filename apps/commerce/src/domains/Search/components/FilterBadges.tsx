import RenderInDom from '@hasty-bazar-commerce/components/RenderInDom'
import { HBBadge, HBIcon, HBIconButton } from '@hasty-bazar/core'
import { Box, useTheme } from '@mui/material'
import { useRouter } from 'next/router'
import { Dispatch, FC, SetStateAction } from 'react'
import { IFilter } from '../searchFilterModels'

interface IProps {
  setSortDrawerOpen: Dispatch<SetStateAction<boolean>>
  setDrawerOpen: Dispatch<SetStateAction<boolean>>
  sortBy: string
  filterItems: IFilter[]
}
const FilterBadges: FC<IProps> = (props) => {
  const { palette } = useTheme()
  const router = useRouter()

  return (
    <Box
      sx={{
        display: {
          md: 'none',
        },
      }}
    >
      <RenderInDom containerId="after-search-box-in-header">
        <Box>
          <HBBadge
            color="error"
            variant="dot"
            onClick={() => props.setSortDrawerOpen(true)}
            invisible={!props.sortBy}
          >
            <HBIcon type="sortAmountDown" />
          </HBBadge>
          <HBBadge
            color="error"
            variant="dot"
            sx={{ ml: 1 }}
            onClick={() => props.setDrawerOpen(true)}
            invisible={props.filterItems?.length > 0}
          >
            <HBIcon type="filter" />
          </HBBadge>
        </Box>
      </RenderInDom>
      <RenderInDom containerId="before-search-box-in-header">
        <HBIconButton
          variant="text"
          disableRipple
          icon="angleRight"
          iconSize="medium"
          iconStyle={{ color: palette.grey[500] }}
          onClick={() => router.back()}
        />
      </RenderInDom>
    </Box>
  )
}

export default FilterBadges
