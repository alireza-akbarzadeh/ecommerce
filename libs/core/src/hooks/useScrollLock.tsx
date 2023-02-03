import React from 'react'
function useScrollLock() {
  const [isLocked, setIsLocked] = React.useState(false)

  const toggleScrollLock: (state: boolean) => void = (state: boolean) => {
    setIsLocked(state)
  }

  React.useEffect(() => {
    if (isLocked) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'auto'
    }
  }, [isLocked])

  return { isLocked, toggleScrollLock }
}

export default useScrollLock
