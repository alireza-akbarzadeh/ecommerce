import lodash from 'lodash'
import { useEffect, useRef } from 'react'

const useMemoWithCompare = <T>(next: T) => {
  const previousRef = useRef<T>()
  const previous = previousRef.current
  const isEqual = lodash.isEqual(previous, next)
  useEffect(() => {
    if (!isEqual) {
      previousRef.current = next
    }
  })
  return isEqual ? previous : next
}

export { useMemoWithCompare }
