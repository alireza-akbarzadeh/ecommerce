import { wrapper } from '@hasty-bazar-commerce/core/redux/store'
import { serverSideRequests } from '@hasty-bazar-commerce/core/utils'
import { AppResultPage } from '@hasty-bazar-commerce/domains/Result'
import { GetServerSideProps } from 'next'

interface IResultDataType {
  paymentId: string
}

const AppResult = (props: IResultDataType) => {
  return <AppResultPage paymentId={props.paymentId} />
}
AppResult.layout = ({ children }: any) => <>{children}</>
export default AppResult

export const getServerSideProps: GetServerSideProps = wrapper.getServerSideProps(
  (store) => async (ctx) => {
    const { props } = await serverSideRequests(store, ctx)

    return { props: { ...props, paymentId: ctx.query?.paymentId?.[0] } }
  },
)
