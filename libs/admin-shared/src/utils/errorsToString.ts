export function errorsToString(errors: any): string {
  if (errors?.data?.Messages) {
    const messagesForShowInConsole = errors?.data?.Messages.filter((msg: any) => {
      if (msg?.Code === 'exception' || msg?.Code === 'BadRequest') {
        return msg
      }
    })

    const messages = errors?.data?.Messages.filter((msg: any) => {
      if (msg?.Code !== 'exception' && msg?.Code !== 'BadRequest') {
        return msg
      }
    })?.map((message: any) => {
      return message?.Message
    })
    return messages.join('\n')
  }

  if (errors?.data?.messages || errors?.messages) {
    const errorsM = errors?.data?.messages || errors?.messages

    const errorsCodes = errorsM
      ?.filter((msg: any) => msg?.code !== 'exception' && msg?.code !== 'BadRequest')
      .map((msg: any) => msg?.message)
      .join('\n')

    return errorsCodes
  }
  return 'مشکلی در سرور به وجود آمده است'
}
