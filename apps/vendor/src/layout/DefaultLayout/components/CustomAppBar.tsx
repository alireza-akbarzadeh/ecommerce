import { HBButton, HBIcon } from '@hasty-bazar/core'
import { AppBar, AppBarProps, styled, Typography } from '@mui/material'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import Toolbar from '@mui/material/Toolbar'
import { format } from 'date-fns-jalali'
import phrasesMessages from 'libs/core/src/translations/phrases.messages'
import * as React from 'react'
import { useIntl } from 'react-intl'
import ProfileMenu from './ProfileMenu'

export const CustomAppBar = styled(AppBar)<AppBarProps>(({ theme }) => ({
  height: 60,
  boxShadow: 'none',
  margin: 0,
  position: 'fixed',
  backgroundColor: theme.palette.common.white,
}))

interface topBarProps {
  handleClick: (event: React.MouseEvent<HTMLElement>) => void
}

const TopBar = (props: topBarProps) => {
  const { formatMessage } = useIntl()
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    props.handleClick(event)
  }

  return (
    <Box
      sx={{ flexGrow: 1, position: 'fixed', width: '100%', zIndex: (theme) => theme.zIndex.appBar }}
    >
      <CustomAppBar position="static">
        <Toolbar>
          <Box>
            <HBButton
              variant="text"
              sx={{ display: { xs: 'block', sm: 'none' } }}
              onClick={handleClick}
            >
              <HBIcon type="bars" size="medium" />
            </HBButton>
          </Box>
          <Box>
            <Box
              component="img"
              sx={{ objectFit: 'contain' }}
              src="/assets/logo.png"
              height={35}
              width={55}
              alt={formatMessage(phrasesMessages.hastiBazar)}
            />
          </Box>

          <Box sx={{ flexGrow: 1.5 }} />

          <Box sx={{ display: { xs: 'none', sm: 'none', md: 'block' } }}>
            <Typography variant="body2" color={'grey.500'}>
              {format(new Date(), 'd MMMM yyyy')}
            </Typography>
          </Box>

          <Box sx={{ flexGrow: 1 }} />

          <IconButton
            size="small"
            sx={{ color: 'palette.common.black', mr: { xs: 1, sm: 7, md: 7 } }}
          >
            <HBIcon type="lifeRing" size="small" />
          </IconButton>
          <IconButton
            size="small"
            sx={{ color: 'palette.common.black', mr: { xs: 1, sm: 7, md: 7 } }}
          >
            <HBIcon type="bell" size="small" />
          </IconButton>

          <ProfileMenu userName="" profileImg={''} />
        </Toolbar>
      </CustomAppBar>
    </Box>
  )
}

export default TopBar
