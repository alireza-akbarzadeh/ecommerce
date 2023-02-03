import { serverSideRequests } from '@hasty-bazar-vendor/core/utils'
import { AuthPage } from '@hasty-bazar-vendor/domains'
import { GetServerSideProps } from 'next'

export type ChoosePasswordProps = {
  userInfo?: {
    token: string
    user: string
  }
}
const ChoosePassword = (props: ChoosePasswordProps) => {
  return <AuthPage userInfo={props.userInfo} />
}

ChoosePassword.layout = ({ children }: any) => <>{children}</>

export default ChoosePassword

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { props } = await serverSideRequests(ctx)
  if (!ctx.query['@token']) {
    return { props: {}, redirect: { destination: '/', permanent: false } }
  }

  return {
    props: {
      ...props,
      userInfo: {
        token: decodeURI(ctx.query['@token'] as string),
        user: ctx.query['user'],
      },
    },
  }
}
