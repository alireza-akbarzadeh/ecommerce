import { defineMessages } from 'react-intl'

const OrderValueStockControlValueMessages = defineMessages({
  successPost: {
    id: `app.admin.domains.products.containers.productForm.ordering.orderValueStockControlValue.successPost`,
    defaultMessage: 'تنظیمات با موفقیت ثبت شد',
  },
  minimalForAlert: {
    id: `app.admin.domains.products.containers.productForm.ordering.orderValueStockControlValue.minimalForAlert`,
    defaultMessage: 'حداقل مقدار جهت هشدار',
  },
  minimalPerOrder: {
    id: `app.admin.domains.products.containers.productForm.ordering.orderValueStockControlValue.minimalPerOrder`,
    defaultMessage: 'حداقل میزان هر بار سفارش',
  },
  maximalPerOrder: {
    id: `app.admin.domains.products.containers.productForm.ordering.orderValueStockControlValue.maximalPerOrder`,
    defaultMessage: 'حداکثر میزان  هر بار سفارش',
  },
  maximalSellWithoutInventory: {
    id: `app.admin.domains.products.containers.productForm.ordering.orderValueStockControlValue.maximalSellWithoutInventory`,
    defaultMessage: 'حداکثر فروش بدون موجودی',
  },
  multiplesOrder: {
    id: `app.admin.domains.products.containers.productForm.ordering.orderValueStockControlValue.multiplesOrder`,
    defaultMessage: 'تعداد مضرب سفارش',
  },
  numberForShowCountInventory: {
    id: `app.admin.domains.products.containers.productForm.ordering.orderValueStockControlValue.numberForShowCountInventory`,
    defaultMessage: 'مقدار برای شروع شمارش باقیمانده تعداد موجود',
  },
  maximalMinimalPerOrder: {
    id: `app.admin.domains.products.containers.productForm.ordering.orderValueStockControlValue.maximalMinimalPerOrder`,
    defaultMessage: 'حداکثر میزان بار باید از حداقل میزان بار بیشتر باشد',
  },
  multiplesMaximalOrder: {
    id: `app.admin.domains.products.containers.productForm.ordering.orderValueStockControlValue.multiplesMaximalOrder`,
    defaultMessage: 'ضریب هر سفارش نباید از حداکثر سفارش بیشتر باشد',
  },
  fieldRequired: {
    id: `app.admin.domains.products.containers.productForm.ordering.orderValueStockControlValue.fieldRequired`,
    defaultMessage: 'این فیلد اجباری است',
  },
  fieldMin: {
    id: `app.admin.domains.products.containers.productForm.ordering.orderValueStockControlValue.minField`,
    defaultMessage: 'حداقل مقدار باید بیشتر از {min} باشد',
  },
  fieldMax: {
    id: `app.admin.domains.products.containers.productForm.ordering.orderValueStockControlValue.maxField`,
    defaultMessage: 'حداکثر مقدار باید کمتر از {max} باشد',
  },
})

export default OrderValueStockControlValueMessages
