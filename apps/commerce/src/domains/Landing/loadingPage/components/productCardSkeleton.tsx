import { Skeleton, Stack } from '@mui/material'

function ProductCardSkeleton() {
  return (
    <Stack display={'flex'} flexDirection="column" width={194} spacing={2}>
      <Skeleton
        sx={{
          borderRadius: 4,
        }}
        width={194}
        variant="rectangular"
        height={194}
      />

      <Skeleton
        sx={{
          borderRadius: 4,
        }}
        variant="rectangular"
        width={117}
        height={20}
      />
      <Stack display={'flex'} flexDirection="row" justifyContent={'space-between'}>
        <Skeleton
          sx={{
            borderRadius: 2,
          }}
          variant="rectangular"
          width={35}
          height={27}
        />
        <Skeleton
          sx={{
            borderRadius: 2,
          }}
          variant="rectangular"
          width={94}
          height={21}
        />
      </Stack>
      <Stack display="flex" width="100%" flexDirection={'row'} justifyContent="flex-end">
        <Skeleton
          sx={{
            borderRadius: 2,
          }}
          variant="rectangular"
          width={60}
          height={20}
        />
      </Stack>
      <Stack display={'flex'} flexDirection="row" justifyContent={'space-between'}>
        <Skeleton
          sx={{
            borderRadius: 2,
          }}
          variant="rectangular"
          width={104}
          height={32}
        />
        <Skeleton
          sx={{
            borderRadius: 2,
          }}
          variant="rectangular"
          width={80}
          height={22}
        />
      </Stack>
    </Stack>
  )
}
export default ProductCardSkeleton
