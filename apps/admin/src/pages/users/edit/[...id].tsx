import { initializeStore } from '@hasty-bazar/admin-shared/core/redux/store'
import { serverSideRequests } from '@hasty-bazar-admin/core/utils'
import { UserAddEditPage } from '@hasty-bazar-admin/domains'
import { idrApi } from '@hasty-bazar/admin-shared/services/idrApi.generated'
import { GetServerSideProps } from 'next'
import { useRouter } from 'next/router'

const UserAdd = () => {
  const { query } = useRouter()
  return <UserAddEditPage id={query.id?.[0]} />
}

export default UserAdd

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { props, redirect } = await serverSideRequests(ctx)
  //TODO check SSR session
  // const store = initializeStore()

  // const { data: { data: userItem = {} } = {}, status } = await store.dispatch(
  //   //@ts-ignore
  //   idrApi.endpoints.getAdminIdrPartiesByPartyIdAccount.initiate({
  //     'client-name': 'hasty-bazar-admin',
  //     'client-version': '1.0.0',
  //     partyId: ctx.params?.id?.[0] || '0',
  //   }),
  // )

  // if (status !== 'fulfilled' || !userItem?.id) {
  //   return {
  //     redirect: {
  //       destination: '/users',
  //       permanent: false,
  //     },
  //   }
  // }

  return { props, redirect }
}
