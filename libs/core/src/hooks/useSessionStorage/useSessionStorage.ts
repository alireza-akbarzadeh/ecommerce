import useEventCallback from '@mui/utils/useEventCallback'
import { Dispatch, SetStateAction, useCallback, useEffect, useState } from 'react'

import { parseJSON } from '../../utils'
import { useEventListener } from '../useEventListener'

declare global {
  interface WindowEventMap {
    'session-storage': CustomEvent
  }
}

type SetValue<T> = Dispatch<SetStateAction<T>>

function useSessionStorage<T>(key: string, initialValue: T): [T, SetValue<T>] {
  const { warn } = console

  const readValue = useCallback((): T => {
    if (typeof window === 'undefined') {
      return initialValue
    }

    try {
      const item = window.sessionStorage.getItem(key)
      return item ? (parseJSON(item) as T) : initialValue
    } catch (error) {
      warn(`Error reading sessionStorage key “${key}”:`, error)
      return initialValue
    }
  }, [initialValue, key])

  const [storedValue, setStoredValue] = useState<T>(readValue)

  const setValue: SetValue<T> = useEventCallback((value) => {
    if (typeof window == 'undefined') {
      warn(`Tried setting sessionStorage key “${key}” even though environment is not a client`)
    }

    try {
      const newValue = value instanceof Function ? value(storedValue) : value

      window.sessionStorage.setItem(key, JSON.stringify(newValue))

      setStoredValue(newValue)

      window.dispatchEvent(new Event('session-storage'))
    } catch (error) {
      warn(`Error setting sessionStorage key “${key}”:`, error)
    }
  })

  useEffect(() => {
    setStoredValue(readValue())
  }, [])

  const handleStorageChange = useCallback(
    (event: StorageEvent | CustomEvent) => {
      if ((event as StorageEvent)?.key && (event as StorageEvent).key !== key) {
        return
      }
      setStoredValue(readValue())
    },
    [key, readValue],
  )

  useEventListener('storage', handleStorageChange)

  useEventListener('session-storage', handleStorageChange)

  return [storedValue, setValue]
}

export default useSessionStorage
