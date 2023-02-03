import { useEffect, useState } from 'react'

interface IWindowPosition {
  y: number
  x: number
}

const useWindowScrollPosition = () => {
  const [windowScrollPosition, setWindowScrollPosition] = useState<IWindowPosition | null>(null)
  useEffect(() => {
    const onScroll = () =>
      window.requestAnimationFrame(() => {
        setWindowScrollPosition({ x: window.scrollX, y: window.scrollY })
      })

    window.addEventListener('scroll', onScroll)

    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return windowScrollPosition
}

export default useWindowScrollPosition
