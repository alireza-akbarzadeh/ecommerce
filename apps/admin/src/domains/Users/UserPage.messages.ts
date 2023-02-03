import { defineMessages } from 'react-intl'

const userPageMessages = defineMessages({
  general: {
    id: `app.admin.domains.users.list.general`,
    defaultMessage: 'عمومی',
  },
  edit: {
    id: `app.admin.domains.users.list.edit`,
    defaultMessage: 'ویرایش',
  },
  usersTitle: {
    id: `app.admin.domains.users.title`,
    defaultMessage: 'مدیریت کاربران',
  },
  usersRoleTitle: {
    id: `app.admin.domains.users.role.title`,
    defaultMessage: 'نقش‌ها',
  },
  usersEdit: {
    id: `app.admin.domains.users.edit`,
    defaultMessage: 'ویرایش کاربر',
  },
  usersAdd: {
    id: `app.admin.domains.users.add`,
    defaultMessage: 'افزودن کاربر',
  },
  usersShowMore: {
    id: `app.admin.domains.users.show.more`,
    defaultMessage: 'مشاهده نقش‌ها',
  },
  usersDeleteUser: {
    id: `app.admin.domains.users.delete.user`,
    defaultMessage: 'حذف کاربر',
  },
  usersDeleteSuccessFully: {
    id: `app.admin.domains.users.delete.successfully`,
    defaultMessage: 'تعداد {userCount} کاربر حذف شد',
  },
  usersDeleteFailed: {
    id: `app.admin.domains.users.delete.failed`,
    defaultMessage: 'تعداد {userCount} کاربر حذف نشد',
  },
  usersDeleteUserConfirm: {
    id: `app.admin.domains.users.delete.user.confirm`,
    defaultMessage: 'آیا از حذف کاربر {userCount} اطمینان دارید ؟',
  },
  usersChangeStatus: {
    id: `app.admin.domains.users.change.status`,
    defaultMessage: 'تغییر وضعیت کاربر',
  },
  usersChangeStatusConfirm: {
    id: `app.admin.domains.users.change.status.confirm`,
    defaultMessage: 'آیا از تغییر وضعیت  {userCount} کاربر اطمینان دارید ؟',
  },
  usersSuccessAdd: {
    id: `app.admin.domains.users.success.add`,
    defaultMessage: 'افزودن کاربر با موفقیت انجام شد',
  },
  usersFailAdd: {
    id: `app.admin.domains.users.success.add`,
    defaultMessage: 'افزودن کاربر با موفقیت انجام نشد',
  },
  usersSuccessUpdate: {
    id: `app.admin.domains.users.success.add`,
    defaultMessage: 'ویرایش کاربر با موفقیت انجام شد',
  },
  usersFailUpdate: {
    id: `app.admin.domains.users.success.add`,
    defaultMessage: 'ویرایش کاربر با موفقیت انجام نشد',
  },
  userDetail: {
    id: `app.admin.domains.users.userDetailPage.title`,
    defaultMessage: 'اطلاعات تکمیلی',
  },
  dashboard: {
    id: `app.admin.domains.users.userDetailPage.dashboard`,
    defaultMessage: 'داشبورد',
  },
  editAvatarSuccessMessage: {
    id: `app.admin.domains.users.userDetailPage.editAvatarSuccessMessage`,
    defaultMessage: 'ویرایش آواتار با موفقت انجام شد',
  },
  realInformation: {
    id: `app.admin.domains.users.userDetailPage.realInformation`,
    defaultMessage: 'اطلاعات حقیقی',
  },
  tabUserAccount: {
    id: `app.admin.domains.users.userDetailPage.tabUserAccount`,
    defaultMessage: 'حساب کاربری',
  },
  tabContactInfo: {
    id: `app.admin.domains.users.userDetailPage.tabContactInfo`,
    defaultMessage: 'اطلاعات تماس',
  },
  tabOrders: {
    id: `app.admin.domains.users.userDetailPage.tabOrders`,
    defaultMessage: 'سفارشات',
  },
  tabUserFeedback: {
    id: `app.admin.domains.users.userDetailPage.tabUserFeedback`,
    defaultMessage: 'بازخورد کاربر',
  },
  tabFinancialInfo: {
    id: `app.admin.domains.users.userDetailPage.tabFinancialInfo`,
    defaultMessage: 'اطلاعات مالی',
  },
  tabSetting: {
    id: `app.admin.domains.users.userDetailPage.tabSetting`,
    defaultMessage: 'تنظیمات',
  },
  tabMessages: {
    id: `app.admin.domains.users.userDetailPage.tabMessages`,
    defaultMessage: 'پیام‌ها',
  },
  customerDiscountCode: {
    id: `app.admin.domains.users.userDetailPage.customerDiscountCode`,
    defaultMessage: 'کد تخفیف مشتری',
  },
  tabCrm: {
    id: `app.admin.domains.users.userDetailPage.tabCrm`,
    defaultMessage: 'شکایات',
  },
  aboutUs: {
    id: `app.admin.domains.users.userDetailPage.aboutUs`,
    defaultMessage: 'درباره من',
  },
  legalInformation: {
    id: `app.admin.domains.users.userDetailPage.legalInformation`,
    defaultMessage: 'اطلاعات حقوقی',
  },
  firstName: {
    id: `app.admin.domains.users.userRealInformation.firstName`,
    defaultMessage: 'نام',
  },
  lastName: {
    id: `app.admin.domains.users.userRealInformation.lastName`,
    defaultMessage: 'نام خانوادگی',
  },
  nationalCode: {
    id: `app.admin.domains.users.userRealInformation.nationalCode`,
    defaultMessage: 'کد‌ملی',
  },
  birthDate: {
    id: `app.admin.domains.users.userRealInformation.birthDate`,
    defaultMessage: 'تاریخ تولد',
  },
  gender: {
    id: `app.admin.domains.users.userRealInformation.gender`,
    defaultMessage: 'جنسیت',
  },
  phoneNumber: {
    id: `app.admin.domains.users.userRealInformation.phoneNumber`,
    defaultMessage: 'شماره همراه',
  },
  reject: {
    id: `app.admin.domains.users.userRealInformation.reject`,
    defaultMessage: 'انصراف',
  },
  accept: {
    id: `app.admin.domains.users.userRealInformation.accept`,
    defaultMessage: 'تایید',
  },
  permissionDialogContent: {
    id: `app.admin.domains.users.userRealInformation.permissionDialogContent`,
    defaultMessage:
      'اطلاعات وارد شده در مرحله نهایی می باشد,آیا از بازشدن آن جهت ویرایش اطمینان دارید؟',
  },
  companyName: {
    id: `app.admin.domains.users.userLegalInformation.companyName`,
    defaultMessage: 'نام سازمان',
  },
  economicCode: {
    id: `app.admin.domains.users.userLegalInformation.economicCode`,
    defaultMessage: 'کد اقتصادی',
  },
  legalNationalCode: {
    id: `app.admin.domains.users.userLegalInformation.legalNationalCode`,
    defaultMessage: 'شناسه ملی',
  },
  registerId: {
    id: `app.admin.domains.users.userLegalInformation.registerId`,
    defaultMessage: 'شناسه ثبت',
  },
  cityId: {
    id: `app.admin.domains.users.userLegalInformation.cityId`,
    defaultMessage: 'کد شهر',
  },
  provinceName: {
    id: `app.admin.domains.users.userLegalInformation.provinceName`,
    defaultMessage: 'نام استان',
  },
  cityName: {
    id: `app.admin.domains.users.userLegalInformation.cityName`,
    defaultMessage: 'نام شهر',
  },
  phoneNo: {
    id: `app.admin.domains.users.userLegalInformation.phoneNo`,
    defaultMessage: 'تلفن ثابت',
  },
  email: {
    id: `app.admin.domains.users.userLegalInformation.email`,
    defaultMessage: 'ایمیل',
  },
  address: {
    id: `app.admin.domains.users.userLegalInformation.address`,
    defaultMessage: 'آدرس',
  },
  socialMedia: {
    id: `app.admin.domains.users.userLegalInformation.socialMedia`,
    defaultMessage: 'شبکه‌های اجتماعی',
  },
  changeStateError: {
    id: `app.admin.domains.users.change.state.error`,
    defaultMessage: 'خطا در ویرایش گردش کار',
  },
  passwordSuccess: {
    id: `app.admin.domains.users.password.success`,
    defaultMessage: 'تنظیم شده',
  },
  passwordExpired: {
    id: `app.admin.domains.users.password.expired`,
    defaultMessage: 'منقضی شده',
  },
  passwordNoSet: {
    id: `app.admin.domains.users.password.noSet`,
    defaultMessage: 'تنظیم نشده',
  },
  createdOn: {
    id: `app.admin.domains.users.createdOn`,
    defaultMessage: 'تاریخ ایجاد',
  },
  modifiedBy: {
    id: `app.admin.domains.users.modifiedBy`,
    defaultMessage: 'اصلاح کننده',
  },
  modifiedOn: {
    id: `app.admin.domains.users.modifiedOn`,
    defaultMessage: 'آخرین اصلاح',
  },
  isActive: {
    id: `app.admin.domains.users.isActive`,
    defaultMessage: 'وضعیت',
  },
  roleStateDraft: {
    id: `app.admin.domains.users.role.state.draft`,
    defaultMessage: 'پیش نویس',
  },
  roleStateSent: {
    id: `app.admin.domains.users.role.state.send`,
    defaultMessage: 'ارسال لینک',
  },
  roleStateBlocked: {
    id: `app.admin.domains.users.role.state.blocked`,
    defaultMessage: 'مسدود',
  },
  roleStateRelease: {
    id: `app.admin.domains.users.role.state.release`,
    defaultMessage: 'انتشار',
  },
  removeRoleError: {
    id: `app.admin.domains.users.remove.role.error`,
    defaultMessage: 'حذف نقش کاربر با خطا مواجه شد',
  },
  addRoleError: {
    id: `app.admin.domains.users.add.role.error`,
    defaultMessage: 'ایجاد نقش کاربر با خطا مواجه شد',
  },
  usersRole: {
    id: `app.admin.domains.users.role`,
    defaultMessage: 'نقش',
  },
  usersState: {
    id: `app.admin.domains.users.state`,
    defaultMessage: 'مرحله',
  },
  usersCreatedBy: {
    id: `app.admin.domains.users.createdBy`,
    defaultMessage: 'ایجادکننده',
  },
  usersCreatedOn: {
    id: `app.admin.domains.users.createdOn`,
    defaultMessage: 'تاریخ ایجاد',
  },
  usersPort: {
    id: `app.admin.domains.users.port`,
    defaultMessage: 'درگاه',
  },
  accessControl: {
    id: `app.admin.domains.users.accessControl`,
    defaultMessage: 'کنترل دسترسی',
  },
  roleExist: {
    id: `app.admin.domains.users.role.exist`,
    defaultMessage: 'نقش مورد نظر قبلا در سیستم ثبت شده است',
  },
  workflowStateEdit: {
    id: `app.admin.domains.users.workflow`,
    defaultMessage: 'تغییر مرحله',
  },
  userDetailTitle: {
    id: `app.admin.domains.users.detail.title`,
    defaultMessage: 'جزئیات کاربری',
  },
  userLegalUpdated: {
    id: `app.admin.domains.users.legal.updated`,
    defaultMessage: 'اطلاعات حقوقی به‌روزرسانی شد',
  },
  userAccountUpdated: {
    id: `app.admin.domains.users.legal.updated`,
    defaultMessage: 'اطلاعات حقیقی به‌روزرسانی شد',
  },
  userAboutUpdated: {
    id: `app.admin.domains.users.legal.updated`,
    defaultMessage: 'اطلاعات درباره من به‌روزرسانی شد',
  },
  usersAddressDeleteFailed: {
    id: `app.admin.domains.users.delete.failed`,
    defaultMessage: 'تعداد {userCount} آدرس کاربر حذف نشد',
  },
  usersAddressDeleteSuccess: {
    id: `app.admin.domains.users.delete.failed`,
    defaultMessage: 'تعداد {userCount} آدرس کاربر حذف شد',
  },
  usersAddressDeleteConfirm: {
    id: `app.admin.domains.users.delete.user.confirm`,
    defaultMessage: 'آیا از حذف {userCount} آدرس کاربر اطمینان دارید ؟',
  },
  usersSocialDeleteConfirm: {
    id: `app.admin.domains.users.social.delete.confirm`,
    defaultMessage: 'آیا از حذف {userCount} آدرس شبکه اجتماعی اطمینان دارید ؟',
  },
  recipientName: {
    id: `app.admin.domains.users.recipient.name`,
    defaultMessage: 'نام گیرنده/فرستنده',
  },
  recipientMobileNo: {
    id: `app.admin.domains.users.recipient.mobile.no`,
    defaultMessage: 'موبایل گیرنده/فرستنده',
  },
  isDefaultForm: {
    id: `app.admin.domains.users.is.default.form`,
    defaultMessage: 'پیش‌فرض است',
  },
  saveContinue: {
    id: `app.admin.domains.users.save.continue`,
    defaultMessage: 'ثبت و ادامه',
  },
  newAddress: {
    id: `app.admin.domains.users.new.address`,
    defaultMessage: 'آدرس جدید',
  },
  updateAddress: {
    id: `app.admin.domains.users.update.address`,
    defaultMessage: 'ویرایش آدرس',
  },
  addressUpdated: {
    id: `app.admin.domains.users.address.updated`,
    defaultMessage: 'ویرایش آدرس با موفقیت انجام شد',
  },
  addressCopied: {
    id: `app.admin.domains.users.address.copied`,
    defaultMessage: 'کپی آدرس با موفقیت انجام شد',
  },
  addressCreated: {
    id: `app.admin.domains.users.address.created`,
    defaultMessage: 'افزودن آدرس با موفقیت انجام شد',
  },
  copy: {
    id: `app.admin.domains.users.copy`,
    defaultMessage: 'کپی کردن',
  },
  sureCopyAddress: {
    id: `app.admin.domains.users.sure.copy.address`,
    defaultMessage: 'آیا از کپی کردن آدرس مطمئن هستید؟',
  },
  sureCopySocial: {
    id: `app.admin.domains.users.sure.copy.social`,
    defaultMessage: 'آیا از کپی کردن شبکه اجتماعی مطمئن هستید؟',
  },
  socialMediaUpdated: {
    id: `app.admin.domains.users.social.media.updated`,
    defaultMessage: 'مدیریت شبکه‌های اجتماعی به‌روزرسانی شد',
  },
  accountInformation: {
    id: `app.admin.domains.users.userDetailPage.legalInformation`,
    defaultMessage: 'اطلاعات حساب',
  },
  selectAll: {
    id: `app.admin.domains.users.selectAll`,
    defaultMessage: 'انتخاب همه',
  },
  dateSubmit: {
    id: `app.admin.domains.users.selectAll`,
    defaultMessage: 'تاریخ ثبت',
  },
  cardNumber: {
    id: `app.admin.domains.users.cardNumber`,
    defaultMessage: 'شماره کارت',
  },
  cardShaba: {
    id: `app.admin.domains.users.cardShaba`,
    defaultMessage: 'شماره شبا',
  },
  portal: {
    id: `app.admin.domains.users.portal`,
    defaultMessage: 'درگاه',
  },
  inquiryStage: {
    id: `app.admin.domains.users.inquiryStage`,
    defaultMessage: 'مرحله استعلام',
  },
  status: {
    id: `app.admin.domains.users.status`,
    defaultMessage: 'وضعیت',
  },
  defaultAccount: {
    id: `app.admin.domains.users.defaultAccount`,
    defaultMessage: 'حساب پیش فرض',
  },
  CopiedFromRow: {
    id: `app.admin.domains.users.defaultAccount`,
    defaultMessage: 'کپی شده از ردیف',
  },
  isTheDefault: {
    id: `app.admin.domains.users.isTheDefault`,
    defaultMessage: 'پیش فرض است',
  },
  confirmationInquiry: {
    id: `app.admin.domains.users.confirmationInquiry`,
    defaultMessage: 'تایید و استعلام',
  },
  createAccount: {
    id: `app.admin.domains.users.createAccount`,
    defaultMessage: 'ساخت حساب',
  },
  editAccount: {
    id: `app.admin.domains.users.editAccount`,
    defaultMessage: 'ویرایش حساب',
  },
  roles: {
    id: `app.admin.domains.users.roles`,
    defaultMessage: 'نقش',
  },
  statusMsg: {
    id: `app.admin.validations.enterValid`,
    defaultMessage: 'با موفقیت {msg} شد',
  },
  successChangeActive: {
    id: `app.admin.domains.users.successChangeActive`,
    defaultMessage: 'تعداد {count} کاربر با موفقیت تغییر وضعیت پیدا کرد',
  },
  workflowNotMatch: {
    id: `app.admin.domains.users.workflow.not.match`,
    defaultMessage: 'شماره موبایل و کد ‌ملی برای یک شخص نمی باشد',
  },
  workflowMatch: {
    id: `app.admin.domains.users.workflow.not.match`,
    defaultMessage: 'گردش کار با موفقیت اجرا گردید',
  },
  successChangeState: {
    id: `app.admin.domains.users.success.change.state`,
    defaultMessage: 'وضعیت کاربر با موفقیت تغییر کرد.',
  },
  userEditPage: {
    id: `app.admin.domains.users.user.edit.page`,
    defaultMessage: 'اطلاعات کاربران',
  },
  enterFullName: {
    id: `app.admin.domains.users.user.enter.fullName`,
    defaultMessage: 'نام و نام خانوادگی کاربر را وارد کنید.',
  },
  formItemName: {
    id: `app.admin.domains.users.form.item.name`,
    defaultMessage: 'نام',
  },
  formItemNameNotSuccess: {
    id: `app.admin.domains.users.form.item.name.not.success`,
    defaultMessage: 'نام معتبر نمی باشد',
  },
  formItemLastName: {
    id: `app.admin.domains.users.form.item.last.name`,
    defaultMessage: 'نام خانوادگی',
  },
  formItemLastNameNotSuccess: {
    id: `app.admin.domains.users.form.item.last.name.not.success`,
    defaultMessage: 'نام خانوادگی معتبر نمی باشد',
  },
  enterMobileAndEmail: {
    id: `app.admin.domains.users.user.enter.fullName`,
    defaultMessage: 'شماره موبایل و ایمیل را وارد کنید.',
  },
  formItemMobile: {
    id: `app.admin.domains.users.form.item.mobile`,
    defaultMessage: 'شماره موبایل',
  },
  formItemMobileNotSuccess: {
    id: `app.admin.domains.users.form.item.mobile.not.success`,
    defaultMessage: 'شماره موبایل معتبر نمی باشد',
  },
  formItemNationalCode: {
    id: `app.admin.domains.users.form.item.nationalCode`,
    defaultMessage: 'کد ملی',
  },
  formItemEmail: {
    id: `app.admin.domains.users.form.item.email`,
    defaultMessage: 'ایمیل',
  },
  formItemEmailNotSuccess: {
    id: `app.admin.domains.users.form.item.email.not.success`,
    defaultMessage: 'ایمیل وارد شده معتبر نمی باشد',
  },
  formItemEmailIsRequired: {
    id: `app.admin.domains.users.form.item.email.is.required`,
    defaultMessage: 'ایمیل را وارد نمایید',
  },
  formItemIsActive: {
    id: `app.admin.domains.users.form.item.is.active`,
    defaultMessage: 'وضعیت حساب کاربری',
  },
  stateExpired: {
    id: `app.admin.domains.users.state.expired`,
    defaultMessage: 'منقضی شده',
  },
  stateNotSet: {
    id: `app.admin.domains.users.state.not.set`,
    defaultMessage: 'تنظیم نشده',
  },
  stateSet: {
    id: `app.admin.domains.users.state.set`,
    defaultMessage: 'تنظیم شده',
  },
  statePassword: {
    id: `app.admin.domains.users.state.set.password`,
    defaultMessage: 'وضعیت رمز عبور',
  },
  save: {
    id: `app.admin.domains.users.save`,
    defaultMessage: 'ذخیره کردن',
  },
  wouldYouLikeToSaveTheChanges: {
    id: `app.admin.domains.users.wouldYouLikeToSaveTheChanges`,
    defaultMessage: 'آیا تمایل به ذخیره تغییرات دارید؟',
  },
  store: {
    id: `app.admin.domains.users.store`,
    defaultMessage: 'فروشگاه',
  },
  storeInfo: {
    id: `app.admin.domains.users.store.info`,
    defaultMessage: 'اطلاعات فروشگاه',
  },
  editAvatarStoreSuccessMessage: {
    id: `app.admin.domains.users.store.editAvatarStoreSuccessMessage`,
    defaultMessage: 'ویرایش پروفایل فروشگاه با موفقیت انجام شد',
  },
  visitors: {
    id: `app.admin.domains.users.store.visitors`,
    defaultMessage: 'بازدیدکنندگان',
  },
  followers: {
    id: `app.admin.domains.users.store.followers`,
    defaultMessage: 'دنبال کنندگان',
  },
  plaque: {
    id: `app.admin.domains.users.store.plaque`,
    defaultMessage: 'پلاک',
  },
  basedOnMessage: {
    id: `app.admin.domains.users.store.basedOnMessage`,
    defaultMessage: `(بر اساس {msg} نظر)`,
  },
  name: {
    id: `app.admin.domains.users.store.name`,
    defaultMessage: `نام فروشگاه`,
  },
  createDate: {
    id: `app.admin.domains.users.store.createDate`,
    defaultMessage: `تاریخ ایجاد فروشگاه`,
  },
  vitrin: {
    id: `app.admin.domains.users.store.vitrin`,
    defaultMessage: `صفحه ویترین`,
  },
  defaultAddress: {
    id: `app.admin.domains.users.store.defaultAddress`,
    defaultMessage: `آدرس فروشگاه`,
  },
  addAddress: {
    id: `app.admin.domains.users.store.addAddress`,
    defaultMessage: `اضافه کردن آدرس جدید`,
  },
  shortDescription: {
    id: `app.admin.domains.users.store.shortDescription`,
    defaultMessage: `محتوای اجمالی`,
  },
  fullContent: {
    id: `app.admin.domains.users.store.fullContent`,
    defaultMessage: `محتوای  کامل غرفه`,
  },
  banner: {
    id: `app.admin.domains.users.store.banner`,
    defaultMessage: `بنر و پوستر`,
  },
  relatedProductGroups: {
    id: `app.admin.domains.users.store.relatedProductGroups`,
    defaultMessage: `گروه‌های کالایی مرتبط`,
  },
  images: {
    id: `app.admin.domains.users.store.images`,
    defaultMessage: `محتوا عکس`,
  },
  videos: {
    id: `app.admin.domains.users.store.videos`,
    defaultMessage: `محتوا ویدیو`,
  },
  titleAddress: {
    id: `app.admin.domains.users.store.titleAddress`,
    defaultMessage: 'عنوان آدرس',
  },
  postalAddress: {
    id: `app.admin.domains.users.store.postalAddress`,
    defaultMessage: 'نشانی پستی',
  },
  selectedAddressOnYourLocation: {
    id: `app.admin.domains.users.store.postalAddress`,
    defaultMessage: 'آدرس بالا بر اساس موقعیت مکانی انتخابی‌تان وارد شده است.',
  },
  changeLocation: {
    id: `app.admin.domains.users.store.changeLocation`,
    defaultMessage: 'اصلاح موقعیت مکانی روی نقشه',
  },
  country: {
    id: `app.admin.domains.users.store.country`,
    defaultMessage: 'کشور',
  },
  province: {
    id: `app.admin.domains.users.store.province`,
    defaultMessage: 'استان',
  },
  city: {
    id: `app.admin.domains.users.store.city`,
    defaultMessage: 'شهر',
  },
  district: {
    id: `app.admin.domains.users.store.district`,
    defaultMessage: 'محله',
  },
  houseNumber: {
    id: `app.admin.domains.users.store.houseNumber`,
    defaultMessage: 'پلاک',
  },
  unit: {
    id: `app.admin.domains.users.store.unit`,
    defaultMessage: 'واحد',
  },
  postalCode: {
    id: `app.admin.domains.users.store.postalCode`,
    defaultMessage: 'کد پستی',
  },
  saveAsDefault: {
    id: `app.admin.domains.users.store.saveAsDefault`,
    defaultMessage: 'ذخیره به عنوان پیش فرض',
  },
  number: {
    id: `app.admin.domains.users.store.number`,
    defaultMessage: 'عدد',
  },
  saveAddressSuccess: {
    id: `app.admin.domains.users.store.saveAddressSuccess`,
    defaultMessage: 'آدرس با موفقیت ذخیره شد',
  },
  iran: {
    id: `app.admin.domains.users.store.iran`,
    defaultMessage: 'ایران',
  },
  wallet: {
    id: `app.admin.domains.users.financialInfo.wallet`,
    defaultMessage: 'کیف پول',
  },
  paymentHistory: {
    id: `app.admin.domains.users.financialInfo.paymentHistory`,
    defaultMessage: 'تاریخچه تراکنش‌های کیف پول',
  },
  insertDate: {
    id: `app.admin.domains.users.financialInfo.insertDate`,
    defaultMessage: 'تاریخ تراکنش',
  },
  transactionTypeTitle: {
    id: `app.admin.domains.users.financialInfo.transactionTypeTitle`,
    defaultMessage: 'نوع تراکنش',
  },
  reason: {
    id: `app.admin.domains.users.financialInfo.reason`,
    defaultMessage: 'دلیل',
  },
  reference: {
    id: `app.admin.domains.users.financialInfo.reference`,
    defaultMessage: 'مرجع',
  },
  cashinAmount: {
    id: `app.admin.domains.users.financialInfo.cashinAmount`,
    defaultMessage: 'مبلغ واریز',
  },
  cashoutAmount: {
    id: `app.admin.domains.users.financialInfo.cashoutAmount`,
    defaultMessage: 'مبلغ برداشت',
  },
  paymentGateway: {
    id: `app.admin.domains.users.financialInfo.paymentGateway`,
    defaultMessage: 'درگاه پرداخت',
  },
  paymentGatewayInfo: {
    id: `app.admin.domains.users.financialInfo.paymentGatewayInfo`,
    defaultMessage: 'اطلاعات شناسه درگاه',
  },
  paymentStatus: {
    id: `app.admin.domains.users.financialInfo.paymentStatus`,
    defaultMessage: 'وضعیت تراکنش',
  },
  paymentType: {
    id: `app.admin.domains.users.financialInfo.paymentType`,
    defaultMessage: 'نوع پرداخت',
  },
  partyGateway: {
    id: `app.admin.domains.users.financialInfo.partyGateway`,
    defaultMessage: 'درگاه کاربری',
  },
  systematicDescription: {
    id: `app.admin.domains.users.financialInfo.systematicDescription`,
    defaultMessage: 'توضیحات سیستمی',
  },
  partyNotes: {
    id: `app.admin.domains.users.financialInfo.partyNotes`,
    defaultMessage: 'یادداشت کاربر',
  },
  depositAmount: {
    id: `app.admin.domains.users.financialInfo.depositAmount`,
    defaultMessage: 'واریز',
  },
  withdrawAmount: {
    id: `app.admin.domains.users.financialInfo.withdrawAmount`,
    defaultMessage: 'برداشت',
  },
  totalSum: {
    id: `app.admin.domains.users.financialInfo.totalSum`,
    defaultMessage: 'جمع کل',
  },
  perPageSum: {
    id: `app.admin.domains.users.financialInfo.perPageSum`,
    defaultMessage: 'جمع در صفحه',
  },
  userMessages: {
    id: `app.admin.domains.users.userMessages`,
    defaultMessage: 'پیام‌ها',
  },
  create: {
    id: `app.admin.domains.users.create`,
    defaultMessage: 'ایجاد',
  },
  copyNoun: {
    id: `app.admin.domains.users.copyNoun`,
    defaultMessage: 'کپی',
  },
  unValidCardNo: {
    id: `app.admin.domains.users.unValidCardNo`,
    defaultMessage: 'شماره کارت وارد شده معتبر نیست',
  },
  unValidIban: {
    id: `app.admin.domains.users.unValidIban`,
    defaultMessage: 'شماره شبا وارد شده معتبر نیست',
  },
  unValidIbanOrCardNumber: {
    id: `app.admin.domains.users.unValidIbanOrCardNumber`,
    defaultMessage: 'شماره کارت یا شبا وارد شده معتبر نیست',
  },
  userNotFound: {
    id: `app.admin.domains.users.userNotFound`,
    defaultMessage: 'کاربر مورد نظر یافت نشد',
  },
  roleRequired: {
    id: `app.admin.domains.users.roleRequired`,
    defaultMessage: 'نقش کاربر انتخاب نشده است',
  },
  dialogConfirmationFinancialCopy: {
    id: `app.admin.domains.users.dialogConfirmationFinancialCopy`,
    defaultMessage: 'آیا از کپی کردن این حساب مطمئن هستید ؟',
  },
  dialogConfirmationFinancialDelete: {
    id: `app.admin.domains.users.dialogConfirmationFinancialDelete`,
    defaultMessage: 'آیا از حذف کردن این حساب  مطمئن هستید ؟',
  },
  deleteBankAccount: {
    id: `app.admin.domains.users.deleteBankAccount`,
    defaultMessage: 'اطلاعات حساب با موفقیت حذف شد',
  },
  addressRecordHistory: {
    id: `app.admin.domains.users.addressRecordHistory`,
    defaultMessage: 'تاریخچه رکورد',
  },
  addressRecordHistoryShow: {
    id: `app.admin.domains.users.addressRecordHistoryShow`,
    defaultMessage: 'نمایش',
  },
})
export default userPageMessages
