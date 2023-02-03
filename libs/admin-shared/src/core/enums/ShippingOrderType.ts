enum DateFilterTypeCode {
  PostageDate = '1',
  OrderDate = '2',
}

enum RoleStateEnum {
  Draft = 0,
  Sent = 1,
  Publish = 2,
  Block = 3,
}

enum OrderStatusEnum {
  waiting = 1,
  delivered,
  cancel,
  autoCancel,
}

enum OrderPaymentEnum {
  Waiting = 1,
  Success = 2,
  Failed = 3,
  Canceled = 4,
  AutomaticCancel = 5,
}

enum GridStatusEnum {
  deActive,
  active,
}

export { GridStatusEnum, OrderPaymentEnum, OrderStatusEnum, RoleStateEnum, DateFilterTypeCode }
export enum ShippingAgentType {
  Padro = '1',
  Post = '2',
}

export enum ShippingStatusType {
  Draft = '1',
  Canceled = '2',
  WaitingToVendorConfirmation = '3',
  Sending = '4',
  UnsuccessDeliver = '5',
  DeliveredToCustomer = '6',
  Rerurend = '7',
  SystemCancelled = '8',
}

export enum CommissionTypeOfEachProduct {
  ProductCategory = 1038001,
  Brand = 1038002,
  Seller = 1038003,
  Product = 1038004,
}

export enum ProviderType {
  Agent = 1057002,
  Carrier = 1057001,
}

export enum TransactionType {
  Deposit = 1070001,
  WithDrawal = 1070002,
}
