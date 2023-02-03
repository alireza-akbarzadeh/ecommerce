import HBLink from '@hasty-bazar-commerce/components/HBLink'
import { Box, Container, Stack, styled, Theme, useMediaQuery } from '@mui/material'
import { useRouter } from 'next/router'
import { FormattedMessage, useIntl } from 'react-intl'
import StaticPageHeader from '../../StaticPageHeader.messages'

const ItemMenuStyle = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(4),
  position: 'relative',
  transition: 'all .35s ease',
  fontSize: theme.typography.subtitle2.fontSize,
  [theme.breakpoints.down('sm')]: {
    fontSize: theme.typography.caption.fontSize,
    padding: theme.spacing(2, 1),
  },

  '&:before': {
    content: '""',
    position: 'absolute',
    width: '100%',
    height: 5,
    bottom: theme.spacing(-1.75),
    left: 0,
    backgroundColor: theme.palette.primary.main,
    borderRadius: theme.spacing(10),
    transform: 'scaleX(0)',
    transition: 'all 0.3s ease-in-out 0s',
  },
  '&:hover': {
    color: theme.palette.primary.main,
    '&:before': {
      transform: 'scaleX(1)',
    },
    [theme.breakpoints.down('sm')]: {
      '&:before': {
        transform: 'scaleX(0)',
      },
    },
  },
}))

const headerData = [
  {
    href: '/about-us',
    title: <FormattedMessage {...StaticPageHeader.aboutUs} />,
  },
  {
    href: '/contact-us',
    title: <FormattedMessage {...StaticPageHeader.contactUs} />,
  },
  {
    href: '/faq',
    title: <FormattedMessage {...StaticPageHeader.frequentlyAskedQuestion} />,
    query: 'from=footerPage',
  },
  {
    href: '/careers',
    title: <FormattedMessage {...StaticPageHeader.careerOpportunities} />,
  },
]

const Header = () => {
  const breakpointDownSm = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'))
  const router = useRouter()
  const { formatMessage } = useIntl()

  return (
    <Container
      maxWidth="md"
      sx={{
        position: 'relative',
        px: { xs: 1 },
      }}
    >
      <Stack direction="row">
        <Stack spacing={{ xs: 1, md: 1 }} direction="row" alignItems="center">
          <HBLink href="/" sx={{ display: 'flex' }}>
            <Box
              component="img"
              sx={{ objectFit: 'contain', width: { xs: 30, sm: 64 } }}
              src={breakpointDownSm ? '/assets/footerPageResponsiveLogo.png' : '/assets/logo.png'}
              alt={formatMessage(StaticPageHeader.hastiBazaarText)}
            />
          </HBLink>
        </Stack>

        <Stack
          direction="row"
          alignItems="center"
          sx={(theme) => ({ width: 'max-content', margin: theme.spacing(0, 'auto'), height: 64 })}
          spacing={{ xs: 7, md: 7 }}
        >
          {headerData.map((item) => (
            <HBLink
              variant="subtitle2"
              underline="none"
              color="info.main"
              sx={(theme) => ({
                marginLeft: breakpointDownSm ? `${theme.spacing(1)} !important` : 'initial',
              })}
              href={{ pathname: item.href, query: item.query! }}
            >
              <ItemMenuStyle
                sx={{
                  '&:before': {
                    transform:
                      item.href === router.pathname && !breakpointDownSm
                        ? 'scaleX(1)'
                        : 'scaleX(0)',
                  },
                  color:
                    item.href === router.pathname
                      ? breakpointDownSm
                        ? 'grey.700'
                        : 'primary.main'
                      : 'text.secondary',
                }}
              >
                {item.title}
              </ItemMenuStyle>
            </HBLink>
          ))}
        </Stack>
      </Stack>
    </Container>
  )
}
export default Header
