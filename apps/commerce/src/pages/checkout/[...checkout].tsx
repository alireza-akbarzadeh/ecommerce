import { wrapper } from '@hasty-bazar-commerce/core/redux/store'
import { serverSideRequests } from '@hasty-bazar-commerce/core/utils'
import { CheckoutPage, CheckoutProps, CheckoutSteps } from '@hasty-bazar-commerce/domains/Checkout'
import AuthGuard from '@hasty-bazar-commerce/layout/AuthGuard'
import { GetServerSideProps } from 'next'
import { isNil } from 'ramda'

const Checkout = (props: CheckoutProps) => {
  return (
    <AuthGuard>
      <CheckoutPage route={props.route} />
    </AuthGuard>
  )
}

Checkout.layout = ({ children }: any) => <>{children}</>

export default Checkout

export const getServerSideProps: GetServerSideProps = wrapper.getServerSideProps(
  (store) => async (ctx) => {
    const { props } = await serverSideRequests(store, ctx)
    if (!(ctx?.query?.checkout?.[0] && ctx?.query?.checkout?.[0] in CheckoutSteps)) {
      return {
        props: {},
        notFound: true,
      }
    } else if (isNil(props?.session?.accessToken)) {
      return {
        props: {},
        redirect: { destination: `/auth/signin?callbackUrl=${ctx.req.url}`, permanent: false },
      }
    }
    return { props: { route: ctx?.query?.checkout?.[0], ...props } }
  },
)
