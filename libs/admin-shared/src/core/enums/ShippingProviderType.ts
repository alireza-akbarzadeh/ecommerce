export enum ShippingProviderState {
  Draft = '1',
  Active = '2',
  Deactive = '3',
}

export enum TypeOfServiceProvider {
  DirectCarrier = '1057001',
  TransportServiceProvider = '1057002',
}

export enum BusinessType {
  ShippingProviderType = '1057',
  SelectionLimitationType = '1014',
  ShippingProviderPriority = '1060',
  ProductCollectionType = '1056',
  ShippingCostInquiryType = '1058',
  CheckoutPeriodType = '1059',
}

export enum TypeOfCargoReceiving {
  CompanyLocation = '1056001',
  FromSellerWarehouse = '1056002',
}

export enum ShippingCostInquiryType {
  FixedTariffs = '1058001',
  OnTheLine = '1058002',
}

export enum SettlementType {
  Interval = '1059001',
  FixedDayOfTheMonth = '1059002',
}

export enum ExceptionOfTheCommodityGroup {
  AllButException = '1014001',
  JustException = '1014002',
}

export enum PriorityToUseTheShippingCompany {
  FirstPriority = '1060001',
  SecondPriority = '1060002',
  ThirdPriority = '1060003',
  ForthPriority = '1060004',
}
