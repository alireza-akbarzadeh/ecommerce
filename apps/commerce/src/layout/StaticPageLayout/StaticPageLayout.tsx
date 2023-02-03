import { Container, Stack, styled } from '@mui/material'
import { FC, ReactNode } from 'react'
import { Footer } from './components/footer'
import { Header } from './components/header'

const PageWrapper = styled(Stack)(({ theme }) => ({
  margin: theme.spacing(8, 'auto'),
  backgroundColor: theme.palette.common.white,
  width: `calc(100% - 100px)`,
  borderRadius: theme.spacing(4),
  padding: theme.spacing(7, 6),
  [theme.breakpoints.down('md')]: {
    width: `calc(100% - 40px)`,
    padding: theme.spacing(5, 4),
  },
  [theme.breakpoints.down('sm')]: {
    margin: theme.spacing(6, 'auto'),
    width: `100%`,
  },
}))

interface StaticPageProps {
  children?: ReactNode | undefined
}

const StaticPageLayout: FC<StaticPageProps> = ({ children }) => {
  return (
    <Stack>
      <Stack bgcolor="common.white">
        <Header />
      </Stack>
      <Container sx={{ px: { xs: 0 } }}>
        <Stack direction="column" bgcolor="grey.100">
          <PageWrapper>{children}</PageWrapper>
        </Stack>
      </Container>
      <Footer />
    </Stack>
  )
}

export default StaticPageLayout
