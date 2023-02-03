import { defineMessages } from 'react-intl'

export const scope = 'app.commerce.result'
const ResultPageMessages = defineMessages({
  paymentMethodsTitle: {
    id: `${scope}.paymentMethodsTitle`,
    defaultMessage: 'روش پرداخت',
  },
  orderId: {
    id: `${scope}.orderId`,
    defaultMessage: 'شماره سفارش',
  },
  paymentId: {
    id: `${scope}.paymentId`,
    defaultMessage: 'شماره پرداخت',
  },
  transferring: {
    id: `${scope}.transferring`,
    defaultMessage: 'در حال پردازش',
  },
  paymentPrice: {
    id: `${scope}.paymentPrice`,
    defaultMessage: 'مبلغ',
  },
  successOrderMessage: {
    id: `${scope}.successOrderMessage`,
    defaultMessage: 'سفارش شما با موفقیت ثبت شد',
  },
  successPayMessage: {
    id: `${scope}.successPayMessage`,
    defaultMessage: 'پرداخت شما با موفقیت انجام شد',
  },
  successWalletDepositMessage: {
    id: `${scope}.successWalletDepositMessage`,
    defaultMessage: 'کیف پول شما با موفقیت شارژ شد',
  },
  failOrderMessage: {
    id: `${scope}.failOrderMessage`,
    defaultMessage: 'پرداخت شما ناموفق بود!',
  },
  nonePayMessage: {
    id: `${scope}.nonePayMessage`,
    defaultMessage: 'وضعیت پرداخت نامشخص!',
  },
  canceledPayMessage: {
    id: `${scope}.canceledPayMessage`,
    defaultMessage: 'انصراف از پرداخت',
  },
  waitingOrderMessage: {
    id: `${scope}.waitingOrderMessage`,
    defaultMessage: 'سفارش در انتظار پرداخت',
  },
  failOrderDescription: {
    id: `${scope}.failOrderDescription`,
    defaultMessage:
      'در صورتیکه پول از حساب شما کسر شده (طبق قوانین بانکی کشور) مبلغ حداکثر تا ۷۲ ساعت به حساب شما باز میگردد.',
  },
  walletTrackBtn: {
    id: `${scope}.walletTrackBtn`,
    defaultMessage: 'بازگشت به کیف پول',
  },
  orderTrackBtn: {
    id: `${scope}.orderTrackBtn`,
    defaultMessage: 'پیگیری سفارش',
  },
  orderRepayBtn: {
    id: `${scope}.orderRepayBtn`,
    defaultMessage: 'پرداخت مجدد',
  },
  completePayBtn: {
    id: `${scope}.completePayBtn`,
    defaultMessage: 'تکمیل پرداخت',
  },
  returnToApp: {
    id: `${scope}.returnToApp`,
    defaultMessage: 'بازگشت به اپلیکیشن',
  },
})

export default ResultPageMessages
