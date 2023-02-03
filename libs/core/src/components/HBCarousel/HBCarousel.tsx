import { Stack, styled } from '@mui/material'
import { Children, ForwardedRef, forwardRef, PropsWithChildren } from 'react'
import { Autoplay, FreeMode, Grid, Navigation, Pagination } from 'swiper'
import 'swiper/css'
import 'swiper/css/grid'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import { Swiper, SwiperProps, SwiperSlide } from 'swiper/react'
import { PaginationOptions, SwiperOptions } from 'swiper/types'

const CarouselWrapper = styled(Stack)<{ swipperDirection?: 'vertical' | 'horizontal' }>(
  ({ theme, swipperDirection }) => ({
    position: 'relative',
    width: '100%',
    '& .swipper-custom-pagination': {
      width: 8,
      height: 8,
      backgroundColor: theme.palette.grey[300],
      opacity: 'unset',
    },
    '& .swiper-pagination-bullet-active': {
      width: 24,
      backgroundColor: theme.palette.background.paper,
      borderRadius: '16px',
    },
    '& div.swiper-grid-column .swiper-wrapper': {
      '& .swiper-slide': {
        height: 'unset',
      },
    },
    '& .swipper': {
      width: '100%',
      height: '100%',
      '& .swiper-button-next': {
        ...(swipperDirection === 'vertical'
          ? {
              height: 24,
              width: '100%',
              padding: theme.spacing(0, 2.5),
              backgroundColor: theme.palette.common.white,
              top: '100%',
              right: 0,
              left: 0,
            }
          : {
              width: 40,
              height: 40,
              backgroundColor: theme.palette.grey[100],
              borderRadius: '100%',
              padding: theme.spacing(2),
              right: 16,
            }),

        '&::after': {
          ...theme.typography.h5,
          fontFamily: 'unicons-line',
          color: theme.palette.grey[500],
          ...(swipperDirection === 'vertical'
            ? {
                content: "'\\eb3a'",
              }
            : {
                content: '"\\eb79"',
              }),
        },
        '&:hover': {
          opacity: 0.7,
        },
      },
      '& .swiper-button-prev': {
        ...(swipperDirection === 'vertical'
          ? {
              height: 24,
              width: '100%',
              padding: theme.spacing(0, 2.5),
              backgroundColor: theme.palette.common.white,
              top: 22,
              right: 0,
              left: 0,
            }
          : {
              width: 40,
              height: 40,
              backgroundColor: theme.palette.grey[100],
              borderRadius: '100%',
              padding: theme.spacing(2),
              left: 16,
            }),
        '&::after': {
          ...theme.typography.h5,
          fontFamily: 'unicons-line',
          color: theme.palette.grey[500],
          ...(swipperDirection === 'vertical'
            ? {
                content: '"\\eb56"',
              }
            : {
                content: "'\\eb6d'",
              }),
        },
        '&:hover': {
          opacity: 0.7,
        },
      },
      '& .swiper-button-disabled': {
        display: 'none',
      },
    },
  }),
)

export interface IHBCarouselProps extends SwiperOptions, SwiperProps {
  pagination?: PaginationOptions
  style?: React.CSSProperties
  delay?: number
}

const HBCarousel = forwardRef(
  <T extends HTMLElement>(props: PropsWithChildren<IHBCarouselProps>, ref: ForwardedRef<T>) => {
    const {
      children,
      freeMode,
      style,
      direction = 'horizontal',
      navigation = true,
      delay,
      ...rest
    } = props

    return (
      <CarouselWrapper
        swipperDirection={direction}
        ref={ref}
        direction="row"
        alignItems="center"
        style={style}
      >
        <Swiper
          modules={[Navigation, Pagination, FreeMode, Autoplay, Grid]}
          freeMode={freeMode}
          navigation={navigation}
          dir="rtl"
          direction={direction}
          className="swipper"
          autoplay={
            delay
              ? {
                  delay: delay * 1000,
                  pauseOnMouseEnter: true,
                }
              : undefined
          }
          {...rest}
        >
          {Children.map(children, (child, index) => (
            <SwiperSlide style={{ ...(freeMode && { width: 'auto' }) }} key={index}>
              {child}
            </SwiperSlide>
          ))}
        </Swiper>
      </CarouselWrapper>
    )
  },
)

export default HBCarousel
