import { serverSideRequests } from '@hasty-bazar-admin/core/utils'
import { GetServerSideProps } from 'next'
import { AuthPage } from '../../domains/Auth'

const Auth = () => {
  return <AuthPage />
}

Auth.layout = ({ children }: any) => <>{children}</>

export default Auth

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { props } = await serverSideRequests(ctx)
  if (props.session?.accessToken) {
    return {
      props,
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }
  return { props }
}
