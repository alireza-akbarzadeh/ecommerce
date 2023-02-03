import { useState } from 'react'
import { ICellRendererParams } from 'ag-grid-community'
import { Box } from '@mui/material'
import { HBIconButton } from '@hasty-bazar/core'
import VendorInfo from '../VendorInfo'

const ViewItem = (props: ICellRendererParams) => {
  const [openDialog, setOpenDialog] = useState<boolean>(false)

  const handleOpenVendor = () => {
    setOpenDialog(true)
  }

  return props.value ? (
    <>
      <Box color={'info.main'} sx={{ display: 'inline-flex', alignItems: 'center' }}>
        {props?.value}
        <HBIconButton
          icon="eye"
          variant="text"
          sx={{ color: 'info.main' }}
          onClick={handleOpenVendor}
        />
      </Box>
      {openDialog ? (
        <VendorInfo
          {...{
            openDialog,
            setOpenDialog,
            id: props?.data?.id,
            vendorIds: props?.data?.vendorIds,
          }}
        />
      ) : null}
    </>
  ) : (
    props?.value
  )
}

export default ViewItem
