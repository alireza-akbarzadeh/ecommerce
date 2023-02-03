import { Skeleton, Stack } from '@mui/material'

function CategoriesSkeleton() {
  return (
    <Stack
      width="100%"
      borderRadius={4}
      flexDirection="column"
      bgcolor={'common.white'}
      spacing={6}
      sx={{
        overflow: 'hidden',
      }}
      p={6}
    >
      <Stack display={'flex'} flexDirection="row" gap={7}>
        <Skeleton
          width={77}
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
        divider={
          <Stack
            width={0}
            sx={{
              borderLeftColor: 'grey.100',
            }}
            bgcolor={'transparent'}
            borderLeft={2}
          />
        }
        flexDirection="row"
        width="100%"
        gap={6}
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
            <Skeleton width={142} height={142} variant="rectangular" />
          </Stack>
        ))}
      </Stack>
    </Stack>
  )
}

export default CategoriesSkeleton
