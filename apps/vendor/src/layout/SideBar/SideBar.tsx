import sidebarMessages from '@hasty-bazar-vendor/core/translations/sidebar.messages'
import { HBIcon, HBIconType, HBTextField } from '@hasty-bazar/core'
import {
  Divider,
  Grid,
  InputAdornment,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  Typography,
} from '@mui/material'
import List from '@mui/material/List'
import { Box } from '@mui/system'
import { useRouter } from 'next/router'
import * as React from 'react'
import { useIntl } from 'react-intl'
import packageJson from '../../../../../package.json'

interface MenuItem {
  id: string
  active: boolean
  title: string
  routLink: string
  iconType: HBIconType
}

type SideBarProps = {
  searchValue: string
  onSearch: (value: string) => void
}

const SideBar = ({ searchValue, onSearch }: SideBarProps) => {
  const { formatMessage } = useIntl()

  const MockMenu: MenuItem[] = [
    {
      id: '1',
      active: false,
      title: formatMessage(sidebarMessages.dashboard),
      routLink: '/',
      iconType: 'tachometerFastAlt',
    },
    {
      id: '2',
      active: false,
      title: formatMessage(sidebarMessages.vendorOrderReport),
      routLink: '/vendor-order-report',
      iconType: 'tachometerFastAlt',
    },
    {
      id: '3',
      active: false,
      title: formatMessage(sidebarMessages.vendorFinancialReport),
      routLink: '/vendor-financial-report',
      iconType: 'tachometerFastAlt',
    },
  ]

  const { asPath, push } = useRouter()
  const [menuStatic, setMenuStatic] = React.useState<MenuItem[]>(MockMenu)
  const [menus, setMenus] = React.useState<MenuItem[]>([])

  React.useEffect(() => {
    const path = asPath != '/' ? asPath.slice(0, -1) : asPath
    const tempMenu = MockMenu.map((item: MenuItem, index: number) => {
      const temp: MenuItem = Object.assign({}, item)
      if (
        (path.includes(item.routLink) && item.routLink != '/') ||
        (path == '/' && item.routLink == '/')
      ) {
        temp.active = true
      }
      return temp
    })
    setMenus(!searchValue ? tempMenu : tempMenu.filter((item) => item.title.includes(searchValue)))
    setMenuStatic(tempMenu)
  }, [asPath])

  const handleChange = (inputValue: string) => {
    onSearch(inputValue)
    if (inputValue) {
      const result = menuStatic.filter((menuItem: MenuItem) => menuItem.title.includes(inputValue))
      setMenus(result)
    } else {
      setMenus(menuStatic)
    }
  }

  const handleClickItemMenu = (item: MenuItem) => {
    const tempMenu = menus.map((menuItem: MenuItem) => {
      const temp: MenuItem = Object.assign({}, menuItem)
      if (menuItem.id == item.id) {
        temp.active = true
      } else {
        temp.active = false
      }
      return temp
    })
    setMenus(tempMenu)
    push(item.routLink)
  }

  return (
    <Grid
      container
      direction="column"
      justifyContent="space-between"
      alignItems="stretch"
      sx={{ minHeight: 'calc(100vh - 60px)', overflowY: 'auto', p: 0, bgcolor: 'common.white' }}
    >
      <List
        sx={{ width: '100%', maxWidth: 460, bgcolor: 'background.paper', mt: 3 }}
        component="nav"
        aria-labelledby="nested-list-subheader"
        subheader={
          <ListSubheader
            component="div"
            id="nested-list-subheader"
            sx={{
              position: 'fixed',
              top: 60,
              paddingTop: 1,
              width: 280,
            }}
          >
            <HBTextField
              placeholder={formatMessage(sidebarMessages.search)}
              value={searchValue}
              onChange={(e) => handleChange(e.target.value)}
              size="small"
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <HBIcon type="search" size="small" />
                  </InputAdornment>
                ),
              }}
            />
          </ListSubheader>
        }
      >
        <Box sx={{ position: 'absolute', top: 45, width: '100%' }}>
          {menus.map((child: MenuItem, index: number) => (
            <ListItemButton
              key={index}
              onClick={() => handleClickItemMenu(child)}
              selected={child.active}
              id={`menu-item-${child.id}`}
            >
              <ListItemIcon>
                <HBIcon
                  type={child.iconType}
                  sx={{ color: child.active ? 'primary.main' : 'grey.500' }}
                />
              </ListItemIcon>
              <ListItemText
                primary={child.title}
                sx={{ color: child.active ? 'primary.main' : 'grey.500' }}
              />
            </ListItemButton>
          ))}
          <Divider />
          <Typography textAlign={'center'} p={2} color="primary.main">
            version : {packageJson.version}
          </Typography>
        </Box>
      </List>
    </Grid>
  )
}

export default SideBar
