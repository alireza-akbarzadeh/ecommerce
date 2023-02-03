import { HBLink } from '@hasty-bazar-commerce/components'
import { HBAccordion } from '@hasty-bazar/core'
import {
  accordionClasses,
  Box,
  Grid,
  Stack,
  styled,
  Theme,
  Typography,
  useMediaQuery,
} from '@mui/material'
import { useIntl } from 'react-intl'
import StaticPageHeader from '../../StaticPageHeader.messages'

export interface IFootterSubList {
  id: string
  parentId?: string | null
  type: 'header' | 'subHeader'
  text: string
  link: string
  icon?: string
  query?: string
}

const FotterWrapperStyle = styled(Grid)(({ theme }) => ({
  width: `${theme.breakpoints.values.lg}px`,
}))

const FooterSubMenuStyle = styled(Grid)(({ theme }) => ({
  marginBottom: theme.spacing(3),
}))

const Footer = () => {
  const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'))
  const { formatMessage } = useIntl()

  const footterList: IFootterSubList[] = [
    {
      id: '16',
      parentId: null,
      link: '',
      text: formatMessage(StaticPageHeader.followUsInSocialMedia),
      type: 'header',
    },
    {
      id: '17',
      parentId: '16',
      link: 'https://instagram.com/dartil.official',
      text: '',
      type: 'subHeader',
      icon: '/assets/svg/colored-instagram.svg',
    },
    {
      id: '18',
      parentId: '16',
      link: 'https://www.youtube.com/channel/UCj5mUukp5i3GIPNt-oa5HFQ',
      text: '',
      type: 'subHeader',
      icon: '/assets/svg/colored-youtube.svg',
    },
    {
      id: '19',
      parentId: '16',
      link: 'https://t.me/dartil_official',
      text: '',
      type: 'subHeader',
      icon: '/assets/svg/colored-telegram.svg',
    },
    {
      id: '20',
      parentId: '16',
      link: 'https://www.aparat.com/dartil',
      text: '',
      type: 'subHeader',
      icon: '/assets/svg/colored-aparat.svg',
    },
    {
      id: '21',
      parentId: '16',
      link: 'https://www.linkedin.com/company/dartil-official',
      text: '',
      type: 'subHeader',
      icon: '/assets/svg/colored-linkedin.svg',
    },

    {
      id: '1',
      parentId: null,
      link: '',
      text: formatMessage(StaticPageHeader.story),
      type: 'header',
    },
    {
      id: '2',
      parentId: '1',
      link: '/about-us',
      text: formatMessage(StaticPageHeader.aboutUs),
      type: 'subHeader',
    },
    {
      id: '3',
      parentId: '1',
      link: '/contact-us',
      text: formatMessage(StaticPageHeader.contactUs),
      type: 'subHeader',
    },
    {
      id: '4',
      parentId: '1',
      link: '/careers',
      text: formatMessage(StaticPageHeader.careerOpportunities),
      type: 'subHeader',
    },

    {
      id: '5',
      parentId: null,
      link: '#',
      text: formatMessage(StaticPageHeader.customerServices),
      type: 'header',
    },
    {
      id: '6',
      parentId: '5',
      link: '/faq',
      text: formatMessage(StaticPageHeader.commonQuestions),
      type: 'subHeader',
      query: 'from=footerPage',
    },
    {
      id: '7',
      parentId: '5',
      link: '#',
      text: formatMessage(StaticPageHeader.hitMag),
      type: 'subHeader',
    },
  ]

  const parents = footterList?.filter((_) => !_.parentId)

  const finalData = parents?.map((parent) => {
    return { ...parent, children: footterList.filter((item) => item.parentId === parent.id) }
  })

  return (
    <Grid sx={{ p: { sm: 10, xs: 4 } }} bgcolor="common.white" container justifyContent="center">
      {!isMobile && (
        <FotterWrapperStyle container justifyContent="center">
          {finalData.map((parent) => (
            <FooterSubMenuStyle
              spacing={4}
              key={parent.id}
              sx={(theme) => ({
                borderRight: parent.id === '16' ? `2px solid ${theme.palette.grey[300]}` : 'unset',
                mr: {
                  md: parent.id === '16' ? theme.spacing(17) : 'unset',
                  xs: theme.spacing(2),
                },
                pr: { md: theme.spacing(17), xs: theme.spacing(2) },
              })}
            >
              <Typography variant={'subtitle1'} color="text.primary" pb={3}>
                {parent.text}
              </Typography>
              <Stack
                spacing={parent.children[0]?.icon ? 8 : 4}
                direction={parent.children[0]?.icon ? 'row' : 'column'}
              >
                {parent?.children.map((child) => (
                  <HBLink
                    sx={{ textDecoration: 'none' }}
                    href={{ pathname: child.link, query: child.query! }}
                    key={child.id}
                  >
                    {child?.icon ? (
                      <Box
                        component="img"
                        src={child.icon}
                        width={24}
                        height={24}
                        sx={{
                          filter: 'grayscale(1)',
                          '&:hover': { filter: 'unset', transitionDelay: '0.25s' },
                        }}
                      />
                    ) : (
                      <Typography variant={'body1'} color="text.secondary">
                        {child.text}
                      </Typography>
                    )}
                  </HBLink>
                ))}
              </Stack>
            </FooterSubMenuStyle>
          ))}
        </FotterWrapperStyle>
      )}
      {isMobile && (
        <>
          {finalData.map((parent) => (
            <HBAccordion
              summary={
                <Typography variant="subtitle1" color="text.primary">
                  {parent.text}
                </Typography>
              }
              detail={
                <Stack spacing={4} direction={parent.id === '16' ? 'row' : 'column'}>
                  {parent?.children.map((child) => (
                    <HBLink
                      sx={{ textDecoration: 'none' }}
                      href={{ pathname: child.link, query: child.query! }}
                      key={child.id}
                    >
                      {child?.icon ? (
                        <Box
                          component="img"
                          src={child.icon}
                          width={24}
                          height={24}
                          sx={{
                            filter: 'grayscale(1)',
                            '&:hover': { filter: 'unset', transitionDelay: '0.25s' },
                          }}
                        />
                      ) : (
                        <Typography variant={'body1'} color="text.secondary">
                          {child.text}
                        </Typography>
                      )}
                    </HBLink>
                  ))}
                </Stack>
              }
              sx={{
                width: '100%',
                boxShadow: 'unset',
                [`&.${accordionClasses.expanded}`]: {
                  my: 0,
                },
              }}
            />
          ))}
        </>
      )}
    </Grid>
  )
}
export default Footer
