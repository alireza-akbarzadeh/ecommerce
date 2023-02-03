import { useIntersectionObserver, useScrollDirection } from '@hasty-bazar/core'
import { Stack, useTheme } from '@mui/material'
import { ScrollDirection } from 'libs/core/src/hooks/useScrollDirection'
import { Dispatch, FC, PropsWithChildren, SetStateAction, useEffect, useRef } from 'react'

interface ContainerProps {
  id: number
  scrollTrigger: boolean
  setActiveTab: Dispatch<SetStateAction<number>>
}
const SectionWrapper: FC<PropsWithChildren<ContainerProps>> = (props) => {
  const theme = useTheme()
  const isSmall = theme.breakpoints.down('sm')
  const { setActiveTab, id, scrollTrigger, children } = props
  const scrollDirection = useScrollDirection(0)
  const sectionRef = useRef<HTMLDivElement | null>(null)
  const entry = useIntersectionObserver(sectionRef, {
    threshold: scrollDirection === ScrollDirection.up ? 1 : isSmall ? 0.3 : 0.6,
  })
  const isInView = !!entry?.isIntersecting

  useEffect(() => {
    if (!scrollTrigger && isInView) setActiveTab(id)
  }, [isInView, scrollDirection])

  return (
    <Stack py={5} spacing={5} ref={sectionRef}>
      {children}
    </Stack>
  )
}

export default SectionWrapper
