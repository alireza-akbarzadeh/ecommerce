import { FaqPage } from '@hasty-bazar-commerce/domains/Faq'
import { DefaultLayout } from '@hasty-bazar-commerce/layout'
import { StaticPageLayout } from '@hasty-bazar-commerce/layout/StaticPageLayout'
import { Stack, styled } from '@mui/material'
import { useRouter } from 'next/router'

const PageWrapper = styled(Stack)(({ theme }) => ({
  margin: theme.spacing(10, 'auto'),
  backgroundColor: theme.palette.common.white,
  width: theme.breakpoints.values.lg,
  borderRadius: theme.spacing(4),
  padding: theme.spacing(6),
}))

const Fqa = () => {
  const router = useRouter()

  if (router.query.from === 'footerPage')
    return (
      <StaticPageLayout>
        <FaqPage />
      </StaticPageLayout>
    )

  return (
    <DefaultLayout>
      <PageWrapper>
        <FaqPage />
      </PageWrapper>
    </DefaultLayout>
  )
}

Fqa.layout = ({ children }: any) => <>{children}</>
export default Fqa
