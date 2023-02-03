import { wrapper } from '@hasty-bazar-commerce/core/redux/store'
import { serverSideRequests } from '@hasty-bazar-commerce/core/utils'
import DynamicLayout, { DynamicLayoutProps } from '@hasty-bazar-commerce/layout/DynamicLayout'
import { GetServerSideProps } from 'next'

const Category = (props: DynamicLayoutProps) => {
  return <DynamicLayout pageName={props.pageName} />
}

Category.layout = ({ children }: any) => <>{children}</>
export default Category

export const getServerSideProps: GetServerSideProps = wrapper.getServerSideProps(
  (store) => async (ctx) => {
    const { props } = await serverSideRequests(store, ctx, ctx!.query?.id?.[0] as string)
    return { props }
  },
)
