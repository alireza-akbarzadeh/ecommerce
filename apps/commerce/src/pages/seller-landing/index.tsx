import { wrapper } from '@hasty-bazar-commerce/core/redux/store'
import { serverSideRequests } from '@hasty-bazar-commerce/core/utils'
import { SellerLandingPage } from '@hasty-bazar-commerce/domains'
import { GetServerSideProps } from 'next'

const SellerLanding = () => {
  return <SellerLandingPage />
}

export default SellerLanding
export const getServerSideProps: GetServerSideProps = wrapper.getServerSideProps(
  (store) => async (ctx) => {
    const { props } = await serverSideRequests(store, ctx)
    return { props }
  },
)
