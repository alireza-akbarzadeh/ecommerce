import { Box, Typography } from '@mui/material'
import { ICellRendererParams } from 'ag-grid-community'

export default function Description({ value }: ICellRendererParams) {
  return (
    <Box
      sx={{
        textOverflow: 'ellipsis',
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        display: 'flex',
        alignItems: 'center',
        height: '100%',
      }}
    >
      <Typography component="pre">
        {value
          .replace(/(<([^>]+)>)/gi, '')
          .replace(/(&lt;([^&gt;]+)&gt;)/gi, '')
          .replace(/&nbsp;/gi, ' ')}
      </Typography>
    </Box>
  )
}
