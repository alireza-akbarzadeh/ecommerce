import { ApiConstants } from '@hasty-bazar-commerce/core/constants'
import useGetSavedVendors from '@hasty-bazar-commerce/core/hook/useGetSavedVendors'
import SignInModal from '@hasty-bazar-commerce/domains/Auth/AuthPage/containers/SignInModal'
import {
  useDeleteWebCatalogCommerceSavedVendorVendorsMutation,
  usePostWebCatalogCommerceSavedVendorMutation,
} from '@hasty-bazar-commerce/services/catalogApi.generated'
import { HBButton, HBIcon } from '@hasty-bazar/core'
import { buttonBaseClasses, Typography } from '@mui/material'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import { FC, useEffect, useState } from 'react'
import { FormattedMessage } from 'react-intl'
import ContainersMessages from './Containers.message'

interface SaveVendorButtonProps {
  vendorId: string
}

const SaveVendorButton: FC<SaveVendorButtonProps> = ({ vendorId }) => {
  const [addToSaveds, { isLoading: addingLoading }] = usePostWebCatalogCommerceSavedVendorMutation()
  const [removeFromSaved, { isLoading: removingLoading }] =
    useDeleteWebCatalogCommerceSavedVendorVendorsMutation()
  const { data, status } = useSession()
  const [savedId, setSavedId] = useState<string | null>(null)
  const [openLoginModal, setOpenLoginModal] = useState<boolean>(false)

  const { loading, savedVendors } = useGetSavedVendors()

  const handleChangeSaved = () => {
    if (status === 'unauthenticated') {
      setOpenLoginModal(true)
      return
    }
    if (savedId) {
      removeFromSaved({
        ...ApiConstants,
        body: [savedId],
      })
    } else {
      addToSaveds({
        ...ApiConstants,
        createSavedVendorModel: { partyId: data?.user.partyId!, vendorId },
      })
    }
  }

  useEffect(() => {
    const saved = savedVendors?.find((i) => i.vendorId === vendorId)
    if (saved) {
      setSavedId(saved.id!)
    } else {
      setSavedId('')
    }
  }, [savedVendors, vendorId])
  return (
    <>
      <HBButton
        loading={loading || addingLoading || removingLoading}
        onClick={(e) => {
          e.preventDefault()
          handleChangeSaved()
        }}
        variant="text"
        sx={{
          minWidth: 0,
          p: 0,
          border: 'none!important',
          gap: 2,
          color: (theme) => `${theme.palette.info.main}!important`,
          [`&.${buttonBaseClasses.root}:hover`]: {
            backgroundColor: '#ffffff !important',
          },
        }}
      >
        {savedId ? (
          <>
            <Image width={14} height={20} src="/assets/svg/blueFilledBookmark.svg" />
            <Typography variant="button">
              <FormattedMessage {...ContainersMessages.saved} />
            </Typography>
          </>
        ) : (
          <>
            <HBIcon type="bookmark" />
            <Typography variant="button">
              <FormattedMessage {...ContainersMessages.addToSaveVendor} />
            </Typography>
          </>
        )}
      </HBButton>
      <SignInModal
        open={openLoginModal}
        onClose={() => setOpenLoginModal(false)}
        onSuccess={() => handleChangeSaved()}
      />
    </>
  )
}

export default SaveVendorButton
