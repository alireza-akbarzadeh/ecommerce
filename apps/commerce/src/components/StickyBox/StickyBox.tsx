import { Box } from '@mui/material'
import useScrollDirection from 'libs/core/src/hooks/useScrollDirection'
import { FC, PropsWithChildren, useEffect, useState } from 'react'

const StickyBox: FC<PropsWithChildren> = (props) => {
  const [height, setHeight] = useState<number>()
  const scrollDirection = useScrollDirection(0)

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
      sx={{
        top: height,
        position: 'sticky',
        transition: 'all 0 0.5s',
        zIndex: 1,
        height: 'fit-content',
      }}
    >
      {props.children}
    </Box>
  )
}

export default StickyBox
