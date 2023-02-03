import { defineMessages } from 'react-intl'

const scope = 'app.commerce.profile.wallet'
const WalletMessages = defineMessages({
  yourInventory: {
    id: `${scope}.yourInventory`,
    defaultMessage: 'اعتبار حساب شما',
  },
  transactionsHistory: {
    id: `${scope}.transactionsHistory`,
    defaultMessage: 'تاریخچه تراکنش‌ها',
  },
  accountBallance: {
    id: `${scope}.accountBallance`,
    defaultMessage: 'اعتبار کیف پول',
  },
  inventory: {
    id: `${scope}.inventory`,
    defaultMessage: 'موجودی',
  },
  walletRules: {
    id: `${scope}.walletRules`,
    defaultMessage: 'قوانین کیف پول',
  },
  hasti: {
    id: `${scope}.hasti`,
    defaultMessage: 'داد و ستد بازار اینترنتی دارتیل',
  },
  requestWithdraw: {
    id: `${scope}.withdraw`,
    defaultMessage: 'درخواست برداشت',
  },
  withdrawWallet: {
    id: `${scope}.withdrawWallet`,
    defaultMessage: 'برداشت از کیف پول',
  },
  increaseCredit: {
    id: `${scope}.increaseCredit`,
    defaultMessage: 'افزایش موجودی',
  },
  increaseInevtory: {
    id: `${scope}.increaseInevtory`,
    defaultMessage: 'افزایش موجودی',
  },
  amountOfCreditIncrease: {
    id: `${scope}.amountOfCreditIncrease`,
    defaultMessage: 'موجودی کیف پول‌ خود را چقدر افزایش می‌دهید؟',
  },
  amountOfWithdrawFromTheWallet: {
    id: `${scope}.amountOfWithdrawFromTheWallet`,
    defaultMessage: 'می‌خواهید چه مبلغی از کیف خود برداشت کنید؟',
  },
  pay: {
    id: `${scope}.pay`,
    defaultMessage: 'پرداخت',
  },
  chargeWallet: {
    id: `${scope}.chargeWallet`,
    defaultMessage: 'شارژ کیف پول',
  },
  cancel: {
    id: `${scope}.cancel`,
    defaultMessage: 'انصراف',
  },
  otherAmounts: {
    id: `${scope}.otherAmounts`,
    defaultMessage: 'سایر مبالغ',
  },
  minimumAmountOfCreditIncrease: {
    id: `${scope}.minimumAmountOfCreditIncrease`,
    defaultMessage: 'کاربر گرامی حداقل مبلغ افزایش اعتبار {price} {currency}  است.',
  },
  minimumAmountOfWithdraw: {
    id: `${scope}.minimumAmountOfWithdraw`,
    defaultMessage: 'کاربر گرامی حداقل مبلغ برداشت اعتبار {amount} {currency}  است.',
  },
  maximumAmountOfWithDraw: {
    id: `${scope}.maximumAmountOfWithDraw`,
    defaultMessage: 'کاربر گرامی حداکثر مبلغ برداشت اعتبار {amount} {currency}  است.',
  },
  maximumAmountOfCreditIncrease: {
    id: `${scope}.minimumAmountOfCreditIncrease`,
    defaultMessage: 'کاربر گرامی حداکثر مبلغ افزایش اعتبار {price} {currency}  است.',
  },

  minimumWithdrawAmount: {
    id: `${scope}.minimumWithdrawAmount`,
    defaultMessage: 'کاربر گرامی حداقل مبلغ برداشت وجه {price} {currency}  است.',
  },
  maximumWithdrawAmount: {
    id: `${scope}.minimumWithdrawAmount`,
    defaultMessage: 'کاربر گرامی حداکثر مبلغ برداشت وجه {price} ریال  است.',
  },
  desiredAmountToIncreaseCredit: {
    id: `${scope}.desiredAmountToIncreaseCredit`,
    defaultMessage: 'مبلغ دلخواه برای افزایش اعتبار',
  },
  desiredAmountToWithdrawFromTheAccount: {
    id: `${scope}.desiredAmountToWithdrawFromTheAccount`,
    defaultMessage: 'مبلغ دلخواه برای برداشت از حساب',
  },
  checkTheCreditOfTheAccount: {
    id: `${scope}.checkTheCreditOfTheAccount`,
    defaultMessage: 'نقد کردن اعتبار حساب',
  },
  withdrawableAmount: {
    id: `${scope}.withdrawableAmount`,
    defaultMessage: 'مبلغ قابل برداشت',
  },
  rial: {
    id: `${scope}.rial`,
    defaultMessage: 'ریال',
  },
  validNumberAmount: {
    id: `${scope}.validNumberAmount`,
    defaultMessage: 'مبلغ دلخواه را به صورت عدد وارد کنید',
  },
  theCreditIncreaseWasDoneSuccessfully: {
    id: `${scope}.theCreditIncreaseWasDoneSuccessfully`,
    defaultMessage: 'افزایش اعتبار با موفقیت انجام شد',
  },
  thereIsAProblem: {
    id: `${scope}.thereIsAProblem`,
    defaultMessage: 'مشکلی پیش آمده است',
  },
  date: {
    id: `${scope}.date`,
    defaultMessage: 'تاریخ',
  },
  transactionType: {
    id: `${scope}.transactionType`,
    defaultMessage: 'نوع تراکنش',
  },
  reason: {
    id: `${scope}.reason`,
    defaultMessage: 'دلیل',
  },
  depositAmount: {
    id: `${scope}.depositAmount`,
    defaultMessage: 'مبلغ واریز',
  },
  withdrawAmount: {
    id: `${scope}.withdrawAmount`,
    defaultMessage: 'مبلغ برداشت',
  },
  description: {
    id: `${scope}.description`,
    defaultMessage: 'توضیحات',
  },
  status: {
    id: `${scope}.status`,
    defaultMessage: 'وضعیت',
  },
  close: {
    id: `${scope}.close`,
    defaultMessage: 'بستن',
  },
  view: {
    id: `${scope}.view`,
    defaultMessage: 'مشاهده',
  },
  totalAmountOfDeposit: {
    id: `${scope}.totalAmountOfDeposit`,
    defaultMessage: 'مجموع مبالغ واریزی',
  },
  note: {
    id: `${scope}.note`,
    defaultMessage: 'یادداشت',
  },
  addNote: {
    id: `${scope}.addNote`,
    defaultMessage: 'افزودن',
  },
  requiredField: {
    id: `${scope}.requiredField`,
    defaultMessage: 'این فیلد اجباری است',
  },
  writeYourNote: {
    id: `${scope}.writeYourNote`,
    defaultMessage: 'پیام خود را بنویسید...',
  },
  confirm: {
    id: `${scope}.confirm`,
    defaultMessage: 'تایید',
  },
  noteForTransaction: {
    id: `${scope}.noteForTransaction`,
    defaultMessage: 'یادداشت برای این تراکنش',
  },
  maxNoteLength: {
    id: `${scope}.maxNoteLength`,
    defaultMessage: 'حداکثر طول یادداشت {max} کاراکتر است',
  },
  confirmationWithdrawMessage: {
    id: `${scope}.confirmationWithdrawMessage`,
    defaultMessage: 'مبلغ  {amount}  {currency} به شماره کارت / شبا {cardNumber}  واریز میگردد.   ',
  },
  subTitleConfirmationWithdrawMessage: {
    id: `${scope}.subTitleConfirmationWithdrawMessage`,
    defaultMessage: 'در صورت نیاز می‌توانید در بخش حساب من، شماره کارت / شبا خود را تغییر دهید.',
  },
  changeCardNumber: {
    id: `${scope}.changeCardNumber`,
    defaultMessage: 'تغییر شماره کارت / شبا',
  },
  addNoteSuccess: {
    id: `${scope}.addNoteSuccess`,
    defaultMessage: 'افزودن یادداشت با موفقیت انجام شد',
  },
  depositTitle: {
    id: `${scope}.depositeTitle`,
    defaultMessage: 'واریز به کیف پول از حساب بانکی',
  },
  paymentTitle: {
    id: `${scope}.paymentTitle`,
    defaultMessage: 'پرداخت از طریق کیف پول برای خرید',
  },
  refundTitle: {
    id: `${scope}.refundTitle`,
    defaultMessage: 'برگشت به کیف پول',
  },
  withdrawTitle: {
    id: `${scope}.withdrawTitle`,
    defaultMessage: 'برداشت از کیف پول و واریز به حساب بانکی',
  },
  transferTitle: {
    id: `${scope}.transferTitle`,
    defaultMessage: 'انتقال به غیر',
  },
  undefinedTitle: {
    id: `${scope}.undefinedTitle`,
    defaultMessage: 'تعریف نشده',
  },
  depositTypeTitle: {
    id: `${scope}.depositTypeTitle`,
    defaultMessage: 'واریز',
  },
  withdrawTypeTitle: {
    id: `${scope}.withdrawTypeTitle`,
    defaultMessage: 'برداشت',
  },
  withdrawLabel: {
    id: `${scope}.withdrawLabel`,
    defaultMessage: 'مبلغ دلخواه برای برداشت',
  },
  transactionWaitingStatus: {
    id: `${scope}.transactionWaitingStatus`,
    defaultMessage: 'درحال بررسی',
  },
  transactionVerifiedStatus: {
    id: `${scope}.transactionVerifiedStatus`,
    defaultMessage: 'موفق',
  },
  transactionFailedStatus: {
    id: `${scope}.transactionFailedStatus`,
    defaultMessage: 'ناموفق',
  },
  requestSuccessMessage: {
    id: `${scope}.requestSuccessMessage`,
    defaultMessage: 'درخواست شما با موفقیت ثبت شد.',
  },
  requestFailedMessage: {
    id: `${scope}.requestFailedMessage`,
    defaultMessage: 'درخواست شما ثبت نشد. لطفا دوباره تلاش کنید.',
  },
})

export default WalletMessages
