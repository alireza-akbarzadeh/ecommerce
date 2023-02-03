import { CommerceIconButton } from '@hasty-bazar-commerce/components'
import { HBDivider, HBIcon, HBTextField } from '@hasty-bazar/core'
import {
  Hidden,
  InputAdornment,
  outlinedInputClasses,
  Stack,
  Tab,
  Tabs,
  Typography,
} from '@mui/material'
import { useRouter } from 'next/router'
import { FC, useEffect, useState } from 'react'
import { useIntl } from 'react-intl'
import { orderTrackingType } from '../OrderTracking'
import OrderTrackingMessages from '../orderTracking.messages'

const OrderTrackingHeader: FC = () => {
  const { push, query } = useRouter()
  const { formatMessage } = useIntl()
  const [searchedText, setSearchedText] = useState<string>('')
  const orderTrackingQuery = (query?.profile?.[1] as orderTrackingType) ?? ''
  const [activeTab, setActiveTab] = useState<orderTrackingType>(
    (query?.profile?.[1] as orderTrackingType) || 'current',
  )

  const isActive = (activeQuery: orderTrackingType) => {
    return orderTrackingQuery === activeQuery
  }

  const handleRoute = (activeQuery: orderTrackingType) => {
    push(`/profile/order-tracking/${activeQuery}`)
  }

  const tabs = [
    {
      isActive: isActive('current') || isActive(''),
      onClick: () => handleChangeTab('current'),
      text: formatMessage({ ...OrderTrackingMessages.currentOrder }),
      value: 'current',
    },
    {
      isActive: isActive('delivered'),
      onClick: () => handleChangeTab('delivered'),
      text: formatMessage({ ...OrderTrackingMessages.deliveredOrder }),
      value: 'delivered',
    },
    {
      isActive: isActive('returned'),
      onClick: () => handleChangeTab('returned'),
      text: formatMessage({ ...OrderTrackingMessages.returnedOrder }),
      value: 'returned',
    },
    {
      isActive: isActive('canceled'),
      onClick: () => handleChangeTab('canceled'),
      text: formatMessage({ ...OrderTrackingMessages.canceledOrder }),
      value: 'canceled',
    },
  ]

  const handleChangeTab = (newValue: orderTrackingType) => {
    if (activeTab === newValue) return
    setActiveTab(newValue)
    handleRoute(newValue)
  }

  useEffect(() => {
    if (!query?.profile?.[1]) {
      setActiveTab('current')
    }
  }, [query?.profile, setActiveTab])

  return (
    <>
      <Stack
        direction="row"
        alignItems="center"
        flexDirection={{ xs: 'column-reverse', md: 'row' }}
      >
        <Stack
          width={{ xs: '100%', md: '75%' }}
          overflow="auto"
          pb={1}
          ml={{ sm: 0, xs: -8 }}
          mt={4}
        >
          <Tabs sx={{ flex: 1 }} value={activeTab} variant="scrollable" scrollButtons={false}>
            {tabs.map((tab, index) => (
              <Tab
                value={tab.value}
                onClick={() => tab.onClick()}
                key={index}
                label={<Typography variant="button">{tab.text}</Typography>}
              />
            ))}
          </Tabs>
        </Stack>
        <Stack width={{ xs: '100%', md: '25%' }}>
          <HBTextField
            sx={{
              width: { md: 200, sm: '100%' },
              marginBottom: 0.5,
              fontSize: 14,
              [`& .${outlinedInputClasses.root}`]: {
                padding: '0px!important',
              },
            }}
            placeholder={formatMessage({ ...OrderTrackingMessages.idOrProductName })}
            variant="outlined"
            value={searchedText}
            onChange={(e) => setSearchedText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                if (searchedText) {
                  push({
                    pathname: '/profile/order-tracking/search',
                    query: { search: searchedText },
                  })
                }
              }
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="start">
                  <CommerceIconButton
                    icon={
                      <HBIcon
                        type="searchAlt"
                        sx={{ color: (theme) => `${theme.palette.grey[900]}!important` }}
                      />
                    }
                    onClick={() => {
                      if (searchedText) {
                        push({
                          pathname: '/profile/order-tracking/search',
                          query: { search: searchedText },
                        })
                      }
                    }}
                  />
                </InputAdornment>
              ),
            }}
          />
        </Stack>
      </Stack>
      <Hidden mdDown>
        <HBDivider />
      </Hidden>
    </>
  )
}

export default OrderTrackingHeader
