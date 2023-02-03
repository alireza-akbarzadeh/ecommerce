import { Box, Popper, Stack } from '@mui/material'
import { FC, useEffect, useRef, useState } from 'react'

interface IHBImageMagnifierProps {
  src: string
  width: string
  height: string
  magnifierHeight?: string
  magnifieWidth?: string
  alt?: string
  resultHeight?: number
  zoom: number
  resultWidth?: number
}

const HBImageMagnifier: FC<IHBImageMagnifierProps> = (props) => {
  const { height, width, src, alt = '', zoom: scale } = props
  const imgRef = useRef<HTMLImageElement | null>(null)
  const glassRef = useRef<HTMLDivElement>(null)
  const [[resultWidth, resultHeight], setResultSize] = useState<number[]>([0, 0])

  const [[x, y], setXY] = useState([0, 0])
  const [showMagnifier, setShowMagnifier] = useState(false)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  const lensRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!imgRef.current) return
    setResultSize([
      !props.resultWidth ? imgRef.current.width * 2 : props.resultWidth,
      !props.resultHeight ? imgRef.current.height * 2 : props.resultHeight,
    ])
  }, [imgRef.current])

  function magnify(img: HTMLImageElement, glass: HTMLDivElement, zoom: number) {
    let w: number, h: number, bw: number

    if (!glass) return

    if (img) {
      glass.style.backgroundImage = "url('" + img.src + "')"
      glass.style.backgroundRepeat = 'no-repeat'
      glass.style.backgroundSize = img.width * zoom + 'px ' + img.height * zoom + 'px'
      bw = 3
      w = glass.offsetWidth / 2
      h = glass.offsetHeight / 2
      /*execute a function when someone moves the magnifier glass over the image:*/
      glass.addEventListener('mousemove', moveMagnifier)
      img.addEventListener('mousemove', moveMagnifier)
      /*and also for touch screens:*/
      glass.addEventListener('touchmove', moveMagnifier)
      img.addEventListener('touchmove', moveMagnifier)
      function moveMagnifier(event: globalThis.MouseEvent | globalThis.TouchEvent) {
        let pos, x, y
        event.preventDefault()
        pos = getCursorPos(event)
        x = pos.x
        y = pos.y
        if (x > img.width - w / zoom) {
          x = img.width - w / zoom
        }
        if (x < w / zoom) {
          x = w / zoom
        }
        if (y > img.height - h / zoom) {
          y = img.height - h / zoom
        }
        if (y < h / zoom) {
          y = h / zoom
        }

        glass.style.backgroundPosition =
          '-' + (x * zoom - w + bw) + 'px -' + (y * zoom - h + bw) + 'px'
      }
      function getCursorPos(event: globalThis.MouseEvent | globalThis.TouchEvent) {
        let a,
          x = 0,
          y = 0
        event = event || window.event
        a = img.getBoundingClientRect()
        x = (event as globalThis.MouseEvent).pageX - a.left
        y = (event as globalThis.MouseEvent).pageY - a.top
        x = x - window.pageXOffset
        y = y - window.pageYOffset
        setXY([x, y])
        return { x, y }
      }
    }
  }
  useEffect(() => {
    if (glassRef.current && imgRef.current) {
      magnify(imgRef.current, glassRef.current, scale)
    }
  }, [glassRef.current, imgRef.current])

  return (
    <>
      <Stack
        sx={{
          position: 'relative',
        }}
      >
        <Stack
          component="img"
          onMouseEnter={(event: any) => {
            const elem = event.currentTarget
            setAnchorEl(elem)
            setShowMagnifier(true)
          }}
          onMouseLeave={() => {
            setAnchorEl(null)
            setShowMagnifier(false)
          }}
          ref={imgRef}
          src={src}
          sx={{
            cursor: 'crosshair',
          }}
          width={width}
          height={height}
          alt={alt}
        />
      </Stack>
      <Box
        ref={lensRef}
        sx={{
          bgcolor: (theme) => theme.palette.primary.light,
          opacity: '0.5',
          height: Number(resultHeight / scale),
          width: Number(resultWidth / scale),
          borderRadius: 2,
          display: showMagnifier ? 'unset' : 'none',
          position: 'absolute',
          pointerEvents: 'none',
          right: `${x - Number(resultWidth / scale) / 2}px`,
          top: `${y - Number(resultHeight / scale) / 2}px`,
        }}
      ></Box>
      <Popper
        sx={{
          zIndex: 2,
        }}
        open={open}
        anchorEl={anchorEl}
        placement="left-start"
      >
        <Box
          ref={glassRef}
          sx={{
            pointerEvents: 'none',
            width: resultWidth,
            height: resultHeight,
            border: ({ palette }) => `1px solid ${palette.grey[300]}`,
            borderRadius: 2,
          }}
        ></Box>
      </Popper>
      <Box
        ref={glassRef}
        sx={{
          pointerEvents: 'none',
          display: 'none',
        }}
      ></Box>
    </>
  )
}

export default HBImageMagnifier
