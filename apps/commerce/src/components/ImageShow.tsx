import { Box, Stack } from '@mui/material'
import Image, { ImageProps } from 'next/image'
import { FC, useEffect, useState } from 'react'

type imageType = 'product' | 'vendor' | 'littleVendor'

interface IImageShowProps extends Omit<ImageProps, 'onError'> {
  type: imageType
  width: number
  height: number
}

const ImageShow: FC<IImageShowProps> = (props) => {
  const { type, src, width, height, alt, ...rest } = props
  const [imageSrc, setImageSrc] = useState<string>('/assets/svg/image-error.svg')

  useEffect(() => {
    setImageSrc(`${process.env.NEXT_PUBLIC_CDN}${src}`)
  }, [src])

  const onError = () => {
    switch (type) {
      case 'product':
        setImageSrc('/assets/svg/image-error.svg')
        break
      case 'littleVendor':
        setImageSrc('/assets/svg/little-store.svg')
        break
      case 'vendor':
        setImageSrc('')
        break
      default:
        setImageSrc('/assets/svg/image-error.svg')
    }
  }

  return (
    <Stack
      justifyContent="center"
      alignItems="center"
      sx={{ bgcolor: 'grey.100', width: width + 16, height: height + 16, borderRadius: 4 }}
    >
      <Box sx={{ width, height, position: 'relative', borderRadius: 4, overflow: 'hidden' }}>
        <Image src={imageSrc} {...{ width, height, alt, onError }} {...rest} />
      </Box>
    </Stack>
  )
}

export default ImageShow
