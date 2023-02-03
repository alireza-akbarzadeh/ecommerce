import { HBIcon, HBIconType } from '@hasty-bazar/core'
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  IconButton,
  ListItemText,
  MenuItem,
  MenuList,
  Popover,
  Stack,
  SxProps,
  Theme,
  Typography,
} from '@mui/material'
import React, { useEffect, useState } from 'react'

export type MenuItemType = {
  label: string
  value: string
  id: number
}

export type ChartGroupProps = {
  title: string
  icon?: HBIconType
  menuItems?: MenuItemType[]
  menuItemClick?: (item?: MenuItemType) => void
  sx?: SxProps<Theme>
  children?: React.ReactNode
  limitedTime?: number
}

const menuItemData: MenuItemType[] = [
  { label: 'روزانه', value: 'daily', id: 0 },
  { label: 'هفتگی', value: 'weekly', id: 1 },
  { label: 'دو هفتگی', value: 'towWeekly', id: 2 },
  { label: 'ماهانه', value: 'monthly', id: 3 },
  { label: 'سه ماه', value: 'threeMonthly', id: 4 },
  { label: 'شش ماه', value: 'sixMonthly', id: 5 },
  { label: 'سالانه', value: 'yearly', id: 6 },
  // { label: 'فصلی', value: 'seasonal', id: 8 },
  { label: 'بدون فیلتر', value: 'noting', id: -1 },
]

export default function ChartGroup({
  title,
  icon,
  menuItems = menuItemData,
  menuItemClick,
  sx,
  children,
  limitedTime,
}: ChartGroupProps) {
  const [menuSelectId, setMenuSelectId] = useState<MenuItemType>()
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null)
  const openStatePopover = Boolean(anchorEl)

  useEffect(() => {
    const item = menuItems.find((item) => item.id === limitedTime)
    setMenuSelectId(item)
  }, [limitedTime])

  return (
    <Card sx={{ minHeight: 300, borderRadius: 3, pt: 2, boxShadow: 2, ...sx }} variant="outlined">
      <CardHeader
        sx={{
          border: (theme) => `1px solid ${theme.palette.grey[300]}`,
          m: 2,
          borderRadius: 2,
          alignItems: 'center',
        }}
        avatar={<HBIcon type={icon || 'chartBarAlt'} />}
        action={
          <Stack spacing={1} direction="row" alignItems="center">
            {menuSelectId && (
              <Stack spacing={1} direction="row" alignItems="center">
                <Typography variant="subtitle1">{menuSelectId.label}</Typography>
                <HBIcon type="filter" size="small" />
              </Stack>
            )}
            <Box>
              <IconButton
                disabled={!!limitedTime}
                aria-label="settings"
                onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
                  setAnchorEl(event.currentTarget)
                }}
              >
                <HBIcon type="ellipsisV" />
              </IconButton>
              <Popover
                open={openStatePopover}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'left',
                }}
                anchorEl={anchorEl}
                onClose={() => setAnchorEl(null)}
              >
                <MenuList component="nav" sx={{ minWidth: 152 }}>
                  {menuItems?.map((item, index) => {
                    return (
                      <MenuItem
                        onClick={() => {
                          if (item.id !== -1) {
                            menuItemClick?.(item)
                            setMenuSelectId(item)
                          } else {
                            menuItemClick?.()
                            setMenuSelectId(undefined)
                          }
                          setAnchorEl(null)
                        }}
                        key={index}
                      >
                        <ListItemText sx={{ minWidth: 100, py: 1 }}>{item.label}</ListItemText>
                      </MenuItem>
                    )
                  })}
                </MenuList>
              </Popover>
            </Box>
          </Stack>
        }
        title={<Typography variant="h5">{title}</Typography>}
      />
      <CardContent>{children}</CardContent>
    </Card>
  )
}
