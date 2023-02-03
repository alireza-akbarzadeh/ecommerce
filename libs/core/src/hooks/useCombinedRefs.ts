import React, { MutableRefObject } from 'react'

function useCombinedRefs<T extends object>(...refs: any) {
  const targetRef = React.useRef<T | null>(null)

  React.useEffect(() => {
    refs.forEach((ref: MutableRefObject<T | null>) => {
      if (!ref) return

      if (typeof ref === 'function') {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        ref(targetRef.current)
      } else {
        ref.current = targetRef.current
      }
    })
  }, [refs])

  return targetRef
}

export default useCombinedRefs
