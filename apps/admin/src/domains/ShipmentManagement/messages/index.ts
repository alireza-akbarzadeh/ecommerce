import { defineMessages } from 'react-intl'

type ShipmentManagementMessage = {
  [key: string]: {
    id: string
    defaultMessage: string
  }
}
const ShipmentManagementMessage: ShipmentManagementMessage = defineMessages({
  shipmentManagement: {
    id: `app.domains.Shipment.management.ShipmentManagement`,
    defaultMessage: 'مدیریت مرسوله',
  },
  providerName: {
    id: `app.domains.Shipment.management.providerName`,
    defaultMessage: 'سرویس دهنده حمل',
  },
  pickup: {
    id: `app.domains.Shipment.management.pickup`,
    defaultMessage: 'جمع آوری:',
  },
  range: {
    id: `app.domains.Shipment.management.range`,
    defaultMessage: 'بازه:',
  },
  delivery: {
    id: `app.domains.Shipment.management.delivery`,
    defaultMessage: 'ارسال:',
  },
  recieverPhoneNumber: {
    id: `app.domains.Shipment.management.recieverPhoneNumber`,
    defaultMessage: 'موبایل تحویل گیرنده',
  },
  filterType: {
    id: `app.domains.Shipment.management.filterType`,
    defaultMessage: 'نوع فیلتر تاریخ',
  },
  startDate: {
    id: `app.domains.Shipment.management.startDate`,
    defaultMessage: 'ازتاریخ',
  },
  endDate: {
    id: `app.domains.Shipment.management.ShipmentManagement`,
    defaultMessage: ' تا تاریخ',
  },

  shipmentCoName: {
    id: `app.domains.Shipment.management.shipmentCoName`,
    defaultMessage: 'شرکت حمل',
  },
  shipmentStatus: {
    id: `app.domains.Shipment.management.shipmentStatus`,
    defaultMessage: 'وضعیت مرسوله',
  },
  shipmentStatusProvider: {
    id: `app.domains.Shipment.management.shipmentStatusProvider`,
    defaultMessage: 'وضعیت سرویس دهنده',
  },
  buyer: {
    id: `app.domains.Shipment.management.buyer`,
    defaultMessage: 'خریدار',
  },
  infoType: {
    id: `app.domains.Shipment.management.infoType`,
    defaultMessage: 'نوع اطلاعات',
  },
  showProduct: {
    id: `app.domains.Shipment.management.showProduct`,
    defaultMessage: 'نمایش کالاها',
  },
  shipmentCode: {
    id: `app.domains.Shipment.management.shipmentCode`,
    defaultMessage: 'کد مرسوله',
  },
  shipmentDate: {
    id: `app.domains.Shipment.management.shipmentDate`,
    defaultMessage: 'تاریخ مرسوله',
  },
  createDate: {
    id: `app.domains.Shipment.management.createDate`,
    defaultMessage: 'تاریخ سفارش',
  },
  shipmentResponsible: {
    id: `app.domains.Shipment.management.shipmentResponsible`,
    defaultMessage: 'مسئول حمل',
  },
  shippingProvider: {
    id: `app.domains.Shipment.management.shipmentResponsible`,
    defaultMessage: 'سرویس دهنده',
  },
  shippingCoName: {
    id: `app.domains.Shipment.management.shippingCoName`,
    defaultMessage: 'شرکت حمل',
  },
  gatheringDate: {
    id: `app.domains.Shipment.management.gatheringDate`,
    defaultMessage: 'تاریخ جمع آوری',
  },
  gatheringLocation: {
    id: `app.domains.Shipment.management.gatheringLocation`,
    defaultMessage: 'محل جمع آوری',
  },
  deliveryDate: {
    id: `app.domains.Shipment.management.deliveryDate`,
    defaultMessage: 'تاریخ تحویل',
  },
  shoppingCartId: {
    id: `app.domains.Shipment.management.shoppingCartId`,
    defaultMessage: 'شماره سفارش',
  },
  postalTrackingCode: {
    id: `app.domains.Shipment.management.postalTrackingCode`,
    defaultMessage: ' کد رهگیری پستی',
  },
  transferee: {
    id: `app.domains.Shipment.management.transferee`,
    defaultMessage: 'تحویل گیرنده',
  },
  deliveryAddress: {
    id: `app.domains.Shipment.management.deliveryAddress`,
    defaultMessage: 'آدرس تحویل',
  },
  shipmentFee: {
    id: `app.domains.Shipment.management.deliveryAddress`,
    defaultMessage: 'هزینه ارسال',
  },
  deliveryHours: {
    id: `app.domains.Shipment.management.deliveryHours`,
    defaultMessage: 'زمان تحویل',
  },
  packagingCoast: {
    id: `app.domains.Shipment.management.deliveryAddress`,
    defaultMessage: 'هزینه بسته بندی',
  },
  vendorShare: {
    id: `app.domains.Shipment.management.deliveryAddress`,
    defaultMessage: 'سهم فروشنده',
  },
  customerShare: {
    id: `app.domains.Shipment.management.deliveryAddress`,
    defaultMessage: 'سهم مشتری',
  },
  vendorDemand: {
    id: `app.domains.Shipment.management.vendorDemand`,
    defaultMessage: 'طلب فروشنده',
  },
  shippingCommission: {
    id: `app.domains.Shipment.management.shippingCommission`,
    defaultMessage: 'کمیسیون حمل',
  },
  notificationStatus: {
    id: `app.domains.Shipment.management.notificationStatus`,
    defaultMessage: 'وضعیت اطلاع رسانی',
  },
  settlementDate: {
    id: `app.domains.Shipment.management.settlementDate`,
    defaultMessage: 'تاریخ تسویه',
  },
  relatedProduct: {
    id: `app.domains.Shipment.management.relatedProduct`,
    defaultMessage: 'کالاهای مرتبط',
  },
  deliveryHistory: {
    id: `app.domains.Shipment.management.deliveryHistory`,
    defaultMessage: 'تاریخچه مرسوله',
  },
  productName: {
    id: `app.domains.Shipment.management.productName`,
    defaultMessage: 'نام کالا',
  },
  storeName: {
    id: `app.domains.Shipment.management.storeName`,
    defaultMessage: 'نام فروشگاه',
  },
  systemDescription: {
    id: `app.domains.Shipment.management.systemDescription`,
    defaultMessage: 'شرح سیستمی',
  },
  HSIN: {
    id: `app.domains.Shipment.management.HSIN`,
    defaultMessage: 'HSIN',
  },
  vendorName: {
    id: `app.domains.Shipment.management.vendorName`,
    defaultMessage: 'فروشنده',
  },
  qty: {
    id: `app.domains.Shipment.management.qty`,
    defaultMessage: 'تعداد    ',
  },
  originalPrice: {
    id: `app.domains.Shipment.management.originalPrice`,
    defaultMessage: 'قیمت اصلی',
  },
  discountAmount: {
    id: `app.domains.Shipment.management.discountAmount`,
    defaultMessage: 'مبلغ تخفیف',
  },
  finalPrice: {
    id: `app.domains.Shipment.management.finalPrice`,
    defaultMessage: 'قیمت نهایی',
  },
  serviceProvider: {
    id: `app.domains.Shipment.management.serviceProvider`,
    defaultMessage: 'سرویس دهنده',
  },
  platformShare: {
    id: `app.domains.Shipment.management.platformShare`,
    defaultMessage: 'سهم پلتفرم',
  },
  historyShipmentStatus: {
    id: `app.domains.Shipment.management.historyShipmentStatus`,
    defaultMessage: 'تاریخچه وضعیت ارسال کالا',
  },
  numberOfProducts: {
    id: `app.domains.Shipment.management.numberOfProducts`,
    defaultMessage: 'تعداد کالاها',
  },
  deliveryTypesName: {
    id: `app.domains.Shipment.management.deliveryTypesName`,
    defaultMessage: 'سرویس دهنده حمل',
  },
  reciverName: {
    id: `app.domains.Shipment.management.reciverName`,
    defaultMessage: ' تحویل گیرنده:',
  },
  reciverPhoneNumber: {
    id: `app.domains.Shipment.management.reciverPhoneNumber`,
    defaultMessage: 'موبایل تحویل گیرنده:',
  },
  reciverAddress: {
    id: `app.domains.Shipment.management.reciverAddress`,
    defaultMessage: 'آدرس تحویل گیرنده:',
  },
  especialOffer: {
    id: `app.domains.Shipment.management.especialOffer`,
    defaultMessage: 'پیشنهاد ویژه',
  },
  number: {
    id: `app.domains.Shipment.management.number`,
    defaultMessage: 'عدد',
  },
  commentReview: {
    id: `app.domains.Shipment.management.commentReview`,
    defaultMessage: 'مشاهده دیدگاه ها',
  },
  commentReviewSubmit: {
    id: `app.domains.Shipment.management.commentReviewSubmit`,
    defaultMessage: 'مشاهده دیگاه های ثبت شده',
  },
  thereIsNotCommentReview: {
    id: `app.domains.Shipment.management.thereIsNotCommentReview`,
    defaultMessage: 'دیدگاهی وجود ندارد.',
  },
  shippingAmount: {
    id: `app.domains.Shipment.management.shippingAmount`,
    defaultMessage: 'مشاهده دیگاه های ثبت شده',
  },
  deliveryCode: {
    id: `app.domains.Shipment.management.deliveryCode`,
    defaultMessage: 'مشاهده دیگاه های ثبت شده',
  },
  trackingNumber: {
    id: `app.domains.Shipment.management.trackingNumber`,
    defaultMessage: 'مشاهده دیگاه های ثبت شده',
  },
  stateTitle: {
    id: `app.domains.Shipment.management.stateTitle`,
    defaultMessage: 'وضعیت ارسال',
  },
  providerStateTitle: {
    id: `app.domains.Shipment.management.providerStateTitle`,
    defaultMessage: 'وضعیت ارسال(سرویس دهنده)',
  },
  deliveryAuthenticateCode: {
    id: `app.domains.Shipment.management.deliveryAuthenticateCode`,
    defaultMessage: 'کد تحویل',
  },
  recieverName: {
    id: `app.domains.Shipment.management.recieverName`,
    defaultMessage: 'تحویل گیرنده',
  },
})

export default ShipmentManagementMessage
