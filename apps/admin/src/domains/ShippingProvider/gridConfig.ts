import { HBAgGridClasses } from '@hasty-bazar/core'
import ShippingProviderMessages from './shippingProvider.message'

export const breadcrumbsItems = (formatMessage: (params: {}) => string) => [
  {
    url: '/',
    title: formatMessage(ShippingProviderMessages.dashboard),
  },
  {
    url: '#',
    title: formatMessage(ShippingProviderMessages.shippingProviderInfo),
  },
]

export const classes: HBAgGridClasses = {
  wrapper: {
    height: `calc(100vh - 240px)`,
  },
}
