import { useState } from 'react'

const useFormValidationDebounce = (
  debounceFunction: (value: string | number) => Promise<void | string>,
  debounceTimeout = 1000,
) => {
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null)
  return async (newValue: string | number): Promise<undefined | string> => {
    return new Promise((resolve) => {
      if (intervalId) clearTimeout(intervalId)
      setIntervalId(
        setTimeout(async () => {
          debounceFunction(newValue)
            .then((res) => resolve(undefined))
            .catch((err) => resolve(err))
        }, debounceTimeout),
      )
    })
  }
}
export { useFormValidationDebounce }
