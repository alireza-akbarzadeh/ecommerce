import { ReactNode } from 'react'

export enum BrandPageDisplayType {
  // [Display(Name = "صفحه پیش فرض برند")]
  DefaultPage = 1105001,
  // [Display(Name = "صفحات دیگر")]
  OtherPage = 1105002,
  // [Display(Name = "کالاهای این برند")]
  BrandProducts = 1105003,
}

export enum PageDisplayType {
  ProductListPage = 1106001,
  DataDefault = 1106002,
}

export enum DisplayExtractType {
  // [Display(Name = "صفحه نمایش")]
  Fixed = 1030001,

  // [Display(Name = "مجموعه")]
  Dynamic = 1030002,

  // [Display(Name = "کالاهای همین گروه")]
  Default = 1030003,

  // [Display(Name = "غیر قابل انتخاب")]
  Notselected = 1030004,
}

export type DeliveryType = 1
export type DeliveryMethodType = {
  name?: string | null
  icon?: string | null
  type?: DeliveryType
}
export type CampaignType = {
  fromDate?: string
  toDate?: string | null
  count?: number
  price?: number
  remainingSecond?: string | null
}

export type BusinessQueryCampaign = {
  fromDate?: string
  toDate?: string | null
  count?: number
  price?: number
  discount?: number
  discountPrice?: number
  remainingSecond?: string | null
}

export type CollectionData = {
  id?: string
  parentId?: string | null
  title?: string | null
  headerTitle?: string | null
  link?: string | null
  name?: string | null
  description?: string | null
  metaData?: string | null
  order?: number | null
  deliveryMethod?: BusinessQueryDeliveryMethod
  tooltip?: string | null
  price?: number | null
  oldPrice?: number | null
  campaigns?: BusinessQueryCampaign[] | null
  discountPercentage?: number | null
  currencyName?: string | null
  rate?: number | null
  rateCount?: string | null
  followingCount?: number | null
  imageUrl?: string | null
  vendorId?: string | null
  vendorName?: string | null
  categoryId?: string | null
  brandId?: string | null
  quantity?: number | null
  quantityText?: string | null
  quantityHTML?: string | null
  minimalPerOrder?: number | null
  maximalPerOrder?: number | null
  storeName?: string | null
  hasPromotion?: boolean
  categoryDisplayExtractType?: DisplayExtractType
  categoryPageId?: string | null
  categoryPageOriginName?: string | null
  categoryCollectionId?: string | null
  brandPageDisplayType?: BrandPageDisplayType
  brandPageId?: string | null
  hsin?: string | null
  slug?: string | null
}

export interface HBCardWidgetProps extends CollectionData {
  type: CardType
  basketCount?: number
  height?: number
  noDivider?: boolean
  noAction?: boolean
  vendorName?: string
}

export type CardType =
  | 'BUSINESS_SLIDER_DEFAULT'
  | 'BUSINESS_SLIDER_BRANDS'
  | 'BUSINESS_SLIDER_WITH_SIDEBAR'
  | 'BUSINESS_SLIDER_SELLER'
  | 'BUSINESS_SLIDER_BUYERCATEGORY'
  | 'BUSINESS_SLIDER_SINGLE'
  | 'BUSINESS_SLIDER_MOST'
  | 'BUSINESS_SLIDER_SUGGESTED_CATEGORIES'
  | 'SEARCH_AND_COLLECTION_RESULT'

export interface HBCardWidgetProps {
  data: CollectionData
  type: CardType
  basketCount?: number
  height?: number
  noDivider?: boolean
  addToBasketTitle?: ReactNode
  unavailableTitle?: ReactNode
  specialOfferTitle?: ReactNode
  numberLeftInStockTitle?: string
  addToBasket?: () => void
  addingLoading?: boolean
  count?: number
  handleMinus?: () => void
  decreasingLoading?: boolean
}
