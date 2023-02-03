import { Skeleton, Stack } from '@mui/material'
import WhiteBox from './whiteBox'

function BannersListSKeleton() {
  return (
    <Stack
      width="100%"
      borderRadius={4}
      flexDirection={{
        xs: 'column',
        sm: 'row',
      }}
      sx={{
        overflow: 'hidden',
      }}
      gap={6}
    >
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
      >
        <Stack
          sx={{
            position: 'relative',
            width: 179,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Stack p={6} gap={3}>
            <WhiteBox width={130} height={28} />
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

        {Array.from({ length: 2 }).map((_, index) => (
          <Skeleton
            variant="rectangular"
            width={123}
            sx={{
              borderRadius: 4,
            }}
            height={'100%'}
            key={index}
          />
        ))}
      </Stack>
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
      >
        <Stack
          sx={{
            position: 'relative',
            width: 179,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Stack p={6} gap={3}>
            <Stack
              sx={{
                position: 'relative',
                zIndex: 1,
              }}
              width={130}
              height={28}
              bgcolor="common.white"
              borderRadius={4}
            />

            <Stack
              sx={{
                position: 'relative',
                zIndex: 1,
              }}
              width={93}
              height={20}
              bgcolor="common.white"
              borderRadius={4}
            />
            <Stack
              sx={{
                position: 'relative',
                zIndex: 1,
              }}
              width={102}
              height={32}
              bgcolor="common.white"
              borderRadius={4}
            />
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

        {Array.from({ length: 2 }).map((_, index) => (
          <Skeleton
            variant="rectangular"
            width={123}
            sx={{
              borderRadius: 4,
            }}
            height={'100%'}
            key={index}
          />
        ))}
      </Stack>
    </Stack>
  )
}

export default BannersListSKeleton
