import { defineMessages } from 'react-intl'

const scope = 'apps.admin.domains.wallet.withdraw'
const WithdrawalRequests = defineMessages({
  withdrawalRequests: {
    id: `${scope}.withdrawalRequests`,
    defaultMessage: 'درخواست های برداشت وجه',
  },
  viewRequests: {
    id: `${scope}.viewRequests`,
    defaultMessage: 'مشاهده درخواست ها',
  },
  dashboard: {
    id: `${scope}.dashboard`,
    defaultMessage: 'داشبورد',
  },
  fromDate: {
    id: `${scope}.fromDate`,
    defaultMessage: 'تاریخ درخواست از',
  },
  toDate: {
    id: `${scope}.toDate`,
    defaultMessage: 'تاریخ درخواست تا',
  },
  withdrawDateFrom: {
    id: `${scope}.withdrawDateFrom`,
    defaultMessage: 'تاریخ واریز از',
  },
  withdrawDateTo: {
    id: `${scope}.withdrawDateTo`,
    defaultMessage: 'تاریخ واریز  تا',
  },
  minimumAmount: {
    id: `${scope}.minimumAmount`,
    defaultMessage: 'مبلغ درخواست از',
  },
  maximumAmount: {
    id: `${scope}.maximumAmount`,
    defaultMessage: 'مبلغ درخواست تا',
  },
  depositeOrWithdrawReferenceCode: {
    id: `${scope}.depositeOrWithdrawReferenceCode`,
    defaultMessage: 'شماره سند واریز',
  },
  checkStatus: {
    id: `${scope}.checkStatus`,
    defaultMessage: 'وضعیت بررسی',
  },
  caseStatus1: {
    id: `${scope}.caseStatus1`,
    defaultMessage: 'درحال بررسی',
  },
  caseStatus2: {
    id: `${scope}.caseStatus2`,
    defaultMessage: 'بسته شده',
  },
  cardNo: {
    id: `${scope}.cardNo`,
    defaultMessage: 'شماره کارت',
  },
  iban: {
    id: `${scope}.iban`,
    defaultMessage: 'شماره شبا',
  },
  panelType: {
    id: `${scope}.panelType`,
    defaultMessage: 'درگاه کاربری',
  },
  systemicDescription: {
    id: `${scope}.systemicDescription`,
    defaultMessage: 'دستور و توضیحات',
  },
  paymentReferenceCode: {
    id: `${scope}.paymentReferenceCode`,
    defaultMessage: 'شماره سند برداشت',
  },
  withdrawStatus: {
    id: `${scope}.withdrawStatus`,
    defaultMessage: 'وضعیت',
  },
  removeFilters: {
    id: `${scope}.removeFilters`,
    defaultMessage: 'حذف فیلتر',
  },
  addFilter: {
    id: `${scope}.addFilter`,
    defaultMessage: 'اعمال فیلتر',
  },
  downloadExcel: {
    id: `${scope}.downloadExcel`,
    defaultMessage: 'دریافت  لیست',
  },
  displayName: {
    id: `${scope}.displayName`,
    defaultMessage: 'نام و نام خانوادگی',
  },
  cellPhoneNumber: {
    id: `${scope}.cellPhoneNumber`,
    defaultMessage: 'شماره موبایل',
  },
  releaseDate: {
    id: `${scope}.releaseDate`,
    defaultMessage: 'تاریخ انتشار',
  },
  withdrawAmount: {
    id: `${scope}.withdrawAmount`,
    defaultMessage: 'مبلغ درخواستی',
  },
  withdrawDate: {
    id: `${scope}.withdrawDate`,
    defaultMessage: 'تاریخ برداشت',
  },
  insertDateTime: {
    id: `${scope}.insertDateTime`,
    defaultMessage: 'تاریخ درخواست',
  },
})

export default WithdrawalRequests
