import { TextWithHBIcon, TextWithIcon, VendorPrice } from '@hasty-bazar-commerce/components'
import { ProductBundleDto } from '@hasty-bazar-commerce/services/saleApi.generated'
import { HBButton, HBDialog } from '@hasty-bazar/core'
import { DialogProps, Divider, Stack, Typography } from '@mui/material'
import { Box } from '@mui/system'
import Image from 'next/image'
import { FC, useState } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import CheckoutPageMessages from '../../CheckoutPage.messages'
import { ChooseAddressDialog } from '../shippingBody'

interface IUnableShippingProducts extends Required<Pick<DialogProps, 'onClose'>> {
  productsList: ProductBundleDto[]
}

const UnableShippingProducts: FC<IUnableShippingProducts> = ({ productsList, onClose }) => {
  const { formatMessage } = useIntl()
  const [openAddressesDialog, setOpenAddressesDialog] = useState<boolean>(false)
  // const [deleteProducts] =
  //   useDeleteWebSaleShoppingCartByClientSessionIdAndPartyIdItemsShoppingCartProductIdsMutation()

  const handleDeleteProducts = async () => {
    const bodyData = productsList?.map((product) => product.productId ?? '')
    // const payload = await deleteProducts({
    //
    //   ...ApiConstants,
    //   clientSessionId: clientSessionId ?? '0',
    //   partyId: data?.user?.partyId ?? '0',
    //   body: bodyData ?? [],
    // }).unwrap()

    // if (payload.success) onClose({}, 'backdropClick')
  }

  return (
    <>
      <HBDialog
        sx={{ maxWidth: 710, margin: '0 auto' }}
        open
        title={formatMessage(CheckoutPageMessages.attentionMessage)}
        onClose={handleDeleteProducts}
        onReject={handleDeleteProducts}
      >
        <Stack rowGap={4}>
          <Stack direction="row" px={4} py={2} bgcolor="warning.main" borderRadius={2}>
            <TextWithHBIcon
              iconType="exclamationCircle"
              iconColor="common.white"
              textColor="common.white"
              text={formatMessage(CheckoutPageMessages.unableShippingProductsMessage)}
            />
          </Stack>

          <Stack
            spacing={3}
            py={6}
            divider={<Divider variant="middle" sx={{ color: 'grey.200' }} />}
          >
            {productsList?.map((product, index: number) => {
              return <SingleProductItem key={index} productItem={product} />
            })}
          </Stack>

          <Stack direction="row" sx={{ flex: 1, justifyContent: 'space-between' }}>
            <HBButton onClick={() => setOpenAddressesDialog(true)} variant="outlined">
              <FormattedMessage {...CheckoutPageMessages.changeAddress} />
            </HBButton>
            <HBButton onClick={handleDeleteProducts}>
              <FormattedMessage {...CheckoutPageMessages.deleteProduct} />
            </HBButton>
          </Stack>
        </Stack>
      </HBDialog>
      {openAddressesDialog && (
        <ChooseAddressDialog
          onClose={() => setOpenAddressesDialog(false)}
          open={openAddressesDialog}
        />
      )}
    </>
  )
}

const SingleProductItem: FC<{ productItem: ProductBundleDto }> = ({ productItem }) => {
  const { imageUrl, originalPrice, unitPrice, productName, specificAttributes, attribute } =
    productItem
  return (
    <Stack spacing={4} direction="row">
      <Box
        sx={{
          borderRadius: 2,
          overflow: 'hidden',
          width: '100px',
          height: '100px',
          position: 'relative',
        }}
      >
        <Image layout="fill" src={`${process.env.NEXT_PUBLIC_CDN}${imageUrl}`} />
      </Box>
      <Stack spacing={2}>
        <Typography variant="subtitle2">{productName}</Typography>
        <Stack spacing={2}>
          {/* special attributes */}
          {specificAttributes &&
            specificAttributes.map((attr: any, index: number) => {
              if (attr.componentType === 'redioButton')
                return (
                  <Stack direction="row" alignItems="center" spacing={1} key={index}>
                    {attr.valueTitle && (
                      <Box
                        sx={{
                          borderRadius: '100%',
                          border: (theme) => `1px solid ${theme.palette.grey[300]}`,
                          width: 16,
                          height: 16,
                          backgroundColor: attr.value,
                        }}
                      />
                    )}
                    {attr.valueTitle && <Typography variant="body2">{attr.valueTitle}</Typography>}
                  </Stack>
                )
              else if (attr.componentType === 'lable')
                return (
                  <TextWithIcon
                    icon={`${process.env.NEXT_PUBLIC_CDN}${attr.icon}`}
                    text={attr.valueTitle}
                    key={index}
                  />
                )
            })}
        </Stack>

        <VendorPrice
          currency={''}
          oldPrice={originalPrice}
          price={unitPrice ?? 0}
          justifyContent="flex-start"
        />
      </Stack>
    </Stack>
  )
}

export default UnableShippingProducts
