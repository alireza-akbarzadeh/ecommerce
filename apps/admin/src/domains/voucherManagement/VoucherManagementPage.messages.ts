import { defineMessages } from 'react-intl'

type VoucherManagementPageType = {
  [key: string]: {
    id: string
    defaultMessage: string
  }
}

const VoucherManagementPage: VoucherManagementPageType = defineMessages({
  edit: {
    id: `app.admin.domains.vouchers.list.edit`,
    defaultMessage: 'ویرایش',
  },
  VoucherTitle: {
    id: `app.admin.domains.vouchers.VoucherTitle`,
    defaultMessage: 'مدیریت کد های تخفیف',
  },
  discountAmount: {
    id: `app.admin.domains.vouchers.discountAmount`,
    defaultMessage: 'مبلغ تخفیف',
  },
  discountAmountType: {
    id: `app.admin.domains.vouchers.discountAmountType`,
    defaultMessage: 'نوع مقدار  تخفیف',
  },
  discountCount: {
    id: `app.admin.domains.vouchers.discountCount`,
    defaultMessage: ' مقدار  تخفیف',
  },
  seller: {
    id: `app.admin.domains.vouchers.seller`,
    defaultMessage: 'فروشنده',
  },
  creditExpirationTime: {
    id: `app.admin.domains.vouchers.creditExpirationTime`,
    defaultMessage: 'زمان پایان اعتبار',
  },
  creditStartTime: {
    id: `app.admin.domains.vouchers.creditStartTime`,
    defaultMessage: 'زمان شروع اعتبار',
  },
  usageTypeValidate: {
    id: `app.admin.domains.vouchers.usageTypeValidate`,
    defaultMessage: 'زمان شروع اعتبار',
  },
  returnFeature: {
    id: `app.admin.domains.vouchers.returnFeature`,
    defaultMessage: 'قابلیت مرجوعی دارد',
  },
  provider: {
    id: `app.admin.domains.vouchers.provider`,
    defaultMessage: 'ارائه دهنده',
  },
  titleDiscount: {
    id: `app.admin.domains.vouchers.titleDiscount`,
    defaultMessage: 'عنوان تخفیف',
  },
  discountCode: {
    id: `app.admin.domains.vouchers.discountCode`,
    defaultMessage: 'کد تخفیف',
  },
  addVoucher: {
    id: `app.admin.domains.vouchers.addVoucher`,
    defaultMessage: 'افزودن کد های تخفیف',
  },
  editVoucher: {
    id: `app.admin.domains.vouchers.addVoucher`,
    defaultMessage: 'ویرایش کد های تخفیف',
  },
  sellerCodeDiscount: {
    id: `app.admin.domains.vouchers.sellerCodeDiscount`,
    defaultMessage: 'تخصیص کد تخفیف به فروشندگان',
  },
  productCodeDiscount: {
    id: `app.admin.domains.vouchers.productCodeDiscount`,
    defaultMessage: 'تخصیص کد تخفیف  به کالاها',
  },
  productGroupCode: {
    id: `app.admin.domains.vouchers.productGroupCode`,
    defaultMessage: 'تخصیص کد تخفیف گروه  به کالاها',
  },
  VoucherCodeDiscountInfo: {
    id: `app.admin.domains.vouchers.VoucherCodeDiscountInfo`,
    defaultMessage: 'اطلاعات تنظیمات کد های تخفیف',
  },
  startDate: {
    id: `app.admin.domains.vouchers.startDate`,
    defaultMessage: 'زمان شروع',
  },
  endDate: {
    id: `app.admin.domains.vouchers.endDate`,
    defaultMessage: 'زمان پایان',
  },
  enterInfoRelatedToVoucher: {
    id: `app.admin.domains.vouchers.enterInfoRelatedToVoucher`,
    defaultMessage: 'اطلاعات مربوط به کد تخفیف را وارد کنید',
  },
  yes: {
    id: `app.admin.domains.vouchers.yes`,
    defaultMessage: 'بله',
  },
  no: {
    id: `app.admin.domains.vouchers.no`,
    defaultMessage: 'خیر',
  },
  viewDetails: {
    id: `app.admin.domains.vouchers.viewDetails`,
    defaultMessage: 'مشاهده جزئیات',
  },
  statusPublish: {
    id: `app.admin.domains.vouchers.statusPublish`,
    defaultMessage: 'وضعیت انتشار',
  },
  sellerAddress: {
    id: `app.admin.domains.vouchers.sellerAddress`,
    defaultMessage: 'آدرس فروشنده',
  },
  phoneNumber: {
    id: `app.admin.domains.vouchers.phoneNumber`,
    defaultMessage: 'شماره موبایل',
  },
  sellerName: {
    id: `app.admin.domains.vouchers.sellerName`,
    defaultMessage: 'نام فروشنده',
  },
  sellerCode: {
    id: `app.admin.domains.vouchers.sellerCode`,
    defaultMessage: 'کد فروشنده',
  },
  groupingProduct: {
    id: `app.admin.domains.vouchers.groupingProduct`,
    defaultMessage: 'کد فروشنده',
  },
  productCode: {
    id: `app.admin.domains.vouchers.productCode`,
    defaultMessage: 'کد کالا',
  },
  productDsc: {
    id: `app.admin.domains.vouchers.productDsc`,
    defaultMessage: 'شرح کالا',
  },
  productGroupAddress: {
    id: `app.admin.domains.vouchers.productGroup`,
    defaultMessage: 'آدرس گروه کالاها',
  },
  productGroup: {
    id: `app.admin.domains.vouchers.productGroup`,
    defaultMessage: 'گروه کالا',
  },
  productOfGroup: {
    id: `app.admin.domains.vouchers.productOfGroup`,
    defaultMessage: 'گروهبندی کالاها',
  },
  manualCreation: {
    id: `app.admin.domains.vouchers.manualCreation`,
    defaultMessage: 'ایجاد دستی',
  },
  returnability: {
    id: `app.admin.domains.vouchers.returnability`,
    defaultMessage: 'قابلیت مرجوعی',
  },
  minDiscountAmount: {
    id: `app.admin.domains.vouchers.minDiscountAmount`,
    defaultMessage: 'حداقل مقدار تخفیف',
  },
  maxPurchaseAmount: {
    id: `app.admin.domains.vouchers.maxPurchaseAmount`,
    defaultMessage: 'حداکثر  مقدار تخفیف',
  },
  minPurchaseAmount: {
    id: `app.admin.domains.vouchers.minPurchaseAmount`,
    defaultMessage: 'حداقل مبلغ خرید',
  },
  typeOfUse: {
    id: `app.admin.domains.vouchers.typeOfUse`,
    defaultMessage: 'نوع مصرف',
  },
  usageLimit: {
    id: `app.admin.domains.vouchers.usageLimit`,
    defaultMessage: 'محدودیت دفعات استفاده',
  },
  LimitTheNumberOfUsers: {
    id: `app.admin.domains.vouchers.LimitTheNumberOfUsers`,
    defaultMessage: 'محدودیت  تعداد استفاده کنندگان',
  },
  maximumCumulativeDiscountAmount: {
    id: `app.admin.domains.vouchers.maximumCumulativeDiscountAmount`,
    defaultMessage: 'حداکثر مبلغ تجمعی تخفیف',
  },
  currentStage: {
    id: `app.admin.domains.vouchers.currentStage`,
    defaultMessage: 'مرحله جاری',
  },
  changeStage: {
    id: `app.admin.domains.vouchers.changeStage`,
    defaultMessage: 'تغییر مرحله',
  },
  draft: {
    id: `app.admin.domains.vouchers.draft`,
    defaultMessage: 'پیش نویس',
  },
  platform: {
    id: `app.admin.domains.vouchers.platform`,
    defaultMessage: 'پلتفرم',
  },
  stablePrice: {
    id: `app.admin.domains.vouchers.stablePrice`,
    defaultMessage: 'مبلغ ثابت',
  },
  percentage: {
    id: `app.admin.domains.vouchers.percentage`,
    defaultMessage: 'درصد',
  },
  disposable: {
    id: `app.admin.domains.vouchers.Disposable`,
    defaultMessage: 'یکبار مصرف',
  },
  multiUse: {
    id: `app.admin.domains.vouchers.multiUse`,
    defaultMessage: 'چند بار مصرف',
  },
  validate: {
    id: `app.admin.domains.vouchers.validate`,
    defaultMessage: 'مقدار فیلد  {msg} الزامی می باشد',
  },
  validateVoucherValuePercentage: {
    id: `app.admin.domains.vouchers.validateVoucherValuePercentage`,
    defaultMessage: 'مقدار تخفیف باید برزگتر از صفر و یا کوچکتر مساوی صد باشد',
  },
  validateUsageLimit: {
    id: `app.admin.domains.vouchers.validateUsageLimit`,
    defaultMessage: 'مقدار محدودیت دفعات استفاده باید برزگتر یک باشد',
  },
  status: {
    id: `app.admin.domains.vouchers.status`,
    defaultMessage: 'وضعیت',
  },
  content: {
    id: `app.admin.domains.vouchers.content`,
    defaultMessage: 'محتوا',
  },
  deleteDialogTitle: {
    id: `app.admin.domains.vouchers.deleteDialogTitle`,
    defaultMessage: 'آیا از حذف {msg} مطمئن هستید ',
  },
  successStage: {
    id: `app.admin.domains.vouchers.successStage`,
    defaultMessage: 'مرحله شما با موفقیت تغییر کرد ',
  },
  approveMessageBack: {
    id: `app.admin.domains.vouchers.approveMessageBack`,
    defaultMessage: 'آیا  خواهید اطلاعات تغییر یافته را ذخیره کنید ',
  },
  back: {
    id: `app.admin.domains.vouchers.back`,
    defaultMessage: 'بازگشت',
  },
  orders: {
    id: `app.domains.orders.management.orders`,
    defaultMessage: 'سفارشات',
  },
  reportUsageCode: {
    id: `app.domains.orders.management.reportUsageCode`,
    defaultMessage: 'گزارش مصرف کد',
  },
  providerVoucherCode: {
    id: `app.domains.orders.management.providerVoucherCode`,
    defaultMessage: ' ارائه دهنده کد تخفبف : ',
  },
  userCountUser: {
    id: `app.domains.orders.management.providerVoucherCode`,
    defaultMessage: 'تعداد کاربران استفاده کننده  : ',
  },
  registeredShoppingCartsCount: {
    id: `app.domains.orders.management.registeredShoppingCartsCount`,
    defaultMessage: '  تعداد سفارش های ثبت شده :',
  },
  totalUsedVoucherPrice: {
    id: `app.domains.orders.management.totalUsedVoucherPrice`,
    defaultMessage: ' مجموع مبالغ تخفیف  :',
  },
  vocuherCode: {
    id: `app.domains.orders.management.vocuherCode`,
    defaultMessage: ' کد تخفیف :',
  },
  totalUseableVoucherPrice: {
    id: `app.domains.orders.management.totalUseableVoucherPrice `,
    defaultMessage: '  تعداد دفعات استفاده از کد :',
  },
  daysLeftUntilCreditedLeft: {
    id: `app.domains.orders.management.daysLeftUntilCreditleft`,
    defaultMessage: '   تعداد روز مانده تا پایان اعتبار :',
  },
  totalOrderPrice: {
    id: `app.domains.orders.management.totalOrderPrice`,
    defaultMessage: ' مجموع مبالغ سفارش ها : ',
  },
  customerName: {
    id: `app.domains.orders.management.custoemerName`,
    defaultMessage: 'نام مشتری',
  },
  purchaseOrder: {
    id: `app.domains.orders.management.purchaseOrder`,
    defaultMessage: 'سفارش خرید',
  },
  totalAmountPurchaseOrder: {
    id: `app.domains.orders.management.totalAmountPurchaseOrder`,
    defaultMessage: 'مبلغ کل سفارش خرید',
  },
  orderNumber: {
    id: `app.domains.orders.management.orderNumber`,
    defaultMessage: 'شماره سفارش',
  },
  datePurchaseOrder: {
    id: `app.domains.orders.management.datePurchaseOrder`,
    defaultMessage: 'تاریخ سفارش خرید',
  },
  amountUsedDiscountCode: {
    id: `app.domains.orders.management.AmountUsedDiscountCode`,
    defaultMessage: 'مبلغ استفاده شده کد تخفیف',
  },
  remainingAmountDiscountCode: {
    id: `app.domains.orders.management.remainingAmountDiscountCode`,
    defaultMessage: 'مبلغ مانده از کد تخفیف',
  },
  amountUsablePrice: {
    id: `app.domains.orders.management.remainingAmountDiscountCode`,
    defaultMessage: 'مبلغ قابل استفاده',
  },
  totalUsedVoucherPric: {
    id: `app.domains.orders.management.totalUsedVoucherPric`,
    defaultMessage: 'مبلغ استفاده شده',
  },
  noData: {
    id: `app.domains.orders.management.noData`,
    defaultMessage: 'برای رکورد مورد گزارشی ثبت نشده است',
  },
  person: {
    id: `app.domains.orders.management.person`,
    defaultMessage: ' نفر  ',
  },
  order: {
    id: `app.domains.orders.management.order`,
    defaultMessage: 'سفارش',
  },
  day: {
    id: `app.domains.orders.management.day`,
    defaultMessage: 'روز',
  },
  bar: {
    id: `app.domains.orders.management.bar`,
    defaultMessage: 'بار',
  },
  customerFirstName: {
    id: `app.domains.orders.management.customerFirstName`,
    defaultMessage: 'نام',
  },
  customerLastName: {
    id: `app.domains.orders.management.customerLastName`,
    defaultMessage: 'نام خانوادگی',
  },
  deActive: {
    id: `app.domains.orders.management.deActive`,
    defaultMessage: 'ابطال شده',
  },
  sellerFirstName: {
    id: `app.domains.orders.management.sellerFirstName`,
    defaultMessage: 'نام فروشنده',
  },
  sellerLastname: {
    id: `app.domains.orders.management.sellerLastname`,
    defaultMessage: 'نام خانوادگی فروشنده',
  },
  discountUserSegmentation: {
    id: `app.domains.orders.management.discountUserSegmentation`,
    defaultMessage: 'تخصیص دسته بندی کاربران',
  },
  userTypeCategories: {
    id: 'app.page.domains.userTypeCategories',
    defaultMessage: 'نوع دسته بندی',
  },
  userTypeCode: {
    id: 'app.page.domains.userTypeCode',
    defaultMessage: 'نوع دسته بندی',
  },
  categoriesDesc: {
    id: 'app.page.domains.categoriesDesc',
    defaultMessage: 'شرح دسته بندی',
  },
  lastModifiedDate: {
    id: 'app.page.domains.lastModifiedDate',
    defaultMessage: 'تاریخ آخرین به روز رسانی',
  },
  usageType: {
    id: 'app.page.domains.vouchers.usageType',
    defaultMessage: 'نوع کد تخفیف',
  },
  targetUsers: {
    id: 'app.page.domains.vouchers.targetUsers',
    defaultMessage: 'کاربران هدف',
  },
})
export default VoucherManagementPage
