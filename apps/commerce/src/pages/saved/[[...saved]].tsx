import { wrapper } from '@hasty-bazar-commerce/core/redux/store'
import { serverSideRequests } from '@hasty-bazar-commerce/core/utils'
import { SavedPage } from '@hasty-bazar-commerce/domains/Saved'
import { paramKey, params, SavedPageProps } from '@hasty-bazar-commerce/domains/Saved/SavedPage'
import AuthGuard from '@hasty-bazar-commerce/layout/AuthGuard'
import { GetServerSideProps } from 'next'
import { isNil } from 'ramda'

const Saved = (props: SavedPageProps) => {
  return (
    <AuthGuard>
      <SavedPage param={props.param} />
    </AuthGuard>
  )
}

export default Saved

export const getServerSideProps: GetServerSideProps = wrapper.getServerSideProps(
  (store) => async (ctx) => {
    const { props } = await serverSideRequests(store, ctx)
    if (!(ctx?.query?.saved?.[0] && params.includes(ctx?.query?.saved?.[0] as paramKey))) {
      return {
        props: {},
        notFound: true,
      }
    } else if (isNil(props.session?.accessToken)) {
      return {
        redirect: { destination: `/auth/signin?callbackUrl=${ctx.req.url}`, permanent: false },
      }
    }
    return { props: { param: ctx?.query?.saved?.[0] as paramKey, ...props } }
  },
)
