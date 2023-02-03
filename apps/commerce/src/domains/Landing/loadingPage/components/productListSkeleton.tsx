import { Skeleton, Stack } from '@mui/material'
import ProductCardSkeleton from './productCardSkeleton'

function ProductListSkeleton() {
  return (
    <Stack
      width="100%"
      borderRadius={4}
      flexDirection="column"
      bgcolor={'common.white'}
      spacing={6}
      p={6}
    >
      <Stack display={'flex'} flexDirection="row" gap={7}>
        <Skeleton
          width={143}
          height={25}
          sx={{
            borderRadius: 2,
          }}
        />
        <Skeleton
          width={95}
          height={25}
          sx={{
            borderRadius: 2,
          }}
        />
      </Stack>

      <Stack
        display={'flex'}
        sx={{
          overflow: 'hidden',
        }}
        flexDirection="row"
        gap={5.5}
        width="100%"
      >
        {Array.from({ length: 5 }).map((_, index) => (
          <ProductCardSkeleton key={index} />
        ))}
      </Stack>
    </Stack>
  )
}

export default ProductListSkeleton
