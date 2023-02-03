export enum RefrenceEntity {
  OrderPayment = 'OrderPayment',
  OrderVoucher = 'OrderVoucher',
  OrderCargo = 'OrderCargo',
  OrderCommission = 'OrderCommission',
  OrderDetailVat = 'OrderDetailVat',
  OrderDetail = 'OrderDetail',
  Wallet = 'Wallet',
}

export enum MainRefrenceEntity {
  Order = 'Order',
  Wallet = 'Wallet',
}

export enum ShippingProviderType {
  Carrier = 1057001,
  ServiceProvider = 1057002,
}

export enum ShippingProviderStateMachine {
  Draft = 1,
  Active = 2,
  Deactive = 3,
}
