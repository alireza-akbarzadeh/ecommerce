const { error } = console

export function errorsToString(errors: any): string {
  if (errors?.data?.Messages) {
    const messagesForShowInConsole = errors?.data?.Messages.filter((msg: any) => {
      if (msg?.Code === 'exception' || msg?.Code === 'BadRequest') {
        return msg
      }
    })
    error(messagesForShowInConsole)
    const messages = errors?.data?.Messages.filter((msg: any) => {
      if (msg?.Code !== 'exception' && msg?.Code !== 'BadRequest') {
        return msg
      }
    })?.map((message: any) => {
      return message?.Message
    })
    return messages.join('\n')
  }

  if (errors?.data?.messages) {
    const messagesForShowInConsole = errors?.data?.messages.filter((msg: any) => {
      if (msg?.Code === 'exception' || msg?.Code === 'BadRequest') {
        return msg
      }
    })
    error(messagesForShowInConsole)
    return errors?.data?.messages
      ?.filter((msg: any) => {
        if (msg?.code !== 'exception' && msg?.code !== 'BadRequest') {
          return msg
        }
      })
      .map((msg: any) => msg?.message)
      .join('\n')
  }
  return 'مشکلی در سرور به وجود آمده است'
}
