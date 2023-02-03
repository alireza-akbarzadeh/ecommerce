import useBasketMethods from '@hasty-bazar-commerce/core/hook/useBasketMethods'
import { HBCardWidget, HBCardWidgetProps } from '@hasty-bazar/core'
import { FC } from 'react'
import { useIntl } from 'react-intl'
import landingMessages from '../landing.messages'

const CardWidgetCustom: FC<HBCardWidgetProps> = (props) => {
  const { formatMessage } = useIntl()
  const { addToBasket, addingLoading, count, handleMinus, decreasingLoading } = useBasketMethods({
    productId: props?.data?.id || '',
    vendorId: props?.data?.vendorId,
    coefficient: 1,
  })

  return (
    <HBCardWidget
      {...props}
      {...{ addToBasket, addingLoading, count, handleMinus, decreasingLoading }}
      addToBasketTitle={formatMessage(landingMessages.addToBasket)}
      unavailableTitle={formatMessage(landingMessages.unavailable)}
      specialOfferTitle={formatMessage(landingMessages.specialOffer)}
      numberLeftInStockTitle={formatMessage(landingMessages.numberLeftInStock)}
    />
  )
}
export default CardWidgetCustom
