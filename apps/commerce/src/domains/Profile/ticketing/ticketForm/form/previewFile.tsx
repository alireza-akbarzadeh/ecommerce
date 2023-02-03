import { HBIconButton } from '@hasty-bazar/core'
import { Stack, Typography } from '@mui/material'

interface TicketTypeItemProps {
  File: File
  onRemove: () => void
}
function PreviewFile({ File, onRemove }: TicketTypeItemProps) {
  return (
    <Stack
      sx={{
        position: 'relative',
      }}
      key={File.name}
      display="flex"
      flexDirection="column"
      height={150}
      gap={2}
    >
      <Stack width={120} height={120} position="relative">
        <HBIconButton
          icon="trash"
          sx={{
            position: 'absolute',
            top: 0,
            right: 4,
            zIndex: 4,
          }}
          onClick={() => onRemove()}
        />
        <Stack
          component="img"
          src={URL.createObjectURL(File)}
          sx={{
            borderRadius: 2,
            position: 'absolute',
            zIndex: 0,
            height: '100%',
            width: '100%',
            overflow: 'hidden',
          }}
          alt={File.name}
        ></Stack>
        <Stack
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'common.white',
            opacity: 0.3,
            zIndex: 1,
          }}
        />
      </Stack>
      <Typography variant="caption" color="text.secondary">
        {File.name}
      </Typography>
    </Stack>
  )
}

export default PreviewFile
