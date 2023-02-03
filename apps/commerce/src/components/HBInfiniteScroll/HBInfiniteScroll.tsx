import { useIntersectionObserver } from '@asyarb/use-intersection-observer'
import { HBLoading } from '@hasty-bazar/core'
import { Stack } from '@mui/material'
import { Children, FC, PropsWithChildren, useEffect, useRef, useState } from 'react'

interface IHBInfiniteScroll {
  refetchCallback: (pageNumber: number) => void
  allCount: number
  customLoading?: any
  scrollUntilPage?: number
  pageNum?: number
}

const HBInfiniteScroll: FC<PropsWithChildren<IHBInfiniteScroll>> = ({
  children,
  refetchCallback,
  allCount,
  customLoading,
  scrollUntilPage,
  pageNum,
}) => {
  const [showLoading, setShowLoading] = useState<boolean>(true)
  const loadingRef = useRef<HTMLDivElement>(null)
  const pageNumber = useRef<number>(1)
  const childrenCount = useRef<number>(0)
  const inView = useIntersectionObserver({
    ref: loadingRef,
    options: {
      threshold: 0,
      triggerOnce: false,
    },
  })

  useEffect(() => {
    if (Children.count(children) === 0) {
      setShowLoading(false)
      pageNumber.current = 1
    }
    if (Children.count(children) === allCount || allCount === 0) {
      setShowLoading(false)
    } else {
      setShowLoading(true)
    }
    if (scrollUntilPage && pageNum && (scrollUntilPage <= pageNum || pageNum === 1)) {
      setShowLoading(false)
    }
  }, [children])

  useEffect(() => {
    if (
      !scrollUntilPage &&
      !pageNum &&
      inView &&
      Children.count(children) !== childrenCount.current
    ) {
      childrenCount.current = Children.count(children)
      pageNumber.current += 1
      refetchCallback(pageNumber.current)
    }
  }, [inView])

  useEffect(() => {
    if (pageNum && scrollUntilPage) childrenCount.current = Children.count(children)
    if (
      pageNum &&
      scrollUntilPage &&
      pageNum < scrollUntilPage &&
      inView &&
      allCount > childrenCount.current
    ) {
      pageNumber.current = pageNum + 1
      refetchCallback(pageNumber.current)
    }
  }, [inView])

  return (
    <>
      {children}
      <Stack
        alignItems="center"
        justifyContent="center"
        ref={loadingRef}
        sx={{
          width: scrollUntilPage ? '100%' : 'unset',
          marginBottom: (theme) => `${theme.spacing(4)}px!important`,
        }}
      >
        {customLoading && showLoading ? (
          customLoading
        ) : (
          <HBLoading
            sx={{
              ...(!showLoading && { display: 'none' }),
            }}
          />
        )}
      </Stack>
    </>
  )
}

export default HBInfiniteScroll
