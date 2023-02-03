import {
  AttributeDto,
  SpecificAttributeDto,
} from '@hasty-bazar/admin-shared/services/saleApi.generated'

export interface PropsModel {
  vendorsShipmentData?: any
}

export type ShipmentProductsModel = {
  productId?: string
  productName?: string | null
  originalPrice?: number | null
  finalPrice?: number | null
  shoppingCartQuantity?: number
  currency?: string | null
  imageUrl?: string | null
  specificAttributes?: SpecificAttributeDto[] | null
  attribute?: AttributeDto[] | null
}

export interface ExtractShippingTrackingsListModel {
  shipmentTypesName?: string | null
  shipmentPrice?: number
  deliveryCode?: string | null
  deliveryTypesName?: string | null
  deliveryStatusName?: string | null
  shipmentTrackingCode?: string
  deliveryOpenDate?: string | null
  deliveryDate?: string
  sharePlatform?: number
  predictDeliveryDate?: string
  shareVendor?: number
  deliveryCoName?: string | null
  gatheringDate?: string
  shipmentFee?: number
  shareCustomer?: number
  deliveryServiceStatusName?: string | null
  trackingNumber?: string | null
}

export interface ReciverModel {
  reciverName?: string | null
  reciverPhoneNumber?: string | null
  reciverAddress?: string | null
}
