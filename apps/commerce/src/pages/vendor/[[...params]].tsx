import { wrapper } from '@hasty-bazar-commerce/core/redux/store'
import { serverSideRequests } from '@hasty-bazar-commerce/core/utils'
import DynamicLayout, { DynamicLayoutProps } from '@hasty-bazar-commerce/layout/DynamicLayout'
import { GetServerSideProps } from 'next'

const Vendor = (props: DynamicLayoutProps) => {
  return <DynamicLayout pageName={props.pageName} />
}

Vendor.layout = ({ children }: any) => <>{children}</>
export default Vendor

export const getServerSideProps: GetServerSideProps = wrapper.getServerSideProps(
  (store) => async (ctx) => {
    const { props } = await serverSideRequests(store, ctx, 'vitrin')

    return { props: { ...props } }
  },
)
