import { HBMap } from '@hasty-bazar/admin-shared/containers/HBMap'
import { HBButton, HBDialog } from '@hasty-bazar/core'
import { Box } from '@mui/material'
import React from 'react'
import { useIntl } from 'react-intl'
import userPageMessages from '../../UserPage.messages'

export type UserAddressModalMapType = {
  openMapDialog: boolean
  setOpenMapDialog: React.Dispatch<React.SetStateAction<boolean>>
  getModelMapCenter: () => [number, number] | undefined
  handleChangeLocation: (location: [number, number]) => void
  handleChangeLocationMap: () => void
  isAddOrEdit?: boolean
}

export default function UserAddressModalMap({
  openMapDialog,
  setOpenMapDialog,
  getModelMapCenter,
  handleChangeLocation,
  handleChangeLocationMap,
  isAddOrEdit,
}: UserAddressModalMapType) {
  const { formatMessage } = useIntl()

  return (
    <HBDialog
      title={formatMessage(userPageMessages.newAddress)}
      open={openMapDialog}
      onClose={() => setOpenMapDialog(false)}
      onReject={() => setOpenMapDialog(false)}
    >
      <Box width={800} height={560}>
        <HBMap
          sx={{ height: 500 }}
          center={getModelMapCenter()}
          onChangeLocation={handleChangeLocation}
          disabled={!isAddOrEdit}
          isShowSearch
          isShowMarker
        />
        <Box display="flex" justifyContent="flex-end">
          <HBButton
            variant="contained"
            color="primary"
            sx={{ mt: 4 }}
            onClick={handleChangeLocationMap}
          >
            {formatMessage(userPageMessages.saveContinue)}
          </HBButton>
        </Box>
      </Box>
    </HBDialog>
  )
}
