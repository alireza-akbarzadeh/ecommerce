import { Box } from '@mui/material'
import useScrollDirection from 'libs/core/src/hooks/useScrollDirection'
import { FC, PropsWithChildren, useEffect, useRef, useState } from 'react'

const StickyBox: FC<PropsWithChildren> = (props) => {
  const [height, setHeight] = useState<number>()
  const scrollDirection = useScrollDirection(0)

  const ref = useRef<HTMLDivElement | null>(null)
  useEffect(() => {
    setHeight(document.getElementById('mainHeader')?.getBoundingClientRect().bottom)
  }, [])

  useEffect(() => {
    const getHeight = () => {
      setTimeout(() => {
        setHeight(document.getElementById('mainHeader')?.getBoundingClientRect().bottom)
      }, 780)
    }
    document.addEventListener('scroll', getHeight)
    return () => document.removeEventListener('scroll', getHeight)
  }, [scrollDirection])

  return (
    <Box
      ref={ref}
      sx={{
        position: 'sticky',
        transition: 'all 0 0.5s',
        top: 0,
        zIndex: 1,
        height: 'fit-content',
      }}
    >
      {props.children}
    </Box>
  )
}

export default StickyBox
