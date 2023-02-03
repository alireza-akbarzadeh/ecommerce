export enum CommissionType {
  ProductCategory = 1038001,
  Brand = 1038002,
  Seller = 1038003,
  Product = 1038004,
  Combination = 1038005,
}

export enum calculationType {
  Seller = 1039002,
}

export enum CommissionBusinessType {
  ProductCategory = 1038001,
  Brand = 1038002,
  Seller = 1038003,
  Product = 1038004,
  CategoryDefault = 1038005,
}

export enum CommissionCalculationMethod {
  Percentage = 1039001,
  FixedValue = 1039002,
}

export enum CommissionStatus {
  Draft = 1,
  Published = 2,
  canceled = 3,
  setToVendor = 4,
  vendorApproved = 5,
  vendorRefused = 6,
}

export enum CommissionFactor {
  Seller = 2,
  Other = 1,
}
