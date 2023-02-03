import { ApiConstants } from '@hasty-bazar-commerce/core/constants'
import useClientSession from '@hasty-bazar-commerce/core/hook/useClientSession'
import { useDeleteWebSaleBasketByClientSessionIdVendorAndVendorIdRelatedMutation } from '@hasty-bazar-commerce/Service-Enhancers/BasketApi.enhanced'
import {
  NotificationDto,
  VendorBasketItemDto,
} from '@hasty-bazar-commerce/services/saleApi.generated'
import { HBAccordion, HBIcon, HBMenu } from '@hasty-bazar/core'
import {
  accordionClasses,
  accordionSummaryClasses,
  Divider,
  Hidden,
  Stack,
  styled,
  Theme,
  Typography,
  useMediaQuery,
} from '@mui/material'
import { FC, useState } from 'react'
import { FormattedMessage } from 'react-intl'
import BasketMessages from '../basket.messages'
import { ByVendorItem } from '../components'

const ClickableStyle = styled(Stack)(() => ({
  cursor: 'pointer',
}))

interface IByVendorProps {
  vendor: VendorBasketItemDto
  index: number
  notifications: NotificationDto[]
}

const DividerStyle = styled(Divider)(({ theme }) => ({
  borderColor: theme.palette.grey[100],
}))

const ByVendor: FC<IByVendorProps> = (props) => {
  const breakpointDownSm = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'))
  const { vendor, index, notifications } = props
  const [expanded, setExpanded] = useState<boolean>(
    index === 0 || notifications.length ? true : false,
  )
  const [expandedDisable, setExpandedDisable] = useState<boolean>(false)
  const clientSessionId = useClientSession()

  const [removeVendorItemsMutation] =
    useDeleteWebSaleBasketByClientSessionIdVendorAndVendorIdRelatedMutation()

  const changeExpandableFromChild = (status: boolean) => {
    if (status) {
      setExpanded(true)
      setExpandedDisable(true)
    } else {
      setExpandedDisable(false)
    }
  }

  return (
    <HBAccordion
      customSummary={
        <ClickableStyle
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          onClick={() => {
            if (expandedDisable) {
              return
            } else {
              setExpanded(!expanded)
            }
          }}
          sx={(theme) => ({
            bgcolor: !expanded ? 'grey.100' : 'common.white',
            width: '100%',
            py: 2,
            [theme.breakpoints.up('md')]: {
              paddingLeft: 4,
              paddingRight: 2,
            },
            borderRadius: 2,
          })}
        >
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            sx={{ width: '100%' }}
          >
            <Stack direction="row" alignItems="center" spacing={2}>
              <Stack direction="row" alignItems="center" spacing={1}>
                <Typography
                  color="text.prmary"
                  variant={breakpointDownSm ? 'subtitle2' : 'subtitle1'}
                >
                  <FormattedMessage {...BasketMessages.vendor} />
                </Typography>
                <Typography
                  color="info.main"
                  variant={breakpointDownSm ? 'subtitle2' : 'subtitle1'}
                >
                  {vendor.vendorName}
                </Typography>
              </Stack>
            </Stack>

            <HBMenu
              buttonProps={{
                variant: 'text',
                sx: {
                  minWidth: 0,
                  width: 24,
                  height: 24,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  p: 0,
                },
              }}
              content={
                <HBIcon
                  type="ellipsisV"
                  sx={{
                    color: 'grey.900',
                    display: 'flex',
                  }}
                />
              }
              menus={[
                {
                  content: (
                    <Stack direction="row" alignItems="center">
                      <HBIcon type="trashAlt" size="small" />
                      <Typography>
                        <FormattedMessage {...BasketMessages.removeVendorProducts} />
                      </Typography>
                    </Stack>
                  ),
                  onClick: () => {
                    removeVendorItemsMutation({
                      ...ApiConstants,
                      clientSessionId: clientSessionId!,
                      vendorId: vendor.vendorId!,
                    })
                  },
                },
              ]}
            />
          </Stack>
        </ClickableStyle>
      }
      expanded={expanded}
      sx={(theme) => ({
        [`& .${accordionClasses.expanded}`]: {
          margin: (theme) => `${theme.spacing(0)}!important`,
        },
        [`& .${accordionClasses.gutters}`]: {
          margin: (theme) => `${theme.spacing(0)}!important`,
          [`& .${accordionClasses.gutters}`]: {
            minHeight: 'unset',
            padding: 0,
          },
        },
        boxShadow: 'none',
        p: 0,
        borderRadius: 2,
        [theme.breakpoints.up('md')]: {
          border: expanded ? `1px solid ${theme.palette.grey[100]}` : 'none',
        },
        [theme.breakpoints.down('md')]: {
          [`& .${accordionSummaryClasses.root}`]: {
            padding: `${theme.spacing(0)}!important`,
          },
        },
      })}
      detail={
        <Stack px={4} spacing={6}>
          {vendor.items?.map((item) => {
            return (
              <>
                <Hidden mdDown>
                  <DividerStyle />
                </Hidden>
                <ByVendorItem
                  changeAccordionStatus={changeExpandableFromChild}
                  notifications={notifications.filter(
                    (n) => n.shoppingCartItemId === item.shoppingCartItemId,
                  )}
                  item={item}
                  vendorId={vendor.vendorId!}
                />
              </>
            )
          })}
        </Stack>
      }
    />
  )
}

export default ByVendor
