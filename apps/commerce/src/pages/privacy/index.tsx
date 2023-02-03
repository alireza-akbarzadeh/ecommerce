import { wrapper } from '@hasty-bazar-commerce/core/redux/store'
import { serverSideRequests } from '@hasty-bazar-commerce/core/utils'
import { PrivacyPage } from '@hasty-bazar-commerce/domains/Privacy'
import { Stack, styled } from '@mui/material'
import { GetServerSideProps } from 'next'

const PageWrapper = styled(Stack)(({ theme }) => ({
  margin: theme.spacing(10, 'auto'),
  backgroundColor: theme.palette.common.white,
  width: theme.breakpoints.values.lg,
  borderRadius: theme.spacing(4),
  padding: theme.spacing(6),
}))

const Privacy = () => {
  return (
    <PageWrapper>
      <PrivacyPage />
    </PageWrapper>
  )
}

export default Privacy

export const getServerSideProps: GetServerSideProps = wrapper.getServerSideProps(
  (store) => async (ctx) => {
    const { props } = await serverSideRequests(store, ctx)
    return { props }
  },
)
