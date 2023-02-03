import phrasesMessages from '@hasty-bazar-admin/core/translations/phrases.messages'
import { HBAgGridClasses, MenuItemProps } from '@hasty-bazar/core'
import { ToolbarMoreItemsModel } from './types'
import VendorShippingAgrrementsMessages from './VendorShippingAgreements.message'

export const classes: HBAgGridClasses = {
  wrapper: {
    height: `calc(100vh - 240px)`,
  },
}

export const breadcrumbsItems = (formatMessage: (params: {}) => string) => [
  {
    url: '/',
    title: formatMessage(VendorShippingAgrrementsMessages.dashboard),
  },
  {
    url: '#',
    title: formatMessage(VendorShippingAgrrementsMessages.vendorShippingAgreement),
  },
]

export const moreItems = ({ formatMessage }: ToolbarMoreItemsModel): MenuItemProps[] => [
  {
    label: formatMessage(phrasesMessages.download),
    icon: 'fileDownload',
    onClick: () => {},
  },
  {
    label: formatMessage(phrasesMessages.downloadAll),
    icon: 'fileDownloadAlt',
    onClick: () => {},
  },
]
