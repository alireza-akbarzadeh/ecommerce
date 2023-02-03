import { OtherVendorsModal, SimilarProductsModal } from '@hasty-bazar-commerce/containers'
import { ApiConstants } from '@hasty-bazar-commerce/core/constants'
import {
  useDeleteWebSaleBasketByClientSessionIdItemsAndShoppingCartProductIdMutation,
  usePutWebSaleBasketByClientSessionIdAndProductIdItemsQuantityMutation,
} from '@hasty-bazar-commerce/Service-Enhancers/BasketApi.enhanced'
import { NotificationMetaDataButton } from '@hasty-bazar-commerce/services/saleApi.generated'
import { BasketNotificationSubjectFuncs } from '@hasty-bazar-commerce/subjects/BasketNotificationSubject'
import { HBButton } from '@hasty-bazar/core'
import { FC, useState } from 'react'
interface INotificationButtonProps extends NotificationMetaDataButton {
  removeNotification: () => void
  shoppingCartId: string
  clientSessionId: string | null
  productId: string
  vendorId: string
}

const NotificationButton: FC<INotificationButtonProps> = (props) => {
  const {
    removeNotification,
    shoppingCartId,
    clientSessionId,
    productId,
    textButton,
    actionType,
    vendorId,
  } = props
  const [openOtherVendors, setOpenOtherVendors] = useState<boolean>(false)
  const [openSimilarProducts, setOpenSimilarProducts] = useState<boolean>(false)
  const [removeMutation, { isLoading: removeLoading }] =
    useDeleteWebSaleBasketByClientSessionIdItemsAndShoppingCartProductIdMutation()
  const [updateQuantity, { isLoading: updateLoading }] =
    usePutWebSaleBasketByClientSessionIdAndProductIdItemsQuantityMutation()

  const sendRemoveNotificationEvent = () => {
    BasketNotificationSubjectFuncs.notificationRemoved(shoppingCartId)
  }

  const notificationCallBack = (type: string) => {
    const modes: Record<string, any> = {
      AvaliableOtherVendor: () => handleOtherVendorsAlert(),
      AvaliableOtherProduct: () => handleSimilarProduct(),
      PriceChange: () => handlePriceChange(),
      InventoryChange: () => handleInventoryChange(),
      UnAvailableInventory: () => handleUnAvailableInventory(),
      RemoveBasketItem: () => handleUnAvailableInventory(),
      UpdateBasketItemQuantity: () => handleUpdateBasketQuantity(),
    }
    modes[type ?? '']()
  }

  const handleOtherVendorsAlert = () => {
    setOpenOtherVendors(true)
  }

  const handleSimilarProduct = () => {
    setOpenSimilarProducts(true)
  }

  const handlePriceChange = () => {
    removeNotification()
  }

  const handleInventoryChange = () => {
    removeNotification()
    sendRemoveNotificationEvent()
  }

  const handleUnAvailableInventory = () => {
    handleRemoveFromBasket()
    removeNotification()
    sendRemoveNotificationEvent()
  }

  const handleUpdateBasketQuantity = () => {
    handleChangeQuantity()
    sendRemoveNotificationEvent()
  }

  const handleRemoveFromBasket = () => {
    removeMutation({
      ...ApiConstants,
      clientSessionId: clientSessionId!,
      shoppingCartProductId: productId!,
    })
  }

  const handleChangeQuantity = () => {
    updateQuantity({
      ...ApiConstants,
      clientSessionId: clientSessionId!,
      productId: productId!,
    })
  }

  return (
    <>
      <HBButton
        sx={{ minWidth: 'unset', height: 32, width: 'max-content' }}
        loading={removeLoading || updateLoading}
        onClick={() => (actionType ? notificationCallBack(actionType) : removeNotification())}
      >
        {textButton}
      </HBButton>
      <OtherVendorsModal
        onClose={() => {
          setOpenOtherVendors(false)
          handleRemoveFromBasket()
          sendRemoveNotificationEvent()
          removeNotification()
        }}
        open={openOtherVendors}
        productId={productId ?? ''}
        vendorId={vendorId ?? ''}
      />

      <SimilarProductsModal
        onClose={() => {
          setOpenSimilarProducts(false)
          handleRemoveFromBasket()
          sendRemoveNotificationEvent()
          removeNotification()
        }}
        open={openSimilarProducts}
        productId={props.productId ?? ''}
      />
    </>
  )
}

export default NotificationButton
