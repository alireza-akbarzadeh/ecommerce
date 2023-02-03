import { Skeleton, Stack } from '@mui/material'

function VendorsSkeleton() {
  return (
    <Stack
      display={'flex'}
      sx={{
        overflow: 'hidden',
        bgcolor: 'common.white',
        p: 4,
        borderRadius: 4,
      }}
      flexDirection="row"
      gap={12}
      width="100%"
    >
      {Array.from({ length: 6 }).map((_, index) => (
        <Stack
          key={index}
          display={'flex'}
          spacing={5}
          justifyContent="center"
          alignItems={'center'}
          flexDirection="column"
        >
          <Skeleton width={142} height={142} variant="circular" />
          <Skeleton
            sx={{
              borderRadius: 2,
            }}
            variant="rectangular"
            width={110}
            height={22}
          />
        </Stack>
      ))}
    </Stack>
  )
}

export default VendorsSkeleton
