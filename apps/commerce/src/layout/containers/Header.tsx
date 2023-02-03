import { HBDefaultHeader, MainLayoutToolbar } from '@hasty-bazar-commerce/components'
import HBMegaMenu from '@hasty-bazar-commerce/components/HBMegaMenu'
import { ApiConstants } from '@hasty-bazar-commerce/core/constants'
import useClientSession, { localStorageKey } from '@hasty-bazar-commerce/core/hook/useClientSession'
import { usePostWebIdrClientSessionsMutation } from '@hasty-bazar-commerce/services/idrApi.generated'
import { BasketSubjectFuncs } from '@hasty-bazar-commerce/subjects/BasketSubjects'
import { Box, Hidden, Stack } from '@mui/material'
import { useEffect, useRef } from 'react'

const Header = () => {
  const refHeader = useRef<HTMLDivElement>()
  const refParentHeader = useRef<HTMLDivElement>()
  const clientSessionId = useClientSession()
  const [postMutation] = usePostWebIdrClientSessionsMutation()

  const handleGetClientSession = () => {
    postMutation({
      ...ApiConstants,
      createClientSessionModel: {},
    })
      .unwrap()
      .then((res) => {
        if (res.data?.clientSessionId) {
          localStorage.setItem(localStorageKey, res.data?.clientSessionId)
          BasketSubjectFuncs.receivedClientSession()
        }
      })
  }

  useEffect(() => {
    if (clientSessionId === '') {
      handleGetClientSession()
    }
  }, [clientSessionId])

  return (
    <Box ref={refParentHeader} sx={{ position: 'relative' }} mb={{ md: 6 }}>
      <Stack
        id="mainHeader"
        sx={{
          position: 'fixed',
          top: 0,
          right: 0,
          width: '100%',
          zIndex: 1000,
        }}
        ref={refHeader}
      >
        <Hidden mdDown>
          <HBDefaultHeader />
        </Hidden>
        <MainLayoutToolbar sections={[]} />
        <Hidden mdDown>
          <HBMegaMenu />
        </Hidden>
      </Stack>
    </Box>
  )
}
export default Header
