import { wrapper } from '@hasty-bazar-commerce/core/redux/store'
import { serverSideRequests } from '@hasty-bazar-commerce/core/utils'
import { GetServerSideProps } from 'next'
import { AuthPage } from '../../domains/Auth'

const Auth = () => {
  return <AuthPage />
}

Auth.layout = ({ children }: any) => <>{children}</>

export default Auth

export const getServerSideProps: GetServerSideProps = wrapper.getServerSideProps(
  (store) => async (ctx) => {
    const { props } = await serverSideRequests(store, ctx)
    return { props }
  },
)
