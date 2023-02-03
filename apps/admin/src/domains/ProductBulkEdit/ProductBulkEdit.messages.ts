import { defineMessages } from 'react-intl'

const scope = 'apps.admin.domains.product.bulk.edit'
const ProductBulkEditMessages = defineMessages({
  bulkEditTitle: {
    id: `${scope}.bulkEditTitle`,
    defaultMessage: 'ویرایش گروهی محصولات',
  },
  bulkEditTitle2: {
    id: `${scope}.bulkEditTitle2`,
    defaultMessage: 'ویرایش گروهی کالاها',
  },
  vendor: {
    id: `${scope}.vendor`,
    defaultMessage: 'فروشنده',
  },
  vendorName: {
    id: `${scope}.vendorName`,
    defaultMessage: 'نام فروشنده',
  },
  mobile: {
    id: `${scope}.mobile`,
    defaultMessage: 'شماره تماس',
  },
  dashboard: {
    id: `${scope}.dashboard`,
    defaultMessage: 'داشبورد',
  },
  category: {
    id: `${scope}.category`,
    defaultMessage: 'گروه کالا',
  },
  state: {
    id: `${scope}.state`,
    defaultMessage: 'مرحله انتشار',
  },
  fromPublishDate: {
    id: `${scope}.fromPublishDate`,
    defaultMessage: 'از تاریخ انتشار',
  },
  toPublishDate: {
    id: `${scope}.toPublishDate`,
    defaultMessage: 'تا تاریخ انتشار',
  },
  fromCost: {
    id: `${scope}.fromCost`,
    defaultMessage: 'از قیمت اصلی',
  },
  toCost: {
    id: `${scope}.toCost`,
    defaultMessage: 'تا قیمت اصلی',
  },
  removeFilters: {
    id: `${scope}.removeFilters`,
    defaultMessage: 'حذف فیلتر',
  },
  addFilter: {
    id: `${scope}.addFilter`,
    defaultMessage: 'اعمال فیلتر',
  },
  productList: {
    id: `${scope}.productList`,
    defaultMessage: 'لیست محصولات',
  },
  productsNumber: {
    id: `${scope}.productsNumber`,
    defaultMessage: 'تعداد محصولات: ',
  },
  editedProductsNumber: {
    id: `${scope}.editedProductsNumber`,
    defaultMessage: 'تعداد محصولات ویرایش شده: ',
  },
  downloadExcel: {
    id: `${scope}.downloadExcel`,
    defaultMessage: 'دریافت  لیست',
  },
  uploadExcel: {
    id: `${scope}.uploadExcel`,
    defaultMessage: 'بارگذاری لیست',
  },
  DNA: {
    id: `${scope}.DNA`,
    defaultMessage: 'DNA',
  },
  originalityTypeCode: {
    id: `${scope}.originalityTypeCode`,
    defaultMessage: 'اصالت کالا ',
  },
  originalPrice: {
    id: `${scope}.originalPrice`,
    defaultMessage: 'قیمت اصلی ({currency})',
  },
  finalPrice: {
    id: `${scope}.finalPrice`,
    defaultMessage: 'قیمت بعد تخفیف ({currency})',
  },
  productSystemTitle: {
    id: `${scope}.productSystemTitle`,
    defaultMessage: 'عنوان سیستمی کالا',
  },
  maximalSellWithoutInventory: {
    id: `${scope}.maximalSellWithoutInventory`,
    defaultMessage: 'حداکثر فروش بدون موجودی',
  },
  onHandQty: {
    id: `${scope}.onHandQty`,
    defaultMessage: 'تعداد مضرب سفارش',
  },
  shippingObligationTypeTitle: {
    id: `${scope}.shippingObligationTypeTitle`,
    defaultMessage: 'مسئول حمل',
  },
  unitOfMeasureId: {
    id: `${scope}.unitOfMeasureId`,
    defaultMessage: 'واحد شمارش کالا',
  },
  SKU: {
    id: `${scope}.SKU`,
    defaultMessage: 'SKU',
  },
  brand: {
    id: `${scope}.brand`,
    defaultMessage: 'برند',
  },
  picture: {
    id: `${scope}.picture`,
    defaultMessage: 'تصویر',
  },
  HSIN: {
    id: `${scope}.HSIN`,
    defaultMessage: 'HSIN',
  },
  parentHSIN: {
    id: `${scope}.parentHSIN`,
    defaultMessage: 'Parent HSIN',
  },
  releaseDate: {
    id: `${scope}.releaseDate`,
    defaultMessage: 'تاریخ انتشار',
  },
  firstReleaseDate: {
    id: `${scope}.firstReleaseDate`,
    defaultMessage: 'تاریخ اولین انتشار',
  },
  mainGroup: {
    id: `${scope}.mainGroup`,
    defaultMessage: 'گروه اصلی',
  },
  productCondition: {
    id: `${scope}.productCondition`,
    defaultMessage: 'شرایط کالا',
  },
  ProductDefinitionMethod: {
    id: `${scope}.ProductDefinitionMethod`,
    defaultMessage: 'روش تعریف کالا',
  },
  seller: {
    id: `${scope}.seller`,
    defaultMessage: 'فروشنده',
  },
  productType: {
    id: `${scope}.productType`,
    defaultMessage: 'نوع کالا',
  },
  productName: {
    id: `${scope}.productName`,
    defaultMessage: 'نام کالا',
  },
  possibilityOfEditingTitle: {
    id: `${scope}.possibilityOfEditingTitle`,
    defaultMessage: 'بیام سیستم',
  },
  deleteProductDialog: {
    id: `${scope}.deleteProductDialog`,
    defaultMessage: 'آیا از حذف {count} کالا اطمینان دارید؟',
  },
  successfullyMessage: {
    id: `${scope}.successfullyMessage`,
    defaultMessage: 'عملیات با موفقیت انجام شد',
  },

  image: {
    id: `app.admin.domains.products.containers.addProduct.image`,
    defaultMessage: 'تصویر',
  },
  phoneNumber: {
    id: `app.admin.domains.products.containers.addProduct.phoneNumber`,
    defaultMessage: 'شماره تماس',
  },
  vendorHISN: {
    id: `app.admin.domains.products.containers.addProduct.vendorHISN`,
    defaultMessage: 'شناسه فروشنده',
  },
  noOptionsText: {
    id: `app.admin.domains.products.containers.addProduct.noOptionsText`,
    defaultMessage: 'موردی یافت نشد',
  },
  inventory: {
    id: `app.admin.domains.products.containers.addProduct.inventory`,
    defaultMessage: 'موجودی',
  },
  uploadFile: {
    id: `app.admin.domains.products.containers.addProduct.uploadFile`,
    defaultMessage: 'بارگذاری فایل',
  },
  cancel: {
    id: `app.admin.domains.products.containers.addProduct.cancel`,
    defaultMessage: 'لغو',
  },
  applicable: {
    id: `app.admin.domains.products.containers.addProduct.applicable`,
    defaultMessage: 'قابل اجرا',
  },
  unchanged: {
    id: `app.admin.domains.products.containers.addProduct.unchanged`,
    defaultMessage: 'بدون تغییر',
  },
  failureDataStructure: {
    id: `app.admin.domains.products.containers.addProduct.failureDataStructure`,
    defaultMessage: 'عدم رعایت ساختار داده',
  },
  recordNotFound: {
    id: `app.admin.domains.products.containers.addProduct.recordNotFound`,
    defaultMessage: 'رکوردی یافت نشد',
  },
  undefined: {
    id: `app.admin.domains.products.containers.addProduct.undefined`,
    defaultMessage: 'نامشخص',
  },
  areYouSureToUpdateProduct: {
    id: `app.admin.domains.products.containers.addProduct.areYouSureToUpdateProduct`,
    defaultMessage: 'آیا از بروزرسانی {count} کالا اطمینان دارید؟',
  },
  update: {
    id: `app.admin.domains.products.containers.addProduct.update`,
    defaultMessage: 'بروزرسانی',
  },
  confirm: {
    id: `app.admin.domains.products.containers.addProduct.confirm`,
    defaultMessage: 'تایید',
  },
  InvalidInventory: {
    id: `app.admin.domains.products.containers.addProduct.InvalidInventory`,
    defaultMessage: 'موجودی نامعتبر است',
  },
  zeroPriceError: {
    id: `app.admin.domains.products.containers.addProduct.zeroPriceError`,
    defaultMessage: 'قیمت نمی تواند صفر باشد',
  },
  discountPriceError: {
    id: `app.admin.domains.products.containers.addProduct.discountPriceError`,
    defaultMessage: 'قیمت تخفیف نمی تواند بیشتر از قیمت باشد',
  },
})

export default ProductBulkEditMessages
