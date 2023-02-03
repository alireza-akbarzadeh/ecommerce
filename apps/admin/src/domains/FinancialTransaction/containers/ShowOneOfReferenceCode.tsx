import { HBLink } from '@hasty-bazar/admin-shared/components'
import { MainRefrenceEntity, RefrenceEntity } from '@hasty-bazar/admin-shared/core/enums'
import { HBDialog } from '@hasty-bazar/core'
import { Box } from '@mui/material'
import { ICellRendererParams } from 'ag-grid-community'
import { useState } from 'react'
import DialogContent from './DialogContent'

const ShowOneOfReferenceCode = (params: ICellRendererParams) => {
  const [showDialog, setShowDialog] = useState<boolean>(false)
  const isRedirect = (mainRefrenceEntity: string, referenceEntity: string) => {
    return (
      mainRefrenceEntity !== MainRefrenceEntity.Order &&
      referenceEntity !== RefrenceEntity.OrderVoucher
    )
  }

  const setHref = (referenceEntity: string, referenceId: string) => {
    let href = ''
    if (!showDialog && referenceEntity === RefrenceEntity.OrderDetail) {
      href = `/ordersManagement/orderDetails/${referenceId}`
    } else if (!showDialog && referenceEntity === RefrenceEntity.OrderVoucher) {
      href = `/voucherManagement/edit/${referenceId}`
    }
    return href
  }

  return (
    <>
      <Box display="flex" alignItems="center" height={'100%'}>
        {!isRedirect(params?.data?.mainReferenceEntity!, params?.data?.referenceEntity!) && (
          <HBLink onClick={() => setShowDialog(true)}>{params?.data?.referenceId}</HBLink>
        )}
        {isRedirect(params?.data?.mainReferenceEntity!, params?.data?.referenceEntity!) && (
          <HBLink href={setHref(params?.data?.referenceEntity!, params?.data?.referenceId!)}>
            {params?.data?.referenceId}
          </HBLink>
        )}
      </Box>
      <HBDialog
        title={params?.data?.referenceTitle}
        onReject={() => setShowDialog(false)}
        open={showDialog}
        onClose={() => setShowDialog(false)}
        PaperProps={{ sx: { width: 1600 } }}
      >
        <Box>
          <DialogContent
            referenceId={params?.data?.referenceId!}
            referenceEntity={params?.data?.referenceEntity!}
            mainReferenceId={params?.data?.mainReferenceId!}
            mainReferenceEntity={params?.data?.mainReferenceEntity!}
          />
        </Box>
      </HBDialog>
    </>
  )
}

export default ShowOneOfReferenceCode
