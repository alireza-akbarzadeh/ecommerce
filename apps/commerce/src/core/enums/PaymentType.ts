export enum PaymentMethodType {
  GateWay = 1071001,
  Wallet,
  Credit,
}

export enum ProviderTypeEnum {
  None = 1107001,
  Sep,
  HitWallet,
  TaraWallet,
}

export enum PaymentStatusEnum {
  None = 1104001,
  Waiting = 1104002,
  Success = 1104003,
  Failed = 1104004,
  Canceled = 1104005,
}

export enum PaymentBusinessEnum {
  PayTest = 1108001,
  Order,
  Wallet,
}
