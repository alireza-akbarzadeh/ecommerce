import { wrapper } from '@hasty-bazar-commerce/core/redux/store'
import { serverSideRequests } from '@hasty-bazar-commerce/core/utils'
import DynamicLayout, { DynamicLayoutProps } from '@hasty-bazar-commerce/layout/DynamicLayout'
import { GetServerSideProps } from 'next'

const Collection = (props: DynamicLayoutProps) => {
  return <DynamicLayout pageName={props.pageName} />
}

Collection.layout = ({ children }: any) => <>{children}</>

export default Collection

export const getServerSideProps: GetServerSideProps = wrapper.getServerSideProps(
  (store) => async (ctx) => {
    const { props } = await serverSideRequests(store, ctx, 'Filter')
    return { props }
  },
)
