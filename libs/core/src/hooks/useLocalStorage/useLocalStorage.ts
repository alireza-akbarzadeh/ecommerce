import { Dispatch, SetStateAction, useCallback, useEffect, useState } from 'react'
import { useEventListener } from '../useEventListener'
import { useEventCallback } from '../useEventCallback'
import { parseJSON } from '../../utils'

declare global {
  interface WindowEventMap {
    'local-storage': CustomEvent
  }
}

type SetValue<T> = Dispatch<SetStateAction<T>>

function useLocalStorage<T>(key: string, initialValue: T): [T, SetValue<T>] {
  const { warn } = console
  const readValue = useCallback((): T => {
    if (typeof window === 'undefined') {
      return initialValue
    }
    try {
      const item = window.localStorage.getItem(key)
      return item ? (parseJSON(item) as T) : initialValue
    } catch (error) {
      warn(`Error reading localStorage key “${key}”:`, error)
      return initialValue
    }
  }, [initialValue, key])

  const [storedValue, setStoredValue] = useState(readValue)
  const setValue: SetValue<T> = useEventCallback((value) => {
    if (typeof window === 'undefined') {
      warn(`Tried setting localStorage key “${key}” even though environment is not a client`)
    }
    try {
      const newValue = value instanceof Function ? value(storedValue) : value
      window.localStorage.setItem(key, JSON.stringify(newValue))
      setStoredValue(newValue)
      window.dispatchEvent(new Event('local-storage'))
    } catch (error) {
      warn(`Error setting localStorage key “${key}”:`, error)
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

  useEventListener('local-storage', handleStorageChange)

  return [storedValue, setValue]
}

export default useLocalStorage
