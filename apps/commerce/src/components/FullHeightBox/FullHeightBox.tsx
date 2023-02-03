import { Box, SxProps } from '@mui/system'
import { ScrollDirection } from 'libs/core/src/hooks/useScrollDirection'
import { FC, PropsWithChildren, useEffect, useState } from 'react'

interface FullHeightBoxProps {
  scrollDirection: ScrollDirection
  spaceFromTop?: number
  sx?: SxProps
}

const FullHeightBox: FC<PropsWithChildren<FullHeightBoxProps>> = (props) => {
  const { scrollDirection, children, spaceFromTop = 0, sx } = props
  const [headerHeight, setHeaderHeight] = useState<number>()

  useEffect(() => {
    const getHeight = () => {
      setTimeout(() => {
        setHeaderHeight(document.getElementById('mainHeader')?.getBoundingClientRect().height)
      }, 780)
    }
    setHeaderHeight(document.getElementById('mainHeader')?.getBoundingClientRect().height)
    document.addEventListener('scroll', getHeight, { passive: true })
    getHeight()

    return () => document.removeEventListener('scroll', getHeight)
  }, [])

  return (
    <Box
      sx={{
        height: `calc(100vh - ${(headerHeight ?? 0) + spaceFromTop}px)`,
        overflow: 'hidden',
        ...sx,
      }}
    >
      {children}
    </Box>
  )
}

export default FullHeightBox
