import { defineMessages } from 'react-intl'

const transactionReportMessages = defineMessages({
  breadcrumbTitle: {
    id: `app.domains.transactionReport.breadcrumbTitle`,
    defaultMessage: 'مدیریت تراکنش های کیف پول',
  },
  filter: {
    id: `app.domains.transactionReport.filter`,
    defaultMessage: 'فیلترهای تراکنش',
  },
  history: {
    id: `app.domains.transactionReport.history`,
    defaultMessage: 'تاریخچه تراکنش',
  },
  fromDateTime: {
    id: `app.domains.transactionReport.fromDateTime`,
    defaultMessage: 'از تاریخ',
  },
  toDateTime: {
    id: `app.domains.transactionReport.toDateTime`,
    defaultMessage: 'تا تاریخ',
  },
  transactionTypeTitle: {
    id: `app.domains.transactionReport.transactionTypeTitle`,
    defaultMessage: 'نوع تراکنش',
  },
  reason: {
    id: `app.domains.transactionReport.reason`,
    defaultMessage: 'دلیل',
  },
  paymentMethod: {
    id: `app.domains.transactionReport.paymentMethod`,
    defaultMessage: 'درگاه پرداخت',
  },
  transactionStatus: {
    id: `app.admin.domains.transactionReport.transactionStatus`,
    defaultMessage: 'وضعیت تراکنش',
  },
  panelType: {
    id: `app.admin.domains.transactionReport.panelType`,
    defaultMessage: 'درگاه کاربری',
  },
  fromAmount: {
    id: `app.admin.domains.transactionReport.fromAmount`,
    defaultMessage: 'مبلغ از ({currency})',
  },
  toAmount: {
    id: `app.admin.domains.transactionReport.toAmount`,
    defaultMessage: 'مبلغ تا ({currency})',
  },
  to: {
    id: `app.admin.domains.transactionReport.to`,
    defaultMessage: 'تا',
  },
  submitFilter: {
    id: `app.admin.domains.transactionReport.submitFilter`,
    defaultMessage: 'اعمال فیلتر',
  },
  removeFilter: {
    id: `app.admin.domains.transactionReport.removeFilter`,
    defaultMessage: 'حذف فیلتر',
  },
  createdOn: {
    id: `app.admin.domains.transactionReport.createdOn`,
    defaultMessage: 'تاریخ تراکنش',
  },
  user: {
    id: `app.admin.domains.transactionReport.user`,
    defaultMessage: 'کاربر',
  },
  role: {
    id: `app.admin.domains.transactionReport.role`,
    defaultMessage: 'نقش',
  },
  phone: {
    id: `app.admin.domains.transactionReport.phone`,
    defaultMessage: 'تلفن',
  },
  cashinAmount: {
    id: `app.admin.domains.transactionReport.cashinAmount`,
    defaultMessage: 'مبلغ واریز',
  },
  cashoutAmount: {
    id: `app.admin.domains.transactionReport.cashoutAmount`,
    defaultMessage: 'مبلغ برداشت',
  },
  reasonTitle: {
    id: `app.admin.domains.transactionReport.reasonTitle`,
    defaultMessage: 'دلیل',
  },
  referenceTitle: {
    id: `app.admin.domains.transactionReport.referenceTitle`,
    defaultMessage: 'مرجع',
  },
  depositAmount: {
    id: `app.admin.domains.transactionReport.depositAmount`,
    defaultMessage: 'واریز',
  },
  withdrawAmount: {
    id: `app.admin.domains.transactionReport.withdrawAmount`,
    defaultMessage: 'برداشت',
  },
  paymentGateway: {
    id: `app.admin.domains.users.financialInfo.paymentGateway`,
    defaultMessage: 'درگاه پرداخت',
  },
  paymentGatewayInfo: {
    id: `app.admin.domains.users.financialInfo.paymentGatewayInfo`,
    defaultMessage: 'اطلاعات شناسه درگاه',
  },

  systematicDescription: {
    id: `app.admin.domains.users.financialInfo.systematicDescription`,
    defaultMessage: 'توضیحات سیستمی',
  },
  partyNotes: {
    id: `app.admin.domains.users.financialInfo.partyNotes`,
    defaultMessage: 'یادداشت کاربر',
  },
  perPageSum: {
    id: `app.admin.domains.transactionReport.perPageSum`,
    defaultMessage: 'جمع در صفحه',
  },
  totalSum: {
    id: `app.admin.domains.transactionReport.totalSum`,
    defaultMessage: 'جمع کل',
  },
  success: {
    id: `app.admin.domains.transactionReport.success`,
    defaultMessage: 'موفق',
  },
  unsuccess: {
    id: `app.admin.domains.transactionReport.unsuccess`,
    defaultMessage: 'ناموفق',
  },
  withdrawal: {
    id: `app.admin.domains.transactionReport.withdrawal`,
    defaultMessage: 'برداشت',
  },
  deposit: {
    id: `app.admin.domains.transactionReport.deposit`,
    defaultMessage: 'واریز',
  },
  type0: {
    id: `app.admin.domains.transactionReport.type0`,
    defaultMessage: 'تعریف نشده',
  },
  type1: {
    id: `app.admin.domains.transactionReport.type1`,
    defaultMessage: 'واریز به کیف پول از حساب بانکی',
  },
  type2: {
    id: `app.admin.domains.transactionReport.type`,
    defaultMessage: 'پرداخت از طریق کیف پول برای خرید',
  },
  type3: {
    id: `app.admin.domains.transactionReport.type3`,
    defaultMessage: 'برگشت به کیف پول',
  },
  type4: {
    id: `app.admin.domains.transactionReport.type4`,
    defaultMessage: 'برداشت از کیف پول و واریز به حساب بانکی',
  },
  type5: {
    id: `app.admin.domains.transactionReport.type5`,
    defaultMessage: 'انتقال به غیر',
  },
})
export default transactionReportMessages
