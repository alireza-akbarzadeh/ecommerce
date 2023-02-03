import { Box, Skeleton } from '@mui/material'
import { ILoadingCellRendererParams } from 'ag-grid-community'
import React from 'react'
import { gridClasses } from './HBAgGrid.styles'

export default (props: ILoadingCellRendererParams & { loadingMessage: string }) => {
  return (
    <Box sx={{ ...gridClasses.gridCustomLoading }}>
      <Box m={0.5} sx={{ lineHeight: 25 }}>
        <Skeleton animation="wave" variant="rectangular" width={100} />
      </Box>
      <Box m={0.5} sx={{ lineHeight: 25 }}>
        <Skeleton variant="rectangular" width={100} />
      </Box>
      <Box m={0.5} sx={{ lineHeight: 25 }}>
        <Skeleton animation="wave" variant="rectangular" width={100} />
      </Box>
      <Box m={0.5} sx={{ lineHeight: 25 }}>
        <Skeleton variant="rectangular" width={100} />
      </Box>
      <Box m={0.5} sx={{ lineHeight: 25 }}>
        <Skeleton animation="wave" variant="rectangular" width={100} />
      </Box>
      <Box m={0.5} sx={{ lineHeight: 25 }}>
        <Skeleton variant="rectangular" width={100} />
      </Box>
      <Box m={0.5} sx={{ lineHeight: 25 }}>
        <Skeleton animation="wave" variant="rectangular" width={100} />
      </Box>
      <Box m={0.5} sx={{ lineHeight: 25 }}>
        <Skeleton variant="rectangular" width={100} />
      </Box>
      <Box m={0.5} sx={{ lineHeight: 25 }}>
        <Skeleton animation="wave" variant="rectangular" width={100} />
      </Box>
      <Box m={0.5} sx={{ lineHeight: 25 }}>
        <Skeleton variant="rectangular" width={100} />
      </Box>
    </Box>
  )
}
