import { defineMessages } from 'react-intl'

const scope = 'app.commerce.profile.order-tracking'
const OrderTrackingMessages = defineMessages({
  currentOrder: {
    id: `${scope}.currentOrder`,
    defaultMessage: 'سفارشات جاری',
  },
  deliveredOrder: {
    id: `${scope}.deliveredOrder`,
    defaultMessage: 'سفارشات تحویل‌شده',
  },
  returnedOrder: {
    id: `${scope}.returnedOrder`,
    defaultMessage: 'سفارشات مرجوع شده',
  },
  canceledOrder: {
    id: `${scope}.canceledOrder`,
    defaultMessage: 'سفارشات لغو شده',
  },
  idOrProductName: {
    id: `${scope}.idOrProductName`,
    defaultMessage: 'شماره پیگیری/نام کالا',
  },
  'await-payment': {
    id: `${scope}.awaitPayment`,
    defaultMessage: 'در انتظار پرداخت',
  },
  'system-cancel': {
    id: `${scope}.systemCancel`,
    defaultMessage: 'لغو سیستمی',
  },
  canceled: {
    id: `${scope}.canceled`,
    defaultMessage: 'لغو ‌شده',
  },
  Delivered: {
    id: `${scope}.Delivered`,
    defaultMessage: 'تحویل‌شده',
  },
  paid: {
    id: `${scope}.paid`,
    defaultMessage: 'پرداخت‌شده',
  },
  returned: {
    id: `${scope}.returned`,
    defaultMessage: 'مرجوع‌شده',
  },
  orderDateTime: {
    id: `${scope}.orderDateTime`,
    defaultMessage: 'تاریخ ثبت سفارش:',
  },
  adressTitle: {
    id: `${scope}.adressTitle`,
    defaultMessage: 'عنوان آدرس:',
  },
  orderCode: {
    id: `${scope}.orderCode`,
    defaultMessage: 'کد سفارش:',
  },
  ConsignmentCount: {
    id: `${scope}.ConsignmentCount`,
    defaultMessage: 'تعداد مرسوله:',
  },
  paymentType: {
    id: `${scope}.paymentType`,
    defaultMessage: 'روش پرداخت:',
  },
  ConsignmentCountText: {
    id: `${scope}.ConsignmentCountText`,
    defaultMessage: '{count} مرسوله',
  },
  vendor: {
    id: `${scope}.vendor`,
    defaultMessage: 'فروشگاه',
  },
  consignmentWithIndexAndAllCount: {
    id: `${scope}.consignmentWithIndexAndAllCount`,
    defaultMessage: '(مرسوله {index} از {count})',
  },
  orderAmount: {
    id: `${scope}.orderAmount`,
    defaultMessage: 'مبلغ سفارش:',
  },
  discount: {
    id: `${scope}.discount`,
    defaultMessage: 'تخفیف:',
  },
  deliveredDate: {
    id: `${scope}.deliveredDate`,
    defaultMessage: 'تاریخ تحویل:',
  },
  canceledAmount: {
    id: `${scope}.canceledAmount`,
    defaultMessage: 'مبلغ کالاهای لغو شده در سفارش:',
  },
  canceleDate: {
    id: `${scope}.canceleDate`,
    defaultMessage: 'تاریخ لغو:',
  },
  orderDetail: {
    id: `${scope}.orderDetail`,
    defaultMessage: 'جزئیات سفارش',
  },
  back: {
    id: `${scope}.back`,
    defaultMessage: 'بازگشت به مرحله قبل',
  },
  paymentAwaitingWithTime: {
    id: `${scope}.paymentAwaitingWithTime`,
    defaultMessage: 'در صورت عدم پرداخت صورت حساب، سفارش شما تا {time} دقیقه دیگر لغو می‌شود.',
  },
  fullAmount: {
    id: `${scope}.fullAmount`,
    defaultMessage: 'مبلغ کل:',
  },
  deliveryAddress: {
    id: `${scope}.deliveryAddress`,
    defaultMessage: 'آدرس تحویل سفارش',
  },
  orderHistory: {
    id: `${scope}.orderHistory`,
    defaultMessage: 'تاریخچه تراکنش',
  },
  orderSuccess: {
    id: `${scope}.orderSuccess`,
    defaultMessage: 'پرداخت موفق',
  },
  orderUnSuccess: {
    id: `${scope}.orderUnSuccess`,
    defaultMessage: 'پرداخت ناموفق',
  },
  followUpCode: {
    id: `${scope}.followUpCode`,
    defaultMessage: 'شماره پیگیری',
  },
  cancelOrder: {
    id: `${scope}.cancelOrder`,
    defaultMessage: 'لغو سفارش',
  },
  orderPayment: {
    id: `${scope}.orderPayment`,
    defaultMessage: 'پرداخت سفارش',
  },
  cancelConsignment: {
    id: `${scope}.cancelConsignment`,
    defaultMessage: 'لغو مرسوله',
  },
  cancelConsignmentAlert: {
    id: `${scope}.cancelConsignmentAlert`,
    defaultMessage:
      'تنها کالاهایی امکان لغو دارند که توسط حمل کننده دریافت نشده باشند و از سوی فروشگاه امکان لغو کالا وجود داشته باشد.',
  },
  cancelAllConsignments: {
    id: `${scope}.cancelAllConsignments`,
    defaultMessage: 'لغو تمامی کالاهای قابل لغو در سفارش',
  },
  cancelReason: {
    id: `${scope}.cancelReason`,
    defaultMessage: 'علت لغو',
  },
  cancelSomeConsignments: {
    id: `${scope}.cancelSomeConsignments`,
    defaultMessage: 'لغو برخی کالاهای موجود در سفارش',
  },
  priceWithCurrency: {
    id: `${scope}.priceWithCurrency`,
    defaultMessage: '{price} {currency}',
  },
  cancel: {
    id: `${scope}.cencel`,
    defaultMessage: 'انصراف',
  },
  checkCancelOrder: {
    id: `${scope}.checkCancelOrder`,
    defaultMessage: 'بررسی درخواست لغو',
  },
  orderCancelSuccess: {
    id: `${scope}.orderCancelSuccess`,
    defaultMessage: 'سفارش شما با موفقیت لغو شد',
  },
  cancelDate: {
    id: `${scope}.cancelDate`,
    defaultMessage: 'تاریخ  لغو:',
  },
  refundedDate: {
    id: `${scope}.refundedDate`,
    defaultMessage: 'تاریخ  مرجوعی:',
  },
  canceledOrderPrice: {
    id: `${scope}.canceledOrderPrice`,
    defaultMessage: 'مبلغ کالاهای لغو شده در سفارش:',
  },
  returnToOrder: {
    id: `${scope}.returnToOrder`,
    defaultMessage: 'بازگشت به بخش سفارش',
  },
  canceledProducts: {
    id: `${scope}.canceledProducts`,
    defaultMessage: 'کالاهای لغو شده',
  },
  consignmentNumber: {
    id: `${scope}.consignmentNumber`,
    defaultMessage: 'مرسوله {number}',
  },
  allConsignmentAmount: {
    id: `${scope}.allConsignmentAmount`,
    defaultMessage: 'مبلغ کل سفارش:',
  },
  howToDelivery: {
    id: `${scope}.howToDelivery`,
    defaultMessage: 'نحوه ارسال:',
  },
  payAwaitOrder: {
    id: `${scope}.payAwaitOrder`,
    defaultMessage: 'در صورت عدم پرداخت صورت حساب، سفارش شما تا {time} دقیقه دیگر لغو می‌شود.',
  },
  pay: {
    id: `${scope}.pay`,
    defaultMessage: 'پرداخت',
  },
  returnOrder: {
    id: `${scope}.returnOrder`,
    defaultMessage: 'مرجوع کردن سفارش',
  },
  buyAgain: {
    id: `${scope}.buyAgain`,
    defaultMessage: 'خرید مجدد سفارش',
  },
  buyOrder: {
    id: `${scope}.buyOrder`,
    defaultMessage: 'خرید سفارش',
  },
  paidAmount: {
    id: `${scope}.paidAmount`,
    defaultMessage: 'مبلغ پرداختی',
  },
  addComment: {
    id: `${scope}.addComment`,
    defaultMessage: 'ثبت نظر',
  },
  addCommentForProduct: {
    id: `${scope}.addCommentForProduct`,
    defaultMessage: 'ثبت نظر برای کالا',
  },
  draftCommentMessage: {
    id: `${scope}.commentReactionMessage`,
    defaultMessage: 'نظر شما در حال بررسی می باشد.',
  },
  shippingCost: {
    id: `${scope}.shippingCost`,
    defaultMessage: 'هزینه ارسال:',
  },
  free: {
    id: `${scope}.free`,
    defaultMessage: 'رایگان',
  },
  selectProductForComment: {
    id: `${scope}.selectProductForComment`,
    defaultMessage: 'محصول مورد نظر برای ثبت نظر  انتخاب کنید.',
  },
  seeOrderFactor: {
    id: `${scope}.seeOrderFactor`,
    defaultMessage: 'مشاهده فاکتور  سفارش',
  },
  internetPay: {
    id: `${scope}.internetPay`,
    defaultMessage: 'پرداخت اینترنتی',
  },
  refundOrder: {
    id: `${scope}.refundOrder`,
    defaultMessage: 'مرجوع کردن سفارش',
  },
  refundAll: {
    id: `${scope}.refundAll`,
    defaultMessage: 'مرجوع تمامی کالاهای قابل مرجوع در سفارش',
  },
  refundSomeProducts: {
    id: `${scope}.refundSomeProducts`,
    defaultMessage: 'مرجوع برخی کالاهای  موجود در سفارش',
  },
  orderRefundSuccess: {
    id: `${scope}.orderRefundSuccess`,
    defaultMessage: 'درخواست شما ثبت شد',
  },
  refundOrderPrice: {
    id: `${scope}.canceledOrderPrice`,
    defaultMessage: 'مبلغ کالاهای مرجوع شده در سفارش:',
  },
  refundedProducts: {
    id: `${scope}.refundedProducts`,
    defaultMessage: 'کالاهای مرجوع شده',
  },
  refundCode: {
    id: `${scope}.refundCode`,
    defaultMessage: 'کد پیگیری مرجوعی:',
  },
  refundDate: {
    id: `${scope}.refundDate`,
    defaultMessage: 'تاریخ مرجوعی',
  },
  refundPrice: {
    id: `${scope}.refundPrice`,
    defaultMessage: 'مبلغ مرجوعی',
  },
  refundCondition: {
    id: `${scope}.refundCondition`,
    defaultMessage:
      'تنها کالاهایی امکان مرجوع دارند که از سوی فروشگاه امکان مرجوع کالا وجود داشته باشد.',
  },
  refundReason: {
    id: `${scope}.refundReason`,
    defaultMessage: 'علت مرجوعی',
  },
  refundComplaint: {
    id: `${scope}.refundComplaint`,
    defaultMessage: 'شرح شکایت',
  },
  refundCount: {
    id: `${scope}.refundCount`,
    defaultMessage: 'تعداد کالا های مرجوعی',
  },
  checkRefundOrder: {
    id: `${scope}.checkRefundOrder`,
    defaultMessage: 'بررسی درخواست مرجوعی',
  },
  uploadFile: {
    id: `${scope}.uploadFile`,
    defaultMessage: 'آپلود فایل',
  },
  fileUploadSizeError: {
    id: `${scope}.fileUploadSizeError`,
    defaultMessage: 'حجم بیشتر ازmb ۱۰ است.',
  },
  withSuccess: {
    id: `${scope}.withSuccess`,
    defaultMessage: 'با موفقیت انجام شد.',
  },
  canceledCount: {
    id: `${scope}.canceledCount`,
    defaultMessage: 'تعداد کالا های لغوی',
  },
  productDetail: {
    id: `${scope}.productDetail`,
    defaultMessage: 'جزییات محصول',
  },
  discountCode: {
    id: `${scope}.discountCode`,
    defaultMessage: 'کد تخفیف {price} {currency}',
  },
  fullAddress: {
    id: `${scope}.fullAddress`,
    defaultMessage: '{mainAddress} محله {district} پلاک {plaque} واحد {unit}',
  },
  unAvailable: {
    id: `${scope}.unAvailable`,
    defaultMessage: 'ناموجود',
  },
  nonePayMessage: {
    id: `${scope}.nonePayMessage`,
    defaultMessage: 'وضعیت نامشخص!',
  },
  cancelPayMessage: {
    id: `${scope}.cancelPayMessage`,
    defaultMessage: 'پرداخت لغو شده',
  },
})

export default OrderTrackingMessages
