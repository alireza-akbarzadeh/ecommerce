export enum FormPatternsEnums {
  PersianText = '^[آ-ی_ ]*$',
  // PersianText = '^([\u0600-\u06FF_ ]+s?)+$',
  Email = '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$',
  PhoneNumber = '^[0][9][0-9]{2,2}[0-9]{7,7}$',
}
