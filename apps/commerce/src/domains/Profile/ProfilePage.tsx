import { Container, Stack, styled, useMediaQuery, useTheme } from '@mui/material'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { ProfileBody } from './components'
import { ProfileBodyType } from './components/ProfileBody'
import { ProfileSideBar } from './sideBar'

export const ContainerStyle = styled(Container)(({ theme }) => ({
  paddingTop: theme.spacing(6),
  paddingBottom: theme.spacing(6),
  [theme.breakpoints.down('md')]: {
    paddingRight: theme.spacing(4),
    paddingLeft: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  [theme.breakpoints.down('sm')]: {
    padding: 0,
  },
}))

const ProfilePage = () => {
  const theme = useTheme()
  const matchesSmall = useMediaQuery(theme.breakpoints.down('md'), { noSsr: true })
  const [body, setBody] = useState<ProfileBodyType | null>(null)
  const { query } = useRouter()

  useEffect(() => {
    if (!matchesSmall && !query?.profile?.[0]) {
      setBody('managment')
    } else if (matchesSmall && !query?.profile?.[0]) {
      setBody(null)
    } else {
      setBody(query?.profile?.[0] as ProfileBodyType)
    }
  }, [matchesSmall, query?.profile?.[0]])

  return (
    <Stack
      alignItems="center"
      sx={{ bgcolor: 'grey.100', width: '100%', mb: { md: 'initial', xs: 2 } }}
    >
      <ContainerStyle>
        <Stack direction="row" spacing={4}>
          {(!matchesSmall || (matchesSmall && !body)) && (
            <ProfileSideBar isSmallWidth={matchesSmall} />
          )}
          {(!matchesSmall || (matchesSmall && body)) && (
            <Stack sx={{ flex: 1, overflow: 'hidden' }}>
              <ProfileBody route={body} />
            </Stack>
          )}
        </Stack>
      </ContainerStyle>
    </Stack>
  )
}

export default ProfilePage
