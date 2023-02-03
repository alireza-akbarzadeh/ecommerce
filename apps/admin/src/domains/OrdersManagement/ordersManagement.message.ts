import { defineMessages } from 'react-intl'

type OrdersManagementMessage = {
  [key: string]: {
    id: string
    defaultMessage: string
  }
}
const OrdersManagementMessage: OrdersManagementMessage = defineMessages({
  ordersManagement: {
    id: `app.domains.orders.management.ordersManagement`,
    defaultMessage: 'مدیریت سفارشات',
  },
  ordersManagementInfo: {
    id: `app.domains.orders.management.ordersManagementInfo`,
    defaultMessage: 'اطلاعات مدیریت سفارشات',
  },
  addOrdersManagement: {
    id: `app.domains.orders.management.addOrdersManagement`,
    defaultMessage: 'افزودن مدیریت سفارشات',
  },
  editOrdersManagement: {
    id: `app.domains.orders.management.editOrdersManagement`,
    defaultMessage: 'ویرایش مدیریت سفارشات',
  },
  numberOfProducts: {
    id: `app.domains.orders.management.numberOfProducts`,
    defaultMessage: 'تعداد کالاها:',
  },
  seller: {
    id: `app.domains.orders.management.seller`,
    defaultMessage: 'فروشنده:',
  },
  shipmentCode: {
    id: `app.domains.orders.management.shipmentCode`,
    defaultMessage: 'کد مرسوله:',
  },
  shipmentPostalCode: {
    id: `app.domains.orders.management.shipmentPostalCode`,
    defaultMessage: 'کد مرسوله پستی',
  },
  shipmentTypesName: {
    id: `app.domains.orders.management.shipmentTypesName`,
    defaultMessage: 'مسئول حمل:',
  },
  shipmentFee: {
    id: `app.domains.orders.management.shipmentFee`,
    defaultMessage: 'هزینه ارسال:',
  },
  deliveryCode: {
    id: `app.domains.orders.management.deliveryCode`,
    defaultMessage: 'کد تحویل:',
  },
  deliveryTypesName: {
    id: `app.domains.orders.management.deliveryTypesName`,
    defaultMessage: 'سرویس دهنده حمل:',
  },
  deliveryStatusName: {
    id: `app.domains.orders.management.deliveryStatusName`,
    defaultMessage: 'وضعیت مرسوله:',
  },
  deliveryServiceStatusName: {
    id: `app.domains.orders.management.deliveryServiceStatusName`,
    defaultMessage: 'وضعیت ارسال(سرویس دهنده):',
  },
  trackingNumber: {
    id: `app.domains.orders.management.trackingNumber`,
    defaultMessage: 'کد رهگیری پستی:',
  },
  deliveryOpenDate: {
    id: `app.domains.orders.management.deliveryOpenDate`,
    defaultMessage: 'بازه تحویل:',
  },
  pickup: {
    id: `app.domains.orders.management.pickup`,
    defaultMessage: 'جمع آوری:',
  },
  range: {
    id: `app.domains.orders.management.range`,
    defaultMessage: 'بازه:',
  },
  delivery: {
    id: `app.domains.orders.management.delivery`,
    defaultMessage: 'ارسال:',
  },
  realDeliveryDate: {
    id: `app.domains.orders.management.realDeliveryDate`,
    defaultMessage: ' زمان تحویل واقعی:',
  },
  gatheringDate: {
    id: `app.domains.orders.management.gatheringDate`,
    defaultMessage: ' زمان جمع آوری:',
  },
  deliveryDate: {
    id: `app.domains.orders.management.deliveryDate`,
    defaultMessage: 'زمان تحویل واقعی:',
  },
  reciverName: {
    id: `app.domains.orders.management.reciverName`,
    defaultMessage: ' تحویل گیرنده:',
  },
  reciverPhoneNumber: {
    id: `app.domains.orders.management.reciverPhoneNumber`,
    defaultMessage: 'موبایل تحویل گیرنده:',
  },
  reciverAddress: {
    id: `app.domains.orders.management.reciverAddress`,
    defaultMessage: 'آدرس تحویل گیرنده:',
  },
  especialOffer: {
    id: `app.domains.orders.management.especialOffer`,
    defaultMessage: 'پیشنهاد ویژه',
  },
  hasti: {
    id: `app.domains.orders.management.hasti`,
    defaultMessage: 'هستی',
  },
  vendorName: {
    id: `app.domains.orders.management.vendorName`,
    defaultMessage: 'فروشنده:',
  },
  sharePlatform: {
    id: `app.domains.orders.management.sharePlatform`,
    defaultMessage: 'سهم پلتفرم:',
  },
  shareVendor: {
    id: `app.domains.orders.management.shareVendor`,
    defaultMessage: 'سهم فروشنده:',
  },
  shareCustomer: {
    id: `app.domains.orders.management.shareCustomer`,
    defaultMessage: 'سهم خریدار:',
  },
  predictDeliveryDate: {
    id: `app.domains.orders.management.predictDeliveryDate`,
    defaultMessage: 'پیش بینی زمان تحویل:',
  },
  deliveryCoName: {
    id: `app.domains.orders.management.deliveryCoName`,
    defaultMessage: 'شرکت حمل:',
  },
  color: {
    id: `app.domains.orders.management.color`,
    defaultMessage: 'قرمز',
  },
  number: {
    id: `app.domains.orders.management.number`,
    defaultMessage: 'عدد',
  },
  paymentMethod: {
    id: `app.domains.orders.management.paymentMethod`,
    defaultMessage: 'نوع پرداخت (بابت) ',
  },
  transactionMethod: {
    id: `app.domains.orders.management.paymentMethod`,
    defaultMessage: 'نوع پرداخت ',
  },
  paymentDate: {
    id: `app.domains.orders.management.paymentDate`,
    defaultMessage: 'تاریخ پرداخت',
  },
  transactionId: {
    id: `app.domains.orders.management.transactionType`,
    defaultMessage: 'شناسه  پرداخت',
  },
  paymentAmount: {
    id: `app.domains.orders.management.paymentAmount`,
    defaultMessage: 'مبلغ  پرداخت',
  },
  paymentStatus: {
    id: `app.domains.orders.management.paymentStatus`,
    defaultMessage: 'وضعیت  پرداخت',
  },
  paymentPortal: {
    id: `app.domains.orders.management.paymentPortal`,
    defaultMessage: 'درگاه پرداخت',
  },
  paymentAt: {
    id: `app.domains.orders.management.paymentAt`,
    defaultMessage: 'پرداخت به',
  },
  paymentReason: {
    id: `app.domains.orders.management.paymentReason`,
    defaultMessage: 'شرح پرداخت',
  },
  orderCode: {
    id: `app.domains.orders.management.orderCode`,
    defaultMessage: 'کد سفارش',
  },
  orderRegistrationMethod: {
    id: `app.domains.orders.management.orderRegistrationMethod`,
    defaultMessage: 'روش ثبت سفارش',
  },
  orderNameRegister: {
    id: `app.domains.orders.management.orderNameRegister`,
    defaultMessage: 'نام ثبت کننده سفارش',
  },
  nameRealBuyer: {
    id: `app.domains.orders.management.nameRealBuyer`,
    defaultMessage: 'نام خریدار حقیقی',
  },
  phoneNumberBuyer: {
    id: `app.domains.orders.management.phoneNumberBuyer`,
    defaultMessage: 'شماره موبایل خریدار',
  },
  customersName: {
    id: `app.domains.orders.management.customersName`,
    defaultMessage: 'نام مشتری:',
  },
  totalAmountOfOrder: {
    id: `app.domains.orders.management.totalAmountOfOrder`,
    defaultMessage: 'مبلغ کل سفارش:',
  },
  purchaseDate: {
    id: `app.domains.orders.management.purchaseDate`,
    defaultMessage: 'تاریخ خرید',
  },
  nameLegalBuyer: {
    id: `app.domains.orders.management.nameLegalBuyer`,
    defaultMessage: 'نام خریدار حقوقی',
  },
  economicNumberBuyer: {
    id: `app.domains.orders.management.economicNumberBuyer`,
    defaultMessage: 'شماره اقتصادی خریدار',
  },
  orderAmount: {
    id: `app.domains.orders.management.orderAmount`,
    defaultMessage: 'مبلغ سفارش',
  },
  packagingCost: {
    id: `app.domains.orders.management.packagingCost`,
    defaultMessage: 'هزینه بسته بندی',
  },
  totalShippingCost: {
    id: `app.domains.orders.management.totalShippingCost`,
    defaultMessage: 'جمع کل هزینه ارسال',
  },
  totalDiscount: {
    id: `app.domains.orders.management.totalDiscount`,
    defaultMessage: 'جمع کل تخفیف',
  },
  finalPrice: {
    id: `app.domains.orders.management.finalPrice`,
    defaultMessage: 'مبلغ نهایی',
  },
  orders: {
    id: `app.domains.orders.management.orders`,
    defaultMessage: 'سفارشات',
  },
  returnRegistration: {
    id: `app.domains.orders.management.returnRegistration`,
    defaultMessage: 'ثبت مرجوعی',
  },
  transactionHistory: {
    id: `app.domains.orders.management.transactionHistory`,
    defaultMessage: 'سابقه تراکنش ها',
  },
  insertTransactionInfo: {
    id: `app.domains.orders.management.insertTransactionInfo`,
    defaultMessage: 'اطلاعات مربوط به سابقه تراکنش را وارد کنید',
  },
  recordAlert: {
    id: `app.domains.orders.management.insertTransactionInfo`,
    defaultMessage: 'برای رکورد مورد نظر دیتا ثبت نشده است',
  },
  awaitingPayment: {
    id: `app.domains.orders.management.awaitingPayment`,
    defaultMessage: 'در انتظار پرداخت',
  },
  paid: {
    id: `app.domains.orders.management.Paid`,
    defaultMessage: 'پرداخت شده',
  },
  orderDelete: {
    id: `app.domains.orders.management.orderDelete`,
    defaultMessage: 'حذف سفارش',
  },
  orderDeleteConfirm: {
    id: `app.domains.orders.management.orderDeleteConfirm`,
    defaultMessage: 'آیا از حذف این سفارش مطمئن هستید ؟',
  },
  delete: {
    id: `app.domains.orders.management.delete`,
    defaultMessage: 'حذف',
  },
  row: {
    id: `app.domains.orders.management.row`,
    defaultMessage: 'ردیف',
  },
  orderTypeSubmit: {
    id: `app.domains.orders.management.orderTypeSubmit`,
    defaultMessage: 'نوع ثبت سفارش',
  },
  orderTime: {
    id: `app.domains.orders.management.orderTime`,
    defaultMessage: 'زمان سفارش',
  },
  customerName: {
    id: `app.domains.orders.management.customerName`,
    defaultMessage: 'نام خریدار',
  },
  numberOfShipment: {
    id: `app.domains.orders.management.customerName`,
    defaultMessage: 'تعداد مرسولات',
  },
  numberOfSeller: {
    id: `app.domains.orders.management.customerName`,
    defaultMessage: 'تعداد فروشندها',
  },
  numberOfReturnItems: {
    id: `app.domains.orders.management.numberOfReturnItems`,
    defaultMessage: 'تعداد آیتم های مرجوعی',
  },
  orderStatus: {
    id: `app.domains.orders.management.orderStatus`,
    defaultMessage: 'وضعیت سفارش',
  },
  totalPrice: {
    id: `app.domains.orders.management.totalPrice`,
    defaultMessage: 'مبلغ کل (بدون تخفیف)',
  },
  totalPriceDiscount: {
    id: `app.domains.orders.management.totalPriceDiscount`,
    defaultMessage: 'مبلغ کل تخفیف',
  },
  shipMentAmount: {
    id: `app.domains.orders.management.shipMentAmount`,
    defaultMessage: 'هزینه ارسال',
  },
  totalRefundAmount: {
    id: `app.domains.orders.management.totalRefundAmount`,
    defaultMessage: 'مبلغ کل مرجوعی',
  },
  totalAmountCommission: {
    id: `app.domains.orders.management.totalAmountCommission`,
    defaultMessage: 'مبلغ کل کمیسوین',
  },
  totalAmountOfSale: {
    id: `app.domains.orders.management.totalAmountOfSale`,
    defaultMessage: 'مبلغ کل (بدون تخفیف):',
  },
  viewShoppingCart: {
    id: `app.domains.orders.management.viewShoppingCart`,
    defaultMessage: 'مشاهده سبد خرید',
  },
  consignmentNumber: {
    id: `app.domains.orders.management.consignmentNumber`,
    defaultMessage: 'کد رهگیری  مرسوله',
  },
  consignmentCarrier: {
    id: `app.domains.orders.management.consignmentCarrier`,
    defaultMessage: 'حمل کننده مرسوله',
  },
  consignmentCarrierId: {
    id: `app.domains.orders.management.consignmentCarrier`,
    defaultMessage: 'شناسه تحویل مرسوله',
  },
  transferee: {
    id: `app.domains.orders.management.transferee`,
    defaultMessage: 'تحویل گیرنده',
  },
  transfereeMobile: {
    id: `app.domains.orders.management.transfereeMobile`,
    defaultMessage: 'شماره موبایل تحویل گیرنده',
  },
  receiveAddress: {
    id: `app.domains.orders.management.receiveAddress`,
    defaultMessage: 'آدرس گیرنده',
  },
  general: {
    id: `app.domains.orders.management.general`,
    defaultMessage: 'عمومی',
  },
  amountStatus: {
    id: `app.domains.orders.management.amountStatus`,
    defaultMessage: 'وضعیت پرداخت',
  },
  deliveryDateOrder: {
    id: `app.domains.orders.management.deliveryDateOrder`,
    defaultMessage: 'تاریخ تحویل',
  },
  shipmentType: {
    id: `app.domains.orders.management.shipmentType`,
    defaultMessage: 'نوع ارسال',
  },
  shipmentStatus: {
    id: `app.domains.orders.management.shipmentStatus`,
    defaultMessage: 'وضعیت مرسوله',
  },
  shippingCompany: {
    id: `app.domains.orders.management.shippingCompany`,
    defaultMessage: 'شرکت حمل',
  },
  ShippingService: {
    id: `app.domains.orders.management.ShippingService`,
    defaultMessage: 'سرویس دهنده حمل',
  },
  estimatedDeliveryTime: {
    id: `app.domains.orders.management.estimatedDeliveryTime`,
    defaultMessage: 'پیش بینی زمان تحویل',
  },
  estimatedRealDeliveryTime: {
    id: `app.domains.orders.management.estimatedRealDeliveryTime`,
    defaultMessage: 'زمان تحویل واقعی',
  },
  collectionTime: {
    id: `app.domains.orders.management.collectionTime`,
    defaultMessage: 'زمان جمع آوری',
  },
  serverSendingStatus: {
    id: `app.domains.orders.management.serverSendingStatus`,
    defaultMessage: 'وضعیت ارسال (سرویس دهنده)',
  },
  paymentType: {
    id: `app.domains.orders.management.paymentType`,
    defaultMessage: 'نوع پرداخت',
  },
  totalRefundCommission: {
    id: `app.domains.orders.management.totalRefundCommission`,
    defaultMessage: 'مبلغ کل کمیسیون',
  },
  address: {
    id: `app.domains.orders.management.address`,
    defaultMessage: 'آدرس : ',
  },
  products: {
    id: `app.domains.orders.management.products`,
    defaultMessage: 'کالاها:',
  },
  product: {
    id: `app.domains.orders.management.product`,
    defaultMessage: 'کالا',
  },

  mobileNumber: {
    id: `app.domains.orders.management.mobileNumber`,
    defaultMessage: 'شماره موبایل',
  },
  agentName: {
    id: `app.domains.orders.management.agentName`,
    defaultMessage: 'نام حمل کننده',
  },
  serviceName: {
    id: `app.domains.orders.management.serviceName`,
    defaultMessage: 'نام سرویس دهنده',
  },
  publishStatus: {
    id: `app.domains.orders.management.publishStatus`,
    defaultMessage: 'وضعیت انتشار',
  },

  dateFilterTypeCode: {
    id: `app.domains.orders.management.dateFilterTypeCode`,
    defaultMessage: 'نوع فیلتر تاریخ',
  },
  startDate: {
    id: `app.domains.orders.management.startDate`,
    defaultMessage: 'از تاریخ',
  },
  endDate: {
    id: `app.domains.orders.management.endDate`,
    defaultMessage: 'تا تاریخ',
  },
  PostageDate: {
    id: `app.domains.orders.management.PostageDate `,
    defaultMessage: 'تاریخ ارسال',
  },
  OrderDate: {
    id: `app.domains.orders.management.OrderDate `,
    defaultMessage: 'تاریخ سفارش',
  },
  mobile: {
    id: `app.domains.orders.management.mobile`,
    defaultMessage: 'شماره تماس',
  },
  code: {
    id: `app.domains.orders.management.code`,
    defaultMessage: 'کد',
  },
  carrier: {
    id: `app.domains.orders.management.carrier`,
    defaultMessage: 'حمل کننده',
  },
  customer: {
    id: `app.domains.orders.management.customer`,
    defaultMessage: 'مشتری ',
  },
  registerFilter: {
    id: `app.domains.orders.management.registerFilter`,
    defaultMessage: 'اعمال فیلتر ',
  },
  filter: {
    id: `app.domains.orders.management.filter`,
    defaultMessage: 'فیلتر مدیریت سفارشات',
  },
  removeFilter: {
    id: `app.domains.orders.management.removeFilter`,
    defaultMessage: 'حذف فیلتر ',
  },
  store: {
    id: `app.domains.orders.management.store`,
    defaultMessage: 'فروشگاه:',
  },
  commissionCalculation: {
    id: `app.domains.orders.management.registerFilter`,
    defaultMessage: 'محاسبات کمیسیون ',
  },
  purchaseOrderCode: {
    id: `app.domains.orders.management.purchaseOrderCode`,
    defaultMessage: 'کد سفارش خرید:',
  },
  orderTotalRefurbishedPrice: {
    id: `app.domains.orders.management.orderTotalRefurbishedPrice`,
    defaultMessage: 'مبلغ کل مرجوعی:',
  },
  actualCommissionPrice: {
    id: `app.domains.orders.management.actualCommissionPrice`,
    defaultMessage: ' کمیسیون قطعی:',
  },
  inProggressCommissionPrice: {
    id: `app.domains.orders.management.inProggressCommissionPrice`,
    defaultMessage: ' کمیسیون در جریان :',
  },
  Padro: {
    id: `app.admin.domain..commission-setting.Padro`,
    defaultMessage: 'پادرو',
  },
  Post: {
    id: `app.admin.domain..commission-setting.Post`,
    defaultMessage: 'پستچی',
  },
  Draft: {
    id: `app.admin.domain..commission-setting.Draft`,
    defaultMessage: 'پیش نویس',
  },
  Canceled: {
    id: `app.admin.domain..commission-setting.Canceled`,
    defaultMessage: 'لغو شده',
  },
  WaitingToVendorConfirmation: {
    id: `app.admin.domain..commission-setting.WaitingToVendorConfirmation`,
    defaultMessage: 'منتظر تایید فروشنده',
  },
  Sending: {
    id: `app.admin.domain..commission-setting.Sending`,
    defaultMessage: 'در جریان ارسال',
  },
  UnsuccessDeliver: {
    id: `app.admin.domain..commission-setting.UnsuccessDeliver`,
    defaultMessage: 'عدم تحویل موفق',
  },
  DeliveredToCustomer: {
    id: `app.admin.domain..commission-setting.DeliveredToCustomer`,
    defaultMessage: 'تحویل شده به مشتری',
  },
  Rerurend: {
    id: `app.admin.domain..commission-setting.Rerurend`,
    defaultMessage: 'مرجوع شده',
  },
  SystemCancelled: {
    id: `app.admin.domain..commission-setting.SystemCancelled`,
    defaultMessage: 'لغو سیستمی',
  },
  relatedCommissionCode: {
    id: `app.domains.orders.management.relatedCommissionCode`,
    defaultMessage: 'کد کمیسیون مرتبط:',
  },
  commissionPrice: {
    id: `app.domains.orders.management.commissionPrice`,
    defaultMessage: 'مبلغ کمیسیون:',
  },
  relatedCommissionSetting: {
    id: `app.domains.orders.management.relatedCommissionSetting`,
    defaultMessage: 'تنظیمات کمیسیون مرتبط',
  },
  commissionCode: {
    id: `app.domains.orders.management.commissionCode`,
    defaultMessage: ' کد کمیسیون:',
  },
  validityStartDate: {
    id: `app.domains.orders.management.validityStartDate`,
    defaultMessage: 'تاریخ شروع اعتبار:',
  },
  validityEndtDate: {
    id: `app.domains.orders.management.validityEndtDate`,
    defaultMessage: 'تاریخ پایان اعتبار:',
  },
  typeOfCommissionCalculation: {
    id: `app.domains.orders.management.typeOfCommissionCalculation`,
    defaultMessage: 'نوع محاسبه کمیسیون:',
  },
  calculationMethod: {
    id: `app.domains.orders.management.calculationMethod`,
    defaultMessage: 'روش محاسبه:',
  },
  targetValue: {
    id: `app.domains.orders.management.targetValue`,
    defaultMessage: 'مقدار هدف:',
  },
  maximumCommission: {
    id: `app.domains.orders.management.maximumCommission`,
    defaultMessage: 'حداکثر کمیسیون:',
  },
  minimumCommission: {
    id: `app.domains.orders.management.minimumCommission`,
    defaultMessage: 'حداقل کمیسیون:',
  },
  productCategory: {
    id: `app.domains.orders.management.productCategory`,
    defaultMessage: 'گروه بندی کالا:',
  },
  productBrand: {
    id: `app.domains.orders.management.productCategory`,
    defaultMessage: 'برند کالا:',
  },
  status: {
    id: `app.domains.orders.management.status`,
    defaultMessage: 'وضعیت:',
  },
  quantityNumber: {
    id: `app.domains.orders.management.quantityNumber`,
    defaultMessage: 'عدد',
  },
  shippingHistory: {
    id: `app.domains.orders.management.shippingHistory`,
    defaultMessage: 'تاریخچه ارسالی',
  },
  shippingHistoryStatus: {
    id: `app.domains.orders.management.shippingHistoryStatus`,
    defaultMessage: 'تاریخچه وضعیت ارسالی کالا',
  },
  viewRelatedShipment: {
    id: `app.domains.orders.management.viewRelatedShipment`,
    defaultMessage: 'مشاهده مرسولات مرتبط',
  },
  returnedItems: {
    id: `app.domains.orders.management.returnedItems`,
    defaultMessage: 'آیتم های سفارش',
  },
  storeName: {
    id: `app.domains.orders.management.storeName`,
    defaultMessage: ' نام فروشگاه ',
  },
  commentReview: {
    id: `app.domains.orders.management.commentReview`,
    defaultMessage: 'مشاهده دیدگاه ها',
  },
  commentReviewSubmit: {
    id: `app.domains.orders.management.commentReviewSubmit`,
    defaultMessage: 'مشاهده دیگاه های ثبت شده',
  },
  orderRegistrarName: {
    id: `app.domains.orders.management.orderRegistrarName`,
    defaultMessage: 'ثبت کننده سفارش',
  },
  transactionType: {
    id: `app.domains.orders.management.transactionType`,
    defaultMessage: 'نوع تراکنش',
  },
  total: {
    id: `app.domains.orders.management.total`,
    defaultMessage: 'جمع کل',
  },
  totalOnThePage: {
    id: `app.domains.orders.management.totalOnThePage`,
    defaultMessage: 'جمع در صفحه',
  },
  history: {
    id: `app.domains.orders.management.totalOnThePage`,
    defaultMessage: 'تاریخچه',
  },
  paidPrice: {
    id: `app.domains.orders.management.paidPrice`,
    defaultMessage: 'مبلغ پرداخت شده',
  },
  payablePrice: {
    id: `app.domains.orders.management.payblePrice`,
    defaultMessage: 'مبلغ قابل پرداخت',
  },
  voucherTotalFee: {
    id: `app.domains.orders.management.voucherTotalFee`,
    defaultMessage: 'مبلغ کد تخفیف',
  },
  orderNumber: {
    id: `app.domains.orders.management.orderNumber`,
    defaultMessage: 'شماره سفارش',
  },
  orderId: {
    id: `app.domains.orders.management.orderId`,
    defaultMessage: 'شناسه سفارش',
  },
})

export default OrdersManagementMessage
