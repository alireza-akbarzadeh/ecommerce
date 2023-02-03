export enum FormPatternsEnums {
  number = '^[0-9]*$',
  email = '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$',
  containSpecialCharacter = '[^a-zA-Z0-9]',
  mobile = '^09[0-3|8-9][0-9]{8}$',
  containsNumber = '(.*\\d.*)',
  containsLowerCase = '(.*[a-z].*)',
  containsSpecialCharacter = '[!@#$%^&*(),.?":{}|<>]',
  allowLetters = '^[\\x00-\\x7f\\۰-۹]*$',
  PersianText = '^[آ-ی]*$',
  atLeastMustHaveOneCapitalLetter = '(.*[A-Z].*)',
  mobileWithPrefix = '^(\\d{9})$',
  phoneNoWithPrefix = '^[1-9][0-9]{9}$',
  containsOneEnglishLetter = '(.*[a-zA-Z].*)',
  containsUpperCase = '(.*[A-Z].*)',
  allowNumbers = '^[0-9۰-۹]*$',
}