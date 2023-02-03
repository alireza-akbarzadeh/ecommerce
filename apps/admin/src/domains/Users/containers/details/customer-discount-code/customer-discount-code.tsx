import { Nothing } from '@hasty-bazar/admin-shared/components'
import { VoucherDataType } from '@hasty-bazar/admin-shared/core/enums'
import phrasesMessages from '@hasty-bazar-admin/core/translations/phrases.messages'
import { useGetAdminGeneralDataBusinessTypeValueByBusinessTypeByBusinessTypeQuery } from '@hasty-bazar/admin-shared/services/generalDataApi.generated'
import { useGetAdminReportByCustomerIdQuery } from '@hasty-bazar/admin-shared/services/reportApi.generated'
import {
  HBAutoComplete,
  HBClassesType,
  HBDataGrigToolbar,
  HBDateRangePicker,
  HBIcon,
  HBIconType,
  HBTextField,
} from '@hasty-bazar/core'
import { Box, debounce, Skeleton, Tab, Tabs, Typography } from '@mui/material'
import { DateRange } from '@mui/x-date-pickers-pro/DateRangePicker'
import { format } from 'date-fns'
import React, { useEffect, useState } from 'react'
import { useIntl } from 'react-intl'
import VoucherItem from './containers/voucher-item'
import customerDiscountCodeMessages from './customer-discount-code.messages'
import { useHBDateRangePickerStyles } from './customer-discount-code.styles'

type HBPageClassnames = 'filterBox' | 'notingBox'

const classes: HBClassesType<HBPageClassnames> = {
  filterBox: ({ breakpoints }) => ({
    [breakpoints.down('sm')]: {
      display: 'none',
    },
  }),
  notingBox: {
    alignItems: 'center',
    minHeight: 200,
    justifyContent: 'center',
  },
}
interface TabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
}
interface TabListItemProps {
  iconType?: string
  value?: string
  title?: string
  count?: number
}
type AutocompleteType = {
  value?: string | number
  title?: string
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props

  return (
    <Box
      component={'div'}
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </Box>
  )
}

type CustomerDiscountCodeProps = {
  partyId?: string
}

const CustomerDiscountCode = ({ partyId }: CustomerDiscountCodeProps) => {
  const datePickerClasses = useHBDateRangePickerStyles()
  const { formatMessage } = useIntl()
  const [value, setValue] = useState(0)
  const [isRefreshed, setIsRefreshed] = useState(false)
  const [provider, setProvider] = useState<AutocompleteType | null>(null)
  const [stateCode, setStateCode] = useState<AutocompleteType | null>(null)
  const [searchedValue, setSearchedValue] = useState('')
  const [rangePickerValue, setRangePickerValue] = useState<DateRange<Date>>([null, null])
  const [tabsList, setTabsList] = useState<TabListItemProps[]>([
    {
      iconType: 'searchAlt',
      value: '1',
      title: formatMessage(customerDiscountCodeMessages.activeCodes),
      count: 0,
    },
    {
      iconType: 'checkCircle',
      value: '2',
      title: formatMessage(customerDiscountCodeMessages.usedCodes),
      count: 0,
    },
    {
      iconType: 'store',
      value: '3',
      title: formatMessage(customerDiscountCodeMessages.expireCodes),
      count: 0,
    },
  ])

  const { data: providerTypeApi } =
    useGetAdminGeneralDataBusinessTypeValueByBusinessTypeByBusinessTypeQuery({
      'client-name': '',
      'client-version': '',
      businessType: VoucherDataType.providerType,
    })

  const handleFilter = () => {
    const filters = []
    if (provider?.value) {
      filters.push('ProviderType==@ProviderType')
    }
    if (stateCode?.value) {
      filters.push('StateCode==@StateCode')
    }
    return filters
  }

  const {
    data: disCountCodeList,
    refetch: disCountCodeRefresh,
    isSuccess: isSuccessDiscountCode,
    isFetching,
  } = useGetAdminReportByCustomerIdQuery(
    {
      'client-name': 'get-discount-code-customer',
      'client-version': '1.0.0',
      pageSize: 1000,
      customerId: partyId || '',
      isActive: value === 0 ? true : value === 2 ? false : undefined,
      isUsed: value === 1 ? true : undefined,
      filter: handleFilter()?.length ? handleFilter().join('&&') : undefined,
      providerType: Number(provider?.value) || undefined,
      stateCode: stateCode?.value?.toString() || undefined,
      searchedValue: searchedValue || undefined,
      startDate:
        rangePickerValue[0] && rangePickerValue[1]
          ? format(rangePickerValue[0], 'yyyy-MM-dd')
          : undefined,
      endDate:
        rangePickerValue[0] && rangePickerValue[1]
          ? format(rangePickerValue[1], 'yyyy-MM-dd')
          : undefined,
    },
    {
      skip: !partyId,
    },
  )

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue)
  }

  useEffect(() => {
    disCountCodeRefresh()
  }, [value])

  useEffect(() => {
    if (isSuccessDiscountCode) {
      const newState = tabsList.map((tab) => {
        if (tab.value === '1') {
          return { ...tab, count: disCountCodeList?.voucherCount?.activeCount }
        } else if (tab.value === '2') {
          return { ...tab, count: disCountCodeList?.voucherCount?.usedTabCount }
        } else if (tab.value === '3') {
          return { ...tab, count: disCountCodeList?.voucherCount?.expiredCount }
        }
        return tab
      })
      //@ts-ignore
      setTabsList(newState)
    }
  }, [isSuccessDiscountCode, disCountCodeList])

  const handleProvider = (
    e: React.ChangeEvent<HTMLInputElement>,
    newValue: AutocompleteType | null,
  ) => {
    setProvider(newValue)
  }

  const handleState = (
    e: React.ChangeEvent<HTMLInputElement>,
    newValue: AutocompleteType | null,
  ) => {
    setStateCode(newValue)
  }

  const handleSearch = (search: string) => {
    setSearchedValue(search)
  }

  const handleRefresh = () => {
    setProvider(null)
    handleSearch('')
    setStateCode(null)
    setRangePickerValue([null, null])
    setIsRefreshed(true)
  }

  useEffect(() => {
    if (isRefreshed) {
      setIsRefreshed(false)
      disCountCodeRefresh()
    }
  }, [isRefreshed])

  return (
    <Box bgcolor={'common.white'} p={6}>
      <Typography
        sx={{ display: 'flex', alignItems: 'center', gap: 2, fontWeight: '700' }}
        variant="h6"
      >
        <HBIcon type="ticket" />
        {formatMessage(customerDiscountCodeMessages.titleTab)}
      </Typography>
      <Box
        sx={({ palette, spacing }) => ({
          border: `1px solid ${palette.grey[300]}`,
          borderRadius: spacing(),
          position: 'relative',
          minHeight: 200,
          display: 'flex',
          flexDirection: 'column',
        })}
        p={2}
        my={4}
      >
        <HBDataGrigToolbar
          sx={classes.filterBox}
          addProps={{ show: false }}
          deleteProps={{ show: false }}
          editProps={{ show: false }}
          moreProps={{ show: false }}
          statusProps={{ show: false }}
          refreshProps={{ onClick: () => handleRefresh() }}
          searchProps={{
            show: true,
            openPosition: 'right',
            onSearch: debounce(handleSearch, 500),
            search: searchedValue,
          }}
        >
          <HBAutoComplete
            renderInput={(params) => (
              <HBTextField
                {...params}
                label={formatMessage(customerDiscountCodeMessages.provider)}
              />
            )}
            isOptionEqualToValue={(o, v) => o.value == v.value}
            //@ts-ignore
            getOptionLabel={(option) => option.title}
            options={
              providerTypeApi?.data?.items?.map((itm) => ({ value: itm.id!, title: itm.title! })) ||
              []
            }
            sx={{ minWidth: 160 }}
            value={provider}
            onChange={handleProvider}
          />
          <HBAutoComplete
            renderInput={(params) => (
              <HBTextField
                {...params}
                label={formatMessage(customerDiscountCodeMessages.stateCode)}
              />
            )}
            isOptionEqualToValue={(o, v) => o.value == v.value}
            //@ts-ignore
            getOptionLabel={(option) => option.title}
            options={[
              { title: formatMessage(phrasesMessages.draft), value: 1 },
              { title: formatMessage(phrasesMessages.published), value: 2 },
            ]}
            sx={{ minWidth: 160 }}
            value={stateCode}
            onChange={handleState}
          />

          <HBDateRangePicker
            calendars={1}
            value={rangePickerValue}
            onChange={(newValue) => {
              setRangePickerValue(newValue)
            }}
            PaperProps={{
              className: datePickerClasses.root,
            }}
          />
        </HBDataGrigToolbar>
        <Box sx={{}}>
          <Tabs
            variant="scrollable"
            allowScrollButtonsMobile
            value={value}
            onChange={handleChange}
            aria-label="tabs"
          >
            {tabsList.map((item, index) => (
              <Tab
                key={index}
                label={
                  <Typography sx={{ display: 'flex', textAlign: 'center', gap: 0.5 }}>
                    <HBIcon type={item.iconType as HBIconType} size="small" />
                    {item.title} {item.count ? `(${item.count})` : ''}
                  </Typography>
                }
              />
            ))}
          </Tabs>
        </Box>
        <TabPanel value={value} index={0}>
          {isFetching ? (
            <Skeleton animation="wave" variant="rectangular" width={'100%'} height={120} />
          ) : disCountCodeList?.voucherInformation?.items?.length ? (
            disCountCodeList?.voucherInformation?.items?.map((item, index) => (
              <VoucherItem key={index} content={item || {}} />
            ))
          ) : (
            <Nothing sx={classes.notingBox} />
          )}
        </TabPanel>
        <TabPanel value={value} index={1}>
          {isFetching ? (
            <Skeleton animation="wave" variant="rectangular" width={'100%'} height={120} />
          ) : disCountCodeList?.voucherInformation?.items?.length ? (
            disCountCodeList?.voucherInformation?.items?.map((item, index) => (
              <VoucherItem key={index} content={item || {}} expire />
            ))
          ) : (
            <Nothing sx={classes.notingBox} />
          )}
        </TabPanel>
        <TabPanel value={value} index={2}>
          {isFetching ? (
            <Skeleton animation="wave" variant="rectangular" width={'100%'} height={120} />
          ) : disCountCodeList?.voucherInformation?.items?.length ? (
            disCountCodeList.voucherInformation?.items?.map((item, index) => (
              <VoucherItem key={index} content={item || {}} expire />
            ))
          ) : (
            <Nothing sx={classes.notingBox} />
          )}
        </TabPanel>
      </Box>
    </Box>
  )
}
export default CustomerDiscountCode
