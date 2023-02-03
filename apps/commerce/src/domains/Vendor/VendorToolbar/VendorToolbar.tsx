import { IFilterParams } from '@hasty-bazar-commerce/domains/Search/searchFilterModels'
import { Grid, Paper } from '@mui/material'
import { useRouter } from 'next/router'
import { parseUrl } from 'query-string'
import { useEffect, useMemo } from 'react'
import { useIntl } from 'react-intl'
import VendorMessages from '../Vendor.messages'
import { TabType } from '../VendorPage'
import { HBVendorStyledTabs } from './VendorToolbar.styles'

export interface IVendorToolbarProps {
  activeTab: TabType
  onChangeTab: (tab: TabType) => void
}

export const VendorToolbar = ({ activeTab, onChangeTab }: IVendorToolbarProps) => {
  const { formatMessage } = useIntl()
  const router = useRouter()

  const handleChangeTab = (routeName: TabType) => {
    onChangeTab(routeName)
  }
  const params: IFilterParams = parseUrl(decodeURIComponent(router.asPath), {
    arrayFormat: 'index',
  }).query as any

  useEffect(() => {
    if (params?.query) onChangeTab('store')
  }, [params?.query])

  const valueBasedRoute = useMemo(() => {
    switch (activeTab) {
      case 'vitrin':
        return '0'
      case 'store':
        return '1'
      case 'views':
        return '2'
    }
  }, [activeTab])

  return (
    <Grid
      container
      component={Paper}
      elevation={0}
      mb={{ md: 4, xs: 1 }}
      alignContent="center"
      alignItems="center"
      sx={{ height: 56 }}
      columnGap={5}
      borderRadius={{ md: 2, xs: 0 }}
    >
      <HBVendorStyledTabs
        sx={{ px: { sm: 6, xs: 4 } }}
        hideTabPanel
        value={valueBasedRoute!}
        tabItemS={[
          {
            tabTitles: formatMessage(VendorMessages.vitrinTitle),
            tabContents: null,
            onClick: () => handleChangeTab('vitrin'),
          },
          {
            tabTitles: formatMessage(VendorMessages.storeTitle),
            tabContents: null,
            onClick: () => handleChangeTab('store'),
          },
          {
            tabTitles: formatMessage(VendorMessages.viewsTitle),
            tabContents: null,
            onClick: () => handleChangeTab('views'),
          },
        ]}
      />
    </Grid>
  )
}
