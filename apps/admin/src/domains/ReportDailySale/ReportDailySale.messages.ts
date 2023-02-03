import { defineMessages } from 'react-intl'

const ReportDailySaleMessages = defineMessages({
  dailySaleReport: {
    id: `app.domains.dailySaleReport`,
    defaultMessage: 'گزارش فروش روزانه',
  },
  fromDate: {
    id: `app.domains.reportDailySale.fromDate`,
    defaultMessage: 'از تاریخ-ساعت',
  },
  toDate: {
    id: `app.domains.reportDailySale.fromDate`,
    defaultMessage: 'تا تاریخ-ساعت',
  },
  reportType: {
    id: `app.domains.reportDailySale.reportType`,
    defaultMessage: 'نوع گزارش',
  },
  notificationStatus: {
    id: `app.domains.reportDailySale.notificationStatus`,
    defaultMessage: 'وضعیت اطلاع رسانی',
  },
  filterDateType: {
    id: `app.domains.reportDailySale.filterDateType`,
    defaultMessage: 'نوع فیلتر تاریخ',
  },
  orderItemStatus: {
    id: `app.domains.reportDailySale.orderItemStatus`,
    defaultMessage: 'وضعیت ایتم سفارش',
  },
  filtering: {
    id: `app.domains.reportDailySale.filtering`,
    defaultMessage: 'اعمال فیلتر',
  },
  downloadExcel: {
    id: `app.domains.reportDailySale.downloadExcel`,
    defaultMessage: 'دانلود اکسل ',
  },
  updateInfo: {
    id: `app.domains.reportDailySale.updateInfo`,
    defaultMessage: 'به روز رسانی اطلاع رسانی',
  },
  reportAndUpdate: {
    id: `app.domains.reportDailySale.reportAndUpdate`,
    defaultMessage: 'گزارش گیری و به روز رسانی',
  },
  HSIN: {
    id: `app.domains.reportDailySale.hSIN`,
    defaultMessage: 'HSIN',
  },
  vendorPartyName: {
    id: `app.domains.reportDailySale.hSIN`,
    defaultMessage: 'فروشنده',
  },
  vendorAddress: {
    id: `app.domains.reportDailySale.vendorAddress`,
    defaultMessage: 'آدرس فروشنده',
  },
  storeName: {
    id: `app.domains.reportDailySale.storeName`,
    defaultMessage: 'نام فروشگاه',
  },
  orderNumber: {
    id: `app.domains.reportDailySale.orderNumber`,
    defaultMessage: 'کد سفارش',
  },
  orderDate: {
    id: `app.domains.reportDailySale.orderDate`,
    defaultMessage: 'تاریخ سفارش',
  },
  shoppingCartId: {
    id: `app.domains.reportDailySale.shoppingCartId`,
    defaultMessage: 'شناسه سفارش',
  },
  customerName: {
    id: `app.domains.reportDailySale.customerName`,
    defaultMessage: 'خریدار',
  },
  customerAddress: {
    id: `app.domains.reportDailySale.customerAddress`,
    defaultMessage: 'آدرس خریدار',
  },
  customerCellPhone: {
    id: `app.domains.reportDailySale.customerCellPhone`,
    defaultMessage: 'موبایل خریدار',
  },
  productHSIN: {
    id: `app.domains.reportDailySale.productHSIN`,
    defaultMessage: 'کالا',
  },
  productOriginalPrice: {
    id: `app.domains.reportDailySale.productOriginalPrice`,
    defaultMessage: 'مبلغ اصلی',
  },
  productQTY: {
    id: `app.domains.reportDailySale.productQTY`,
    defaultMessage: 'تعداد',
  },
  totalFinalPrice: {
    id: `app.domains.reportDailySale.productFinalPrice`,
    defaultMessage: 'مجموع قیمت نهایی',
  },
  preparationDays: {
    id: `app.domains.reportDailySale.preparationDays`,
    defaultMessage: 'مهلت آماده سازی (روز)',
  },
  productPikUpDate: {
    id: `app.domains.reportDailySale.productPikUpDate`,
    defaultMessage: 'تاریخ جمع آوری',
  },
  duePickDeliveryDate: {
    id: `app.domains.reportDailySale.duePickDeliveryDate`,
    defaultMessage: 'تاریخ تحویل به مشتری',
  },
  shippingProviderName: {
    id: `app.domains.reportDailySale.shippingProviderName`,
    defaultMessage: 'سرویس دهنده',
  },
  shippingCompanyName: {
    id: `app.domains.reportDailySale.shippingCompanyName`,
    defaultMessage: 'شرکت حمل',
  },
  cargoId: {
    id: `app.domains.reportDailySale.cargoId`,
    defaultMessage: 'کد محموله',
  },
  productStatusCode: {
    id: `app.domains.reportDailySale.productStatusCode`,
    defaultMessage: 'وضعیت کالا ',
  },
  VTAPercent: {
    id: `app.domains.reportDailySale.VTAPercent`,
    defaultMessage: 'درصد ارزش افزوده',
  },
  VTAPrice: {
    id: `app.domains.reportDailySale.VTAPrice`,
    defaultMessage: 'مالیات بر ارزش افزوده',
  },
  shipmentPrice: {
    id: `app.domains.reportDailySale.shipmentPrice`,
    defaultMessage: 'هزینه حمل',
  },
  vendorShipmentShare: {
    id: `app.domains.reportDailySale.vendorShipmentShare`,
    defaultMessage: 'سهم فروشنده از هزینه حمل',
  },
  relatedCommissionId: {
    id: `app.domains.reportDailySale.relatedCommissionId`,
    defaultMessage: 'کمیسیون مرتبط',
  },
  commissionAmount: {
    id: `app.domains.reportDailySale.commissionAmount`,
    defaultMessage: 'مقدار/ درصد کمیسیون',
  },
  commissionPrice: {
    id: `app.domains.reportDailySale.commissionPrice`,
    defaultMessage: 'مبلغ کمیسیون',
  },
  totalCommissionPrice: {
    id: `app.domains.reportDailySale.commissionPrice`,
    defaultMessage: 'مجموع ریال کمیسون دریافتی',
  },
  totalPayablePrice: {
    id: `app.domains.reportDailySale.totalPayablePrice`,
    defaultMessage: 'خالص پرداختی',
  },
  total: {
    id: `app.domains.reportDailySale.total`,
    defaultMessage: 'جمع کل ',
  },
  totalOnThePage: {
    id: `app.domains.reportDailySale.totalOnThePage`,
    defaultMessage: 'جمع  در صفحه',
  },
  totalDiscount: {
    id: `app.domains.reportDailySale.totalDiscount`,
    defaultMessage: 'مجموع تخفیف',
  },
  numberOfOrders: {
    id: `app.domains.reportDailySale.numberOfOrders`,
    defaultMessage: 'تعداد سفارش ها',
  },
  relatedCommissionSetting: {
    id: `app.domains.reportDailySale.relatedCommissionSetting`,
    defaultMessage: 'تنظیمات کمیسیون مرتبط',
  },
  commissionCode: {
    id: `app.domains.reportDailySale.commissionCode`,
    defaultMessage: 'کد کمیسیون :',
  },
  starDateCredit: {
    id: `app.domains.reportDailySale.starDateCredit`,
    defaultMessage: 'تاریخ شروع اعتبار :',
  },
  commissionCalculationType: {
    id: `app.domains.reportDailySale.commissionCalculationType`,
    defaultMessage: 'نوع محاسبه کمیسیون :',
  },
  calculationMethod: {
    id: `app.domains.reportDailySale.calculationMethod`,
    defaultMessage: 'روش محاسبه:',
  },
  minimumCommission: {
    id: `app.domains.reportDailySale.minimumCommission`,
    defaultMessage: 'حداقل کمیسیون:',
  },
  endDateCredit: {
    id: `app.domains.reportDailySale.endDateCredit`,
    defaultMessage: 'تاریخ پایان:',
  },
  productGroup: {
    id: `app.domains.reportDailySale.productGroup`,
    defaultMessage: 'گروه بندی کالا:',
  },
  targetValue: {
    id: `app.domains.reportDailySale.targetValue`,
    defaultMessage: 'مقدار هدف:',
  },
  maxCommission: {
    id: `app.domains.reportDailySale.maxCommission`,
    defaultMessage: 'حداکثر کمیسیون:',
  },
  status: {
    id: `app.domains.reportDailySale.status`,
    defaultMessage: ' وضعیت:',
  },
  productName: {
    id: `app.domains.reportDailySale.productName`,
    defaultMessage: 'نام کالا /نام سیستمی کالا',
  },
  numberNewSales: {
    id: `app.domains.reportDailySale.numberNewSales`,
    defaultMessage: 'تعداد فروش جدید',
  },
  numberOfCanceled: {
    id: `app.domains.reportDailySale.numberOfCanceled`,
    defaultMessage: 'تعداد کنسل شده',
  },
  theFinalNumber: {
    id: `app.domains.reportDailySale.theFinalNumber`,
    defaultMessage: 'تعداد نهایی',
  },
  totalOriginalPrice: {
    id: `app.domains.reportDailySale.totalOriginalPrice`,
    defaultMessage: 'مجموع قیمت اصلی',
  },
  discountAmount: {
    id: `app.domains.reportDailySale.discountAmount`,
    defaultMessage: 'مبلغ تخفیف',
  },
  finalPrice: {
    id: `app.domains.reportDailySale.finalPrice`,
    defaultMessage: 'مبلغ نهایی',
  },
  reduceFinalPrice: {
    id: `app.domains.reportDailySale.finalPrice`,
    defaultMessage: 'مبلغ نهایی پس از کسر تخفیفات',
  },
  productDiscount: {
    id: `app.domains.reportDailySale.productDiscount`,
    defaultMessage: 'تخفیفات',
  },
  changeStateStatus: {
    id: `app.domains.reportDailySale.changeStateStatus`,
    defaultMessage: 'تغییر وضعیت اطلاع رسانی به',
  },
  Notified: {
    id: `app.domains.reportDailySale.Notified`,
    defaultMessage: 'اطلاع رسانی شده',
  },
  notNotified: {
    id: `app.domains.reportDailySale.notNotified`,
    defaultMessage: 'اطلاع رسانی نشده',
  },
  removeFilter: {
    id: `app.domains.reportDailySale.removeFiltering`,
    defaultMessage: 'حذف فیلتر',
  },
  informate: {
    id: `app.domains.reportDailySale.informate`,
    defaultMessage: 'با موفقیت اطلاع رسانی شد',
  },
  totalVendorShare: {
    id: `app.domains.reportDailySale.totalVendorShare`,
    defaultMessage: 'کل سهم فرونشده از هزینه ارسال',
  },
  all: {
    id: `app.domains.reportDailySale.all`,
    defaultMessage: 'همه',
  },
  selectable: {
    id: `app.domains.reportDailySale.selectable`,
    defaultMessage: 'انتخاب',
  },
  downloadAllAndUpdate: {
    id: `app.domains.reportDailySale.downloadAllAndUpdate`,
    defaultMessage: 'به روز رسانی و دانلود همه',
  },
  downloadSelectAndUpdate: {
    id: `app.domains.reportDailySale.downloadSelectAndUpdate`,
    defaultMessage: 'به روز رسانی و دانلود انتخابی',
  },
  reporting: {
    id: `app.domains.reportDailySale.downloadAUpdate`,
    defaultMessage: 'گزارش گیری',
  },
  newOrderQty: {
    id: `app.domains.reportDailySale.newOrderQty`,
    defaultMessage: 'تعداد فروش جدید',
  },
  cancelledOrderQty: {
    id: `app.domains.reportDailySale.cancelledOrderQty`,
    defaultMessage: 'تعدادلغو',
  },
  finalOrderQty: {
    id: `app.domains.reportDailySale.finalOrderQty`,
    defaultMessage: 'تعداد نهایی',
  },
  conditionList: {
    id: `app.domains.reportDailySale.conditionList`,
    defaultMessage: 'لیست خروجی بر اساس',
  },
  changeStatus: {
    id: `app.domains.reportDailySale.chagneStatus`,
    defaultMessage: 'تغییر وضعیت',
  },
  allRows: {
    id: `app.domains.reportDailySale.allRows`,
    defaultMessage: 'تمامی ردیف ها',
  },
  selectRows: {
    id: `app.domains.reportDailySale.selectRows`,
    defaultMessage: 'ردیف های منتخب',
  },
  recipientName: {
    id: `app.domains.reportDailySale.recipientName`,
    defaultMessage: 'نام تحویل گیرنده',
  },
  recipientNameAddress: {
    id: `app.domains.reportDailySale.recipientNameAddress`,
    defaultMessage: 'شماره تلفن تحویل گیرنده',
  },
})

export default ReportDailySaleMessages
