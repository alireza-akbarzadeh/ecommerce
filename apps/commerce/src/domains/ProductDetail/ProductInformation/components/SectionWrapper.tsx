import { Stack } from '@mui/material'
import { Dispatch, FC, PropsWithChildren, SetStateAction, useRef } from 'react'

interface ContainerProps {
  id: number
  scrollTrigger: boolean
  setActiveTab: Dispatch<SetStateAction<number>>
}
const SectionWrapper: FC<PropsWithChildren<ContainerProps>> = (props) => {
  const { setActiveTab, id, scrollTrigger, children } = props
  const sectionRef = useRef<HTMLDivElement | null>(null)

  return (
    <Stack py={2} spacing={5} ref={sectionRef}>
      {children}
    </Stack>
  )
}

export default SectionWrapper
