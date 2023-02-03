import sidebarMessages from '@hasty-bazar-admin/core/translations/sidebar.messages'
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
      title: formatMessage(sidebarMessages.users),
      routLink: '/users',
      iconType: 'tachometerFastAlt',
    },
    {
      id: '3',
      active: false,
      title: formatMessage(sidebarMessages.attributes),
      routLink: '/attributes',
      iconType: 'tachometerFastAlt',
    },
    {
      id: '4',
      active: false,
      title: formatMessage(sidebarMessages.geographical),
      routLink: '/geographical',
      iconType: 'tachometerFastAlt',
    },
    {
      id: '5',
      active: false,
      title: formatMessage(sidebarMessages.productGroup),
      routLink: '/product-group',
      iconType: 'tachometerFastAlt',
    },
    {
      id: '6',
      active: false,
      title: formatMessage(sidebarMessages.contentManagement),
      routLink: '/content-management/create',
      iconType: 'tachometerFastAlt',
    },
    {
      id: '7',
      active: false,
      title: formatMessage(sidebarMessages.products),
      routLink: '/products',
      iconType: 'tachometerFastAlt',
    },
    {
      id: '48',
      active: false,
      title: formatMessage(sidebarMessages.productBulkEdit),
      routLink: '/product-bulk-edit',
      iconType: 'tachometerFastAlt',
    },
    {
      id: '8',
      active: false,
      title: formatMessage(sidebarMessages.productRules),
      routLink: '/product-rules',
      iconType: 'tachometerFastAlt',
    },
    {
      id: '9',
      active: false,
      title: formatMessage(sidebarMessages.brands),
      routLink: '/brands',
      iconType: 'tachometerFastAlt',
    },
    {
      id: '10',
      active: false,
      title: formatMessage(sidebarMessages.documentsAttributes),
      routLink: '/documents-attributes',
      iconType: 'tachometerFastAlt',
    },
    {
      id: '11',
      active: false,
      title: formatMessage(sidebarMessages.documentsFileTypes),
      routLink: '/documents-file-types',
      iconType: 'tachometerFastAlt',
    },
    {
      id: '12',
      active: false,
      title: formatMessage(sidebarMessages.commissionSetting),
      routLink: '/commissionSetting',
      iconType: 'tachometerFastAlt',
    },
    {
      id: '13',
      active: false,
      title: formatMessage(sidebarMessages.megaMenu),
      routLink: '/mega-menu',
      iconType: 'tachometerFastAlt',
    },
    {
      id: '14',
      active: false,
      title: formatMessage(sidebarMessages.basicSystemSetting),
      routLink: '/basic-system-setting',
      iconType: 'tachometerFastAlt',
    },
    {
      id: '15',
      active: false,
      title: formatMessage(sidebarMessages.collection),
      routLink: '/collection',
      iconType: 'tachometerFastAlt',
    },
    {
      id: '16',
      active: false,
      title: formatMessage(sidebarMessages.sortOption),
      routLink: '/sort-option',
      iconType: 'tachometerFastAlt',
    },
    {
      id: '17',
      active: false,
      title: formatMessage(sidebarMessages.vendorShippingAgreementSetting),
      routLink: '/vendorShippingAgreementSetting',
      iconType: 'tachometerFastAlt',
    },
    {
      id: '18',
      active: false,
      title: formatMessage(sidebarMessages.platformCarrierAgreement),
      routLink: '/PlatformCarrierAgreementSettings',
      iconType: 'tachometerFastAlt',
    },
    {
      id: '19',
      active: false,
      title: formatMessage(sidebarMessages.voucherManegeMent),
      routLink: '/voucherManagement',
      iconType: 'tachometerFastAlt',
    },
    {
      id: '20',
      active: false,
      title: formatMessage(sidebarMessages.MessageTemplate),
      routLink: '/message-template',
      iconType: 'tachometerFastAlt',
    },
    {
      id: '21',
      active: false,
      title: formatMessage(sidebarMessages.shippingProvider),
      routLink: '/shippingProvider',
      iconType: 'tachometerFastAlt',
    },
    {
      id: '46',
      active: false,
      title: formatMessage(sidebarMessages.ordersManagement),
      routLink: '/ordersManagement',
      iconType: 'tachometerFastAlt',
    },
    {
      id: '23',
      active: false,
      title: formatMessage(sidebarMessages.process),
      routLink: '/process',
      iconType: 'tachometerFastAlt',
    },
    {
      id: '24',
      active: false,
      title: formatMessage(sidebarMessages.reasonsSettingsManagement),
      routLink: '/reasonManagement',
      iconType: 'tachometerFastAlt',
    },
    {
      id: '25',
      active: false,
      title: formatMessage(sidebarMessages.status),
      routLink: '/status',
      iconType: 'tachometerFastAlt',
    },
    {
      id: '26',
      active: false,
      title: formatMessage(sidebarMessages.FAQ),
      routLink: '/faq/show',
      iconType: 'tachometerFastAlt',
    },
    {
      id: '27',
      active: false,
      title: formatMessage(sidebarMessages.banks),
      routLink: '/banks',
      iconType: 'tachometerFastAlt',
    },
    {
      id: '28',
      active: false,
      title: formatMessage(sidebarMessages.certificates),
      routLink: '/certificates',
      iconType: 'tachometerFastAlt',
    },
    {
      id: '29',
      active: false,
      title: formatMessage(sidebarMessages.paymentMethodManagement),
      routLink: '/paymentMethodManagement',
      iconType: 'tachometerFastAlt',
    },
    {
      id: '30',
      active: false,
      title: formatMessage(sidebarMessages.companies),
      routLink: '/companies',
      iconType: 'tachometerFastAlt',
    },
    {
      id: '31',
      active: false,
      title: formatMessage(sidebarMessages.crm),
      routLink: '/crm',
      iconType: 'tachometerFastAlt',
    },
    {
      id: '32',
      active: false,
      title: formatMessage(sidebarMessages.messages),
      routLink: '/messages',
      iconType: 'tachometerFastAlt',
    },
    {
      id: '33',
      active: false,
      title: formatMessage(sidebarMessages.transactionReport),
      routLink: '/transaction-report',
      iconType: 'tachometerFastAlt',
    },

    {
      id: '34',
      title: formatMessage(sidebarMessages.useCategories),
      iconType: 'tachometerFastAlt',
      routLink: '/userCategories',
      active: false,
    },
    {
      id: '35',
      active: false,
      title: formatMessage(sidebarMessages.financialTransaction),
      routLink: '/financialTransaction',
      iconType: 'tachometerFastAlt',
    },
    {
      id: '36',
      active: false,
      title: formatMessage(sidebarMessages.typeOfFinancialEvents),
      routLink: '/typeOfFinancialEvents',
      iconType: 'tachometerFastAlt',
    },
    {
      id: '37',
      active: false,
      title: formatMessage(sidebarMessages.measurementUnit),
      routLink: '/measurement-unit',
      iconType: 'tachometerFastAlt',
    },
    {
      id: '38',
      active: false,
      title: formatMessage(sidebarMessages.comment),
      routLink: '/comment-review',
      iconType: 'tachometerFastAlt',
    },
    {
      id: '39',
      active: false,
      title: formatMessage(sidebarMessages.taxes),
      routLink: '/taxes',
      iconType: 'tachometerFastAlt',
    },
    {
      id: '40',
      active: false,
      title: formatMessage(sidebarMessages.paymentInformation),
      routLink: '/PaymentInformation',
      iconType: 'tachometerFastAlt',
    },
    {
      id: '41',
      active: false,
      title: formatMessage(sidebarMessages.typesFeatureCategories),
      routLink: '/typesFeatureCategories',
      iconType: 'tachometerFastAlt',
    },
    {
      id: '42',
      active: false,
      title: formatMessage(sidebarMessages.currencies),
      routLink: '/Currencies',
      iconType: 'tachometerFastAlt',
    },
    {
      id: '43',
      active: false,
      title: formatMessage(sidebarMessages.dailySaleReport),
      routLink: '/dailySaleReport',
      iconType: 'tachometerFastAlt',
    },
    {
      id: '44',
      active: false,
      title: formatMessage(sidebarMessages.enums),
      routLink: '/enums',
      iconType: 'tachometerFastAlt',
    },
    {
      id: '45',
      active: false,
      title: formatMessage(sidebarMessages.bulletinRequests),
      routLink: '/bulletinRequests',
      iconType: 'tachometerFastAlt',
    },
    {
      id: '46',
      active: false,
      title: formatMessage(sidebarMessages.shipmentManagement),
      routLink: '/shipmentManagement',
      iconType: 'tachometerFastAlt',
    },
    {
      id: '47',
      active: false,
      title: formatMessage(sidebarMessages.productReport),
      routLink: '/product-report',
      iconType: 'tachometerFastAlt',
    },
    {
      id: '48',
      active: false,
      title: formatMessage(sidebarMessages.iconsCategories),
      routLink: '/iconsCategories',
      iconType: 'tachometerFastAlt',
    },
    {
      id: '49',
      active: false,
      title: formatMessage(sidebarMessages.survey),
      routLink: '/survey',
      iconType: 'tachometerFastAlt',
    },
    {
      id: '50',
      active: false,
      title: formatMessage(sidebarMessages.withdrawalRequests),
      routLink: '/withdrawal-requests',
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
