import { useLayoutEffect, useState } from 'react'

export const useScrollspy = (ids: string[], offset = 0) => {
  const [activeId, setActiveId] = useState('INTRODUCE')

  const clamp = (value: number) => Math.max(0, value)

  const isBetween = (value: number, floor: number, ceil: number) => value >= floor && value <= ceil

  const changeActiveId = (id: string) => {
    setActiveId(id)
    const element = document.getElementById(id)
    if (element) {
      const y = element.getBoundingClientRect().top - offset + window.scrollY
      window.scroll({
        top: y,
        behavior: 'smooth',
      })
    }
  }

  useLayoutEffect(() => {
    const listener = () => {
      const scroll = window.pageYOffset

      const position = ids
        .map((id) => {
          const element = document.getElementById(id)

          if (!element) return { id, top: -1, bottom: -1 }

          const rect = element.getBoundingClientRect()
          const top = clamp(rect.top + scroll - offset)
          const bottom = clamp(rect.bottom + scroll - offset)

          return { id, top, bottom }
        })
        .find(({ top, bottom }) => isBetween(scroll, top, bottom))

      setActiveId(position?.id || '')
    }

    listener()

    window.addEventListener('resize', listener)
    window.addEventListener('scroll', listener)

    return () => {
      window.removeEventListener('resize', listener)
      window.removeEventListener('scroll', listener)
    }
  }, [ids, offset])

  return { activeId, changeActiveId }
}
