import HBDataGridClient from '@hasty-bazar/admin-shared/containers/HBDataGrid/HBDataGridClient'
import { Box } from '@mui/material'
import { ICellRendererParams } from 'ag-grid-community'
import { FC } from 'react'
import usePlatformDetailsGrid from '../../hooks/usePlatformDetailsGrid'

type PlatformDetailsGridProps = Partial<ICellRendererParams>

const PlatformDetailsGrid: FC<PlatformDetailsGridProps> = (props) => {
  const { columnDefs, isRowSelectable, gridRef, classes } = usePlatformDetailsGrid()
  const { id } = props?.data

  return (
    <Box mt={9} sx={{ height: 362 }}>
      <HBDataGridClient
        actionUrl={`${process.env.NEXT_PUBLIC_GATEWAY}/Admin/sale/api/PlatformShippingContract/${id}/Exceptions`}
        columnDefs={columnDefs}
        isRowSelectable={isRowSelectable}
        suppressLoadingOverlay={!id}
        ref={gridRef}
        enableRtl
        {...{ classes }}
        noToolbar
      />
    </Box>
  )
}

export default PlatformDetailsGrid
