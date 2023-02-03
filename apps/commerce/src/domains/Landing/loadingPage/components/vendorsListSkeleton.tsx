import { Skeleton, Stack } from '@mui/material'

function VendorsListSkeleton() {
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
      </Stack>

      <Stack
        display={'flex'}
        sx={{
          overflow: 'auto',
        }}
        flexDirection="row"
        gap={5.5}
        width="100%"
      >
        {Array.from({ length: 3 }).map((_, index) => (
          <Stack spacing={8} key={index}>
            <Stack
              sx={{
                display: 'flex',
                flexDirection: 'row',
                borderRadius: 4,
                width: 344,
                minWidth: 344,
                overflow: 'hidden',
                flexWrap: 'wrap',
              }}
              gap={1}
            >
              {Array.from({ length: 4 }).map((_, index) => (
                <Skeleton variant="rectangular" key={index} width={170} height={170} />
              ))}
            </Stack>

            <Stack display={'flex'} flexDirection="row" justifyContent={'space-between'}>
              <Stack display={'flex'} flexDirection="row" gap={2}>
                <Skeleton variant="circular" width={48} height={48} />
                <Skeleton
                  variant="rectangular"
                  sx={{
                    borderRadius: 2,
                  }}
                  width={108}
                  height={50}
                />
              </Stack>

              <Skeleton
                width={66}
                height={24}
                sx={{
                  borderRadius: 2,
                }}
              />
            </Stack>
          </Stack>
        ))}
      </Stack>
    </Stack>
  )
}

export default VendorsListSkeleton
