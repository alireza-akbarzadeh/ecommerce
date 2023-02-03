import { wrapper } from '@hasty-bazar-commerce/core/redux/store'
import { serverSideRequests } from '@hasty-bazar-commerce/core/utils'
import QuestionDetailPage from '@hasty-bazar-commerce/domains/Faq/QuestionDetailPage'
import { DefaultLayout } from '@hasty-bazar-commerce/layout'
import { StaticPageLayout } from '@hasty-bazar-commerce/layout/StaticPageLayout'
import { Stack, styled } from '@mui/material'
import { GetServerSideProps } from 'next'
import { useRouter } from 'next/router'

const PageWrapper = styled(Stack)(({ theme }) => ({
  margin: theme.spacing(10, 'auto'),
  backgroundColor: theme.palette.common.white,
  width: theme.breakpoints.values.lg,
  borderRadius: theme.spacing(4),
  padding: theme.spacing(6),
}))

const QuestionDetail = () => {
  const router = useRouter()

  return (
    <>
      {router.query.from === 'footerPage' ? (
        <StaticPageLayout>
          <QuestionDetailPage />
        </StaticPageLayout>
      ) : (
        <DefaultLayout>
          <PageWrapper>
            <QuestionDetailPage />
          </PageWrapper>
        </DefaultLayout>
      )}
    </>
  )
}

QuestionDetail.layout = ({ children }: any) => <>{children}</>
export default QuestionDetail
export const getServerSideProps: GetServerSideProps = wrapper.getServerSideProps(
  (store) => async (ctx) => {
    const { props } = await serverSideRequests(store, ctx)
    return { props }
  },
)
