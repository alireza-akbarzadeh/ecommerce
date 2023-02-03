import { Box, Typography } from '@mui/material'
import { FC, ReactNode, useCallback, useEffect, useRef, useState } from 'react'
import ShowMore from '../../../components/ShowMore'

export interface IProductInfo {
  label: ReactNode
  content: string | string[]
}

const ProductInfo: FC<IProductInfo> = ({ content, label }) => {
  const DefaultHeight = 230
  const [expandText, setExpandText] = useState(false)
  const [hasMore, setHasMore] = useState(false)
  const bodyRef = useRef<HTMLDivElement>(null)

  const handleShowMore = () => {
    setExpandText(!expandText)
  }

  const createMarkup = useCallback(() => {
    return { __html: typeof content === 'string' ? content : content[0] }
  }, [content])

  useEffect(() => {
    if (bodyRef.current) {
      const contentEl = bodyRef.current.offsetHeight
      if (contentEl > DefaultHeight) setHasMore(true)
    }
  }, [bodyRef.current])

  return (
    <>
      <Typography variant="subtitle1">{label}</Typography>
      <Typography
        variant="body2"
        sx={{ position: 'relative', textAlign: 'justify', lineHeight: ({ spacing }) => spacing(6) }}
      >
        <Box
          ref={bodyRef}
          sx={{
            height: hasMore && !expandText ? DefaultHeight : 'auto',
            overflow: expandText ? 'unset' : 'hidden',
            '& > *': {
              fontFamily: (theme) => `${theme.typography.fontFamily} !important`,
              textAlign: 'justify !important',
            },
            '& h1,h2,h3,h4,h5': {
              lineHeight: ({ spacing }) => `${spacing(8)} !important`,
            },
            '& img': {
              maxWidth: '100%',
            },
            lineHeight: `2.3 !important`,
          }}
        >
          <Box dangerouslySetInnerHTML={createMarkup()} />
          {Array.isArray(content) &&
            content.length > 1 &&
            content.slice(1).map((item, index) => (
              <Box
                key={index}
                dangerouslySetInnerHTML={{
                  __html: item,
                }}
              />
            ))}
          {hasMore && !expandText && (
            <Box
              sx={{
                height: 60,
                width: '100%',
                background: 'linear-gradient(180deg, rgba(255,255,255,0), rgba(255,255,255,1))',
                mt: -3,
                position: 'absolute',
                bottom: 0,
              }}
            />
          )}
        </Box>
      </Typography>
      {hasMore && <ShowMore expandState={expandText} onClickHandler={handleShowMore} />}
    </>
  )
}

export default ProductInfo
