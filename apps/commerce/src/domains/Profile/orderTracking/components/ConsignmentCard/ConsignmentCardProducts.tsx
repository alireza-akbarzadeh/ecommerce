import { HBLink, ImageShow } from '@hasty-bazar-commerce/components'
import { HBCarousel } from '@hasty-bazar/core'
import { Box, Typography } from '@mui/material'
import { FC } from 'react'
import { ConsignmentCardProduct } from './ConsignmentCard'

interface IConsignmentCardProductsProps {
  items: ConsignmentCardProduct[]
}

const ConsignmentCardProducts: FC<IConsignmentCardProductsProps> = (props) => {
  const { items } = props

  return (
    <Box>
      <HBCarousel
        freeMode={true}
        spaceBetween={16}
        slidesPerView="auto"
        style={{ width: '100%', overflow: 'hidden' }}
      >
        {items?.map((item, index) => (
          <Box
            key={`ConsignmentCardProducts-${index}`}
            sx={{
              borderRadius: 4,
              overflow: 'hidden',
              position: 'relative',
            }}
          >
            <HBLink target="_blank" href={`/product/${item.hsin}/${item.slug}`}>
              <ImageShow
                height={120}
                width={120}
                type="product"
                src={item.src ?? ''}
                layout="fill"
                objectFit="contain"
              />
            </HBLink>

            <Box
              sx={{
                bgcolor: 'grey.100',
                p: 2,
                position: 'absolute',
                left: 16,
                bottom: 16,
                borderRadius: 2,
              }}
            >
              <Typography variant="subtitle1" color="primary.main">
                {item.count}
              </Typography>
            </Box>
          </Box>
        ))}
      </HBCarousel>
    </Box>
  )
}
export default ConsignmentCardProducts
