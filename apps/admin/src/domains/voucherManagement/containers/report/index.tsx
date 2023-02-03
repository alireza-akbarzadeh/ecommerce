import { HBIcon } from '@hasty-bazar/core'
import { Box } from '@mui/system'
import { ICellRendererParams } from 'ag-grid-community'
import { FC, useState } from 'react'
import { ReportUsageCodeModal } from '../../components'

const Report: FC<ICellRendererParams> = ({ data }) => {
  const [openDialog, setOpenDialog] = useState<boolean>(false)
  const handleOpenDialog = () => {
    setOpenDialog(true)
  }

  return (
    <>
      <Box onClick={() => handleOpenDialog()}>
        <HBIcon type="graphBar" sx={{ color: 'info.main', cursor: 'pointer' }} />
      </Box>
      {openDialog && (
        <ReportUsageCodeModal
          id={String(data?.id)}
          openDialog={openDialog}
          setOpenDialog={setOpenDialog}
        />
      )}
    </>
  )
}

export default Report
