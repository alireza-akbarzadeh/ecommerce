import { CommerceLoading } from '@hasty-bazar-commerce/components'
import { ApiConstants } from '@hasty-bazar-commerce/core/constants'
import { useLazyGetWebCrmTicketsQuery } from '@hasty-bazar-commerce/services/crmApi.generated'
import { HBButton, HBIcon, HBIconProps, HBTextField } from '@hasty-bazar/core'
import {
  debounce,
  formControlClasses,
  Grid,
  ListItemText,
  MenuItem,
  MenuList,
  Popover,
  Stack,
  Theme,
  Typography,
  useMediaQuery,
} from '@mui/material'
import Pagination from 'libs/core/src/components/HBAgGrid/HBAgGridPagination'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useIntl } from 'react-intl'
import { CaseTypeCaption } from '../ticketForm/ticketType'
import ticketingMessages from '../ticketing.messages'
import EmptyComponent from './emptyComponent'
import TicketItem from './ticketItem'

const PAGE_SIZE = 8
function TicketList() {
  const { formatMessage } = useIntl()
  const router = useRouter()
  const breakpointSmDown = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'))
  const { data } = useSession()
  const partyId = data?.user.partyId || ''

  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null)
  const openStatePopover = Boolean(anchorEl)
  const [page, setPage] = useState(1)
  const [caseCaptionType, setCaseCaptionType] = useState<CaseTypeCaption>()
  const [searchValue, setSearchValue] = useState<string>()
  const [getTickets, { data: tickets, isLoading }] = useLazyGetWebCrmTicketsQuery()

  const onSearch = debounce((value: string) => {
    setSearchValue(value)
  }, 500)

  useEffect(() => {
    getTickets({
      ...ApiConstants,
      partyId,
      pageNumber: page,
      filter: `PartyId==@PartyId&CaseTypeCaption==@CaseTypeCaption`,
      searchValue,
      pageSize: PAGE_SIZE,
    })
  }, [searchValue])

  const onSelect = (value: CaseTypeCaption) => {
    setCaseCaptionType(value)
    setAnchorEl(null)
    getTickets({
      ...ApiConstants,
      partyId,
      pageNumber: page,
      filter: `PartyId==@PartyId&CaseTypeCaption==@CaseTypeCaption`,
      searchValue,
      caseTypeCaption: value !== CaseTypeCaption.All ? value : undefined,
      pageSize: PAGE_SIZE,
    })
  }
  const ticketTypes: {
    title: string
    value: CaseTypeCaption
    icon: HBIconProps['type']
  }[] = [
    {
      title: formatMessage(ticketingMessages.all),
      value: CaseTypeCaption.All,
      icon: 'paragraph',
    },
    {
      title: formatMessage(ticketingMessages.question),
      value: CaseTypeCaption.Question,
      icon: 'questionCircle',
    },
    {
      title: formatMessage(ticketingMessages.complaint),
      value: CaseTypeCaption.Complaint,
      icon: 'ban',
    },
    {
      title: formatMessage(ticketingMessages.suggestion),
      value: CaseTypeCaption.Suggestion,
      icon: 'commentAltLines',
    },
  ]
  return (
    <>
      <Stack
        px={{ sm: 4, xs: 2 }}
        py={{ sm: 2, xs: 1 }}
        bgcolor={{ sm: 'grey.100', xs: 'common.white' }}
        display={'flex'}
        flexDirection={{ sm: 'row', xs: 'column' }}
        alignItems={{ sm: 'center', xs: 'flex-start' }}
        borderRadius={'8px'}
        justifyContent="space-between"
      >
        <Stack display="flex" bgcolor={{ sm: 'grey.100', xs: 'common.white' }}>
          <Typography variant="h6">{formatMessage(ticketingMessages.request)}</Typography>
        </Stack>

        <Stack
          gap={{ sm: 4, xs: 1 }}
          flexDirection="row"
          display="flex"
          alignItems="center"
          bgcolor="grey.100"
          px={{ sm: 0, xs: 2 }}
          py={{ sm: 0, xs: 2 }}
          borderRadius={{ sm: 0, xs: 2 }}
          mt={{ sm: 0, xs: 2 }}
          ml={{ md: 20, sm: 10, xs: 0 }}
          width={{ xs: '100%' }}
        >
          <HBButton
            variant="outlined"
            size="small"
            onClick={(event) => {
              setAnchorEl(event.currentTarget)
            }}
            sx={{
              minWidth: { sm: 120, xs: 100 },
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              p: { xs: 1 },
            }}
          >
            <Typography variant="caption" pl={1}>
              {caseCaptionType
                ? ticketTypes.find((item) => item.value === caseCaptionType)?.title
                : formatMessage(ticketingMessages.sortBy)}
            </Typography>
            <HBIcon
              type="angleDown"
              size="small"
              sx={{
                color: 'secondary.main',
                lineHeight: 0,
              }}
            />
          </HBButton>

          <Popover
            sx={{
              borderRadius: 8,
            }}
            open={openStatePopover}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left',
            }}
            anchorEl={anchorEl}
            onClose={() => setAnchorEl(null)}
          >
            <MenuList component="nav">
              {ticketTypes.map((menu) => (
                <MenuItem onClick={() => onSelect(menu.value)} key={menu.title}>
                  <ListItemText>
                    <Stack
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        flexDirection: 'row',
                      }}
                    >
                      <HBIcon
                        sx={{
                          mr: 2,
                        }}
                        size="small"
                        type={menu.icon}
                      />
                      <Typography variant="subtitle2">{menu.title}</Typography>
                    </Stack>
                  </ListItemText>
                </MenuItem>
              ))}
            </MenuList>
          </Popover>
          <HBTextField
            sx={{
              bgcolor: 'common.white',
              [`&.${formControlClasses.root}`]: {
                width: '100% !important',
              },
            }}
            onChange={(event) => {
              onSearch(event.target.value)
            }}
            placeholder={formatMessage(ticketingMessages.searchPlaceholder)}
            InputProps={{
              sx: {
                borderRadius: '8px',
                fontVariant: 'caption',
                fontSize: 'caption.fontSize',
                minWidth: '100%',
                fontWeight: 400,
              },
              endAdornment: (
                <HBIcon
                  type="search"
                  sx={{
                    color: 'grey.900',
                    fontSize: 14,
                    alignItems: 'center',
                    display: 'flex',
                  }}
                />
              ),
            }}
          />

          <HBButton
            sx={{
              display: 'flex',
              gap: 2,
              alignItems: 'center',
              width: { xs: 40, sm: 147 },
              minWidth: { xs: 40, sm: 147 },
              boxShadow: 'none',
            }}
            color="primary"
            onClick={() => router.push('/profile/ticketing-create')}
            variant="contained"
          >
            <HBIcon
              size="small"
              type="plus"
              sx={{
                color: ({ palette }) => palette.common.white,
                alignItems: 'center',
                display: 'flex',
              }}
            />
            {!breakpointSmDown && (
              <Typography variant="subtitle2">
                {formatMessage(ticketingMessages.newRequest)}
              </Typography>
            )}
          </HBButton>
        </Stack>
      </Stack>
      {isLoading && <CommerceLoading />}
      {!tickets?.items?.length && <EmptyComponent searchValue={searchValue} />}
      <Grid container spacing={5} py={4}>
        {tickets?.items?.map((ticket, index) => (
          <Grid item lg={6} md={6} sm={6} xs={12}>
            <TicketItem data={ticket} key={ticket.id} />
          </Grid>
        ))}
      </Grid>
      {Number(tickets?.totalItems || 0) > PAGE_SIZE && (
        <Stack display="flex" justifyContent="flex-start">
          <Pagination
            totalRows={tickets?.totalItems ?? 0}
            onChange={(page) => setPage(page)}
            onChangeClient={(_, page) => setPage(page)}
            options={{ hideselectPage: true, hideGoto: true }}
            pageSize={PAGE_SIZE}
          />
        </Stack>
      )}
    </>
  )
}

export default TicketList
