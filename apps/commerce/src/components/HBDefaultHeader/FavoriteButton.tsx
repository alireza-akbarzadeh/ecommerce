import FavoriteModal from '@hasty-bazar-commerce/containers/FavoriteModal'
import SignInModal from '@hasty-bazar-commerce/domains/Auth/AuthPage/containers/SignInModal'
import { HBIcon } from '@hasty-bazar/core'
import { Box, Stack } from '@mui/material'
import { useSession } from 'next-auth/react'
import { FC, useRef, useState } from 'react'
import { FormattedMessage } from 'react-intl'
import HBLink from '../HBLink'
import DefaultHeaderMessges from './DefaultHeader.messages'

const FavoriteButton: FC = () => {
  const [openFavoriteModal, setOpenFavoriteModal] = useState<boolean>(false)
  const [openLoginModal, setOpenLoginModal] = useState<boolean>(false)
  const buttonRef = useRef<HTMLAnchorElement>(null)
  const { data } = useSession()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  const handleFavoriteModal = () => {
    if (data?.accessToken) setOpenFavoriteModal(true)
    else {
      setOpenLoginModal(true)
    }
  }

  return (
    <>
      <Box ref={buttonRef}>
        <HBLink
          onClick={(E) => {
            handleFavoriteModal()
            setAnchorEl(E.currentTarget)
          }}
          variant="subtitle2"
          underline="none"
          color="text.primary"
          sx={{ height: 56, display: 'flex', alignItems: 'center' }}
        >
          <Stack alignItems="center" columnGap={2} direction="row">
            <FormattedMessage {...DefaultHeaderMessges.favorite} />
            {!openFavoriteModal && <HBIcon type="angleDown" sx={{ color: 'grey.500' }} />}
            {openFavoriteModal && <HBIcon type="angleUp" sx={{ color: 'grey.500' }} />}
          </Stack>
        </HBLink>
      </Box>

      {openFavoriteModal && (
        <FavoriteModal
          top={
            (document.getElementById('ads-header')?.clientHeight ?? 0) +
            (document.getElementById('header')?.clientHeight ?? 0)
          }
          onClose={() => {
            setOpenFavoriteModal(false)
            setAnchorEl(null)
          }}
          open={openFavoriteModal}
          anchorEl={anchorEl}
        />
      )}
      <SignInModal
        open={openLoginModal}
        onClose={() => setOpenLoginModal(false)}
        onSuccess={() => setOpenFavoriteModal(true)}
      />
    </>
  )
}

export default FavoriteButton
