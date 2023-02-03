import { defineMessages } from 'react-intl'

const shippingInformation = defineMessages({
  preparationSupplyTime: {
    id: `app.admin.domains.products.containers.productForm.shippingInformation.PreparationSupplyTime`,
    defaultMessage: 'زمان آماده سازی / تامین  (روز)',
  },
  sendMethod: {
    id: `app.admin.domains.products.containers.productForm.shippingInformation.sendMethod`,
    defaultMessage: 'نحوه ارسال',
  },
  timeSpan: {
    id: `app.admin.domains.products.containers.productForm.shippingInformation.timeSpan`,
    defaultMessage: 'بازه زمانی ',
  },
  vendorAddresses: {
    id: `app.admin.domains.products.containers.productForm.shippingInformation.ShippingAddress`,
    defaultMessage: 'آدرسهای فروشنده',
  },
  shippingCost: {
    id: `app.admin.domains.products.containers.productForm.shippingInformation.shippingCost`,
    defaultMessage: 'هزینه ارسال',
  },
  transportationCosts: {
    id: `app.admin.domains.products.containers.productForm.shippingInformation.TransportationCosts`,
    defaultMessage: 'هزینه حمل و نقل',
  },
  city: {
    id: `app.admin.domains.products.containers.productForm.shippingInformation.city`,
    defaultMessage: 'شهر',
  },

  earliestShippingTime: {
    id: `app.admin.domains.products.containers.productForm.shippingInformation.EarliestShippingTime`,
    defaultMessage: 'زودترین زمان ارسال(روز)',
  },
  latestShippingTime: {
    id: `app.admin.domains.products.containers.productForm.shippingInformation.LatestShippingTime`,
    defaultMessage: 'دیرترین زمان ارسال(روز)',
  },
  fieldRequired: {
    id: `app.admin.domains.products.containers.productForm.shippingInformation.fieldRequired`,
    defaultMessage: 'این فیلد اجباری است',
  },
  earliestShippingTimeError: {
    id: `app.admin.domains.products.containers.productForm.shippingInformation.earliestShippingTimeError`,
    defaultMessage: 'زودترین زمان ارسال باید کمتر از دیرترین زمان ارسال باشد',
  },
  minValueError: {
    id: `app.admin.domains.products.containers.productForm.shippingInformation.minValueError`,
    defaultMessage: 'حداقل مقدار 0 می باشد',
  },
  latestShippingTimeError: {
    id: `app.admin.domains.products.containers.productForm.shippingInformation.latestShippingTimeError`,
    defaultMessage: 'دیرترین زمان ارسال باید بیشتر از زودترین زمان ارسال باشد',
  },
  sendLocationAddress: {
    id: `app.admin.domains.products.containers.productForm.shippingInformation.chooseDefaultAddress`,
    defaultMessage: ': آدرس محل ارسال',
  },
  defaultVendorAddress: {
    id: `app.admin.domains.products.containers.productForm.shippingInformation.defaultVendorAddress`,
    defaultMessage: 'آدرس پیش فرض فروشنده',
  },
  chooseAddress: {
    id: `app.admin.domains.products.containers.productForm.shippingInformation.chooseAddress`,
    defaultMessage: 'انتخاب آدرس',
  },
})

export default shippingInformation
