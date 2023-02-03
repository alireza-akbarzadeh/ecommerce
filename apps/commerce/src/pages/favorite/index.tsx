import { wrapper } from '@hasty-bazar-commerce/core/redux/store'
import { serverSideRequests } from '@hasty-bazar-commerce/core/utils'
import { FavoritePage } from '@hasty-bazar-commerce/domains/Favorite'
import AuthGuard from '@hasty-bazar-commerce/layout/AuthGuard'
import { GetServerSideProps } from 'next'
import { isNil } from 'ramda'

const Favorite = () => {
  return (
    <AuthGuard>
      <FavoritePage />
    </AuthGuard>
  )
}

export const getServerSideProps: GetServerSideProps = wrapper.getServerSideProps(
  (store) => async (ctx) => {
    const { props } = await serverSideRequests(store, ctx)
    if (isNil(props.session?.accessToken)) {
      return {
        props: {},
        redirect: { destination: `/auth/signin?callbackUrl=${ctx.req.url}`, permanent: false },
      }
    }

    return { props: { ...props } }
  },
)
export default Favorite
