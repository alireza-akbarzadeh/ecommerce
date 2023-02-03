import { useAppSelector } from '@hasty-bazar/admin-shared/core/redux/hooks'
import { useGetAdminCatalogProductsPreviewByIdQuery } from '@hasty-bazar/admin-shared/services/catalogApi.generated'
import { isServer } from '@hasty-bazar/admin-shared/utils'
import { HBButton, HBDialog } from '@hasty-bazar/core'
import {
  dialogClasses,
  dialogContentClasses,
  ListItemText,
  MenuItem,
  MenuList,
  Popover,
  Stack,
  Typography,
} from '@mui/material'
import { Box } from '@mui/system'
import CardWidget from 'libs/core/src/components/HBWidgets/HBCardWidget/HBCardWidget'
import { useRouter } from 'next/router'
import React, { useState } from 'react'
import { useIntl } from 'react-intl'
import ProductPageMessages from '../../ProductPage.messages'

export default function ProductPreviewButtons() {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null)
  const [openPLPModal, setOpenPLPModal] = useState(false)
  const { formatMessage } = useIntl()
  const { id } = useRouter().query as { id: string }
  const productData = useGetAdminCatalogProductsPreviewByIdQuery(
    {
      'client-name': 'HIT.Hastim.Catalog.Endpoints.WebApi',
      'client-version': '1.0.0',
      id,
    },
    {
      skip: !id,
    },
  )
  const defaultCurrency = useAppSelector((state) => state.app.defaultCurrencyTitle)
  const uniqueProducts = productData.data?.data?.uniqueProducts || []

  const product = productData.data?.data || {}
  const openStatePopover = Boolean(anchorEl)

  const menus = [
    {
      title: formatMessage(ProductPageMessages.previewInPLP),
      onClick: () => {
        setOpenPLPModal(true)
      },
    },
    {
      title: formatMessage(ProductPageMessages.previewInPDP),
      onClick: () => {
        if (!isServer()) {
          uniqueProducts.forEach((item) => {
            window.open(
              `${window.location.origin}/products/preview/${item.id}`,
              '_blank',
              'noopener,noreferrer',
            )
          })
        }
      },
    },
  ]
  if (!id) {
    return null
  }
  return (
    <>
      <Box
        display={'flex'}
        flexDirection="row"
        alignItems="center"
        gap={4}
        my={2}
        justifyContent="flex-start"
      >
        <Typography variant="subtitle1">
          {formatMessage(ProductPageMessages.productPreviewTitle)}
        </Typography>
        <HBButton
          variant="outlined"
          size="small"
          onClick={(event) => {
            setAnchorEl(event.currentTarget)
          }}
          sx={{
            minWidth: 80,
          }}
        >
          {formatMessage(ProductPageMessages.preview)}
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
            {menus.map((menu) => (
              <MenuItem onClick={menu.onClick} key={menu.title}>
                <ListItemText sx={{ minWidth: 150 }}>
                  <Typography variant="subtitle2">{menu.title}</Typography>
                </ListItemText>
              </MenuItem>
            ))}
          </MenuList>
        </Popover>
      </Box>
      <HBDialog
        open={openPLPModal}
        maxWidth="sm"
        title={formatMessage(ProductPageMessages.previewInPLP)}
        onClose={() => setOpenPLPModal(false)}
        onBackdropClick={() => setOpenPLPModal(false)}
        sx={{
          [`& .${dialogClasses.paper}`]: { borderRadius: 4, position: 'relative' },
          [`& .${dialogContentClasses.root}`]: {
            p: 10,
          },
        }}
      >
        <Stack display="flex" flexDirection="row" gap={8} p={6}>
          {uniqueProducts.map((item) => (
            <CardWidget
              data={{
                imageUrl: `${process.env.NEXT_PUBLIC_CDN}/${item.defaultImage}`,
                title: item.name,
                quantity: 2,
                ...item,
                price: item.price,
                currencyName: defaultCurrency,
                discountPercentage: item.discount,
              }}
              noAction
              type="BUSINESS_SLIDER_MOST"
              key={item.id}
            />
          ))}
        </Stack>
      </HBDialog>
    </>
  )
}
