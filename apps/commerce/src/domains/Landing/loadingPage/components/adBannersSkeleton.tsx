import { Skeleton, Stack } from '@mui/material'
import WhiteBox from './whiteBox'

function AdBannersSkeleton() {
  return (
    <Stack
      width={'100%'}
      borderRadius={4}
      bgcolor={'common.white'}
      p={4}
      display={'flex'}
      justifyContent={'space-between'}
      flexDirection={{
        xs: 'column',
        sm: 'row',
      }}
      height={232}
      overflow="hidden"
    >
      <Stack
        sx={{
          position: 'relative',
          width: 400,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Stack p={6} gap={3}>
          <WhiteBox width={125} height={28} />
          <WhiteBox width={261} height={22} />
          <WhiteBox width={93} height={20} />
          <WhiteBox width={102} height={32} />
        </Stack>
        <Skeleton
          variant="rectangular"
          width="100%"
          height="100%"
          sx={{
            position: 'absolute',
            zIndex: 0,
            borderRadius: 4,
          }}
        />
      </Stack>

      <Stack
        sx={{
          width: {
            xs: '100%',
            md: 588,
          },
          height: '100%',
          display: 'flex',
          borderRadius: 4,
          flexDirection: 'row',
          overflow: 'hidden',
        }}
        gap={1}
      >
        {Array.from({ length: 3 }).map((_, index) => (
          <Skeleton variant="rectangular" width={196} height={'100%'} key={index} />
        ))}
      </Stack>
    </Stack>
  )
}

export default AdBannersSkeleton
