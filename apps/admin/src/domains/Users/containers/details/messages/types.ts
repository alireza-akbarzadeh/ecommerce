export type UserMessagesFilter = {
  messageTransferType?: string
  fromDateTime?: string
  toDateTime?: string
  protocolType?: string
  reason?: string
  panelType?: string
  recipientUserId?: string
}

export type UserMessagesList = {
  date?: string
  messageTransferType?: string
  title: string
  message: string
  protocolType?: string
  reason?: string
  panelType?: string
}
