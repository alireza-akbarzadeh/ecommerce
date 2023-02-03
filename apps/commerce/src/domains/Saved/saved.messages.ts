import { defineMessages } from 'react-intl'

const scope = 'app.commerce.saved'
const SavedMessages = defineMessages({
  savedSearch: {
    id: `${scope}.savedSearch`,
    defaultMessage: 'جستجوهای ذخیره شده',
  },
  savedVendors: {
    id: `${scope}.savedVendors`,
    defaultMessage: 'فروشگاه های ذخیره شده',
  },
  followerWithCount: {
    id: `${scope}.followerWithCount`,
    defaultMessage: '{count} دنبال کننده',
  },
  vendorSatisficationWithPercent: {
    id: `${scope}.vendorSatisfication`,
    defaultMessage: '٪{percent}  رضایت از فروشگاه',
  },
  availableProductWithCount: {
    id: `${scope}.availableProductWithCount`,
    defaultMessage: '{count} کالای موجود',
  },
  countOfProductsCount: {
    id: `${scope}.countOfProductsCount`,
    defaultMessage: '{count} تمام کالاها',
  },
  seeVendor: {
    id: `${scope}.seeVendor`,
    defaultMessage: 'مشاهده فروشگاه',
  },
  removeSelectedItems: {
    id: `${scope}.removeSelectedItems`,
    defaultMessage: 'حذف موارد انتخابی ',
  },
  removeConfirmMessage: {
    id: `${scope}.removeConfirmMessage`,
    defaultMessage: 'آیا از حذف موارد انتخابی مطمئن هستید؟',
  },
  cancel: {
    id: `${scope}.cancel`,
    defaultMessage: 'انصراف',
  },
  remove: {
    id: `${scope}.remove`,
    defaultMessage: 'حذف',
  },
  back: {
    id: `${scope}.back`,
    defaultMessage: 'بازگشت',
  },
  hastiBazaarText: {
    id: `${scope}.hastiBazaarText`,
    defaultMessage: 'بازار اینترنتی دارتیل',
  },
})

export default SavedMessages
