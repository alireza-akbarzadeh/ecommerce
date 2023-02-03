import { HBIcon } from '@hasty-bazar/core'
import { Stack, Tab, tabClasses, Theme, Typography, useMediaQuery } from '@mui/material'
import { HBTabs } from 'libs/core/src/components/HBTab/HBTabContainer.styles'
import { useRouter } from 'next/router'
import { FC, useEffect } from 'react'
import { FormattedMessage } from 'react-intl'
import SavedMessages from '../saved.messages'
import { paramKey, SavedPageProps } from '../SavedPage'

const SavedHeader: FC<SavedPageProps> = ({ param }) => {
  const { push, replace } = useRouter()
  const router = useRouter()
  const isMobileScreen = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'))

  const handleChange = (event: React.SyntheticEvent, newValue: paramKey) => {
    if (router.pathname.includes('profile')) replace(`/profile/saved/${newValue}`)
    else replace(`/saved/${newValue}`)
  }

  useEffect(() => {
    if (router.asPath === '/profile/saved/') {
      replace(`/profile/saved/search`)
    }
  }, [])

  return (
    <HBTabs
      value={param}
      onChange={handleChange}
      variant="scrollable"
      scrollButtons={false}
      sx={{
        [`& .${tabClasses.root}`]: {
          paddingBottom: 0,
          paddingTop: 0,
        },
      }}
    >
      <Tab
        value="search"
        label={
          <Stack spacing={1.5} direction="row" alignItems="center">
            <HBIcon type="searchAlt" />
            <Typography variant={isMobileScreen ? 'overline' : 'button'}>
              <FormattedMessage {...SavedMessages.savedSearch} />
            </Typography>
          </Stack>
        }
        wrapped
      />
      <Tab
        value="vendor"
        label={
          <Stack spacing={1.5} direction="row" alignItems="center">
            <HBIcon type="store" />
            <Typography variant={isMobileScreen ? 'overline' : 'button'}>
              <FormattedMessage {...SavedMessages.savedVendors} />
            </Typography>
          </Stack>
        }
        wrapped
      />
    </HBTabs>
  )
}

export default SavedHeader
