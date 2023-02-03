export const parseErrorSchema: (error: any, validation?: object) => string[] = (
  error,
  validateAllFieldCriteria,
) => {
  return Array.isArray(error.inner)
    ? error.inner.reduce((previous: any, { message }: any) => {
        previous.push(message)
        return previous
      }, [])
    : [error.message]
}
