import { HBMap } from '@hasty-bazar/admin-shared/containers/HBMap'
import phrasesMessages from '@hasty-bazar-admin/core/translations/phrases.messages'
import userPageMessages from '@hasty-bazar-admin/domains/Users/UserPage.messages'
import { HBButton, HBDialog } from '@hasty-bazar/core'
import { Box } from '@mui/material'
import React from 'react'
import { useFormContext } from 'react-hook-form'
import { useIntl } from 'react-intl'

export type UserAddressModalMapType = {
  openAddressMapDialog: boolean
  setOpenAddressMapDialog: React.Dispatch<React.SetStateAction<boolean>>
  getModelMapCenter: () => [number, number] | undefined
  handleChangeLocation: (location: [number, number]) => void
  handleChangeLocationMap: () => void
}

export default function ModalAddressMap({
  openAddressMapDialog,
  setOpenAddressMapDialog,
  getModelMapCenter,
  handleChangeLocation,
  handleChangeLocationMap,
}: UserAddressModalMapType) {
  const { formatMessage } = useIntl()
  const { setValue } = useFormContext()

  return (
    <HBDialog
      title={formatMessage(userPageMessages.newAddress)}
      open={openAddressMapDialog}
      onClose={() => setOpenAddressMapDialog(false)}
      onReject={() => setOpenAddressMapDialog(false)}
    >
      <Box width={800} height={560}>
        <HBMap
          sx={{ height: 500 }}
          center={getModelMapCenter()}
          onChangeLocation={(e) => {
            setValue('country', '')
            setValue('provinceId', '')
            setValue('cityId', '')
            handleChangeLocation(e)
          }}
          isShowSearch
          isShowMarker
        />

        <Box display="flex" justifyContent="space-between">
          <HBButton
            variant="outlined"
            sx={{ mt: 4 }}
            onClick={() => setOpenAddressMapDialog(false)}
          >
            {formatMessage(phrasesMessages.cancel)}
          </HBButton>
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
