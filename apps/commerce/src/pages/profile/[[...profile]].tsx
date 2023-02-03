import { wrapper } from '@hasty-bazar-commerce/core/redux/store'
import serverSideRequests from '@hasty-bazar-commerce/core/utils/serverSideRequests'
import { ProfilePage } from '@hasty-bazar-commerce/domains/Profile'
import AuthGuard from '@hasty-bazar-commerce/layout/AuthGuard'
import { ProfileLayout } from '@hasty-bazar-commerce/layout/ProfileLayout'
import { GetServerSideProps } from 'next'
import { isNil } from 'ramda'

const Profile = () => {
  return (
    <AuthGuard>
      <ProfilePage />
    </AuthGuard>
  )
}
Profile.layout = ({ children }: any) => <ProfileLayout>{children}</ProfileLayout>

export default Profile

export const getServerSideProps: GetServerSideProps = wrapper.getServerSideProps(
  (store) => async (ctx) => {
    const { props } = await serverSideRequests(store, ctx)
    if (isNil(props?.session?.accessToken)) {
      return {
        props: {},
        redirect: { destination: `/auth/signin?callbackUrl=/profile`, permanent: false },
      }
    }

    return { props }
  },
)
