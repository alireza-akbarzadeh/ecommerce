import { getServerSession } from '@hasty-bazar-admin/domains/Auth/NextAuth/NextAuth'
import { cmsApi } from '@hasty-bazar/admin-shared/services/cmsApi.generated'
import { AnyAction, ThunkAction } from '@reduxjs/toolkit'
import { QueryActionCreatorResult } from '@reduxjs/toolkit/dist/query/core/buildInitiate'
import { GetServerSidePropsContext } from 'next'
import { Session } from 'next-auth'
import { ParsedUrlQuery } from 'querystring'
import { isNil } from 'ramda'
import { initializeStore } from '@hasty-bazar/admin-shared/core/redux/store'
import appMessages from '@hasty-bazar-admin/domains/App/App.messages'

export type ServerSideResultType = PromiseFulfilledResult<{
  endpointName: string
  originalArgs: any
  startedTimeStamp: number
  data: any
  fulfilledTimeStamp: number
  isUninitialized: boolean
  isLoading: boolean
  isSuccess: boolean
  isError: boolean
}>[]

export type QueryOptionsFn = ({
  session,
  locale,
}: {
  session: Session | null
  locale?: string
}) => Array<ThunkAction<QueryActionCreatorResult<any>, any, any, AnyAction>>

async function serverSideRequests(
  context: GetServerSidePropsContext<ParsedUrlQuery>,
  queryOptionsFn: QueryOptionsFn = ({ session, locale }) => [],
) {
  const session: Session | null = await getServerSession(context)
  const accessToken: string = (session?.accessToken || null) as string
  const locale = context.locale

  try {
    if (isNil(accessToken)) {
      return {
        props: { session },
        redirect: { destination: '/auth/signin', permanent: false },
      }
    }
    const queryOptionsList = queryOptionsFn({ session, locale })

    //default services like basket and user
    queryOptionsList.unshift(
      cmsApi.endpoints.getAdminCmsContentsByEntityTypeIdAndEntityId.initiate({
        'client-name': 'add-content',
        'client-version': '1.0.0',
        entityId: session?.user?.partyId ?? '',
        entityTypeId: 3001,
      }),
    )

    const reduxStore = initializeStore({
      app: {
        locale,
        defaultCurrencyTitle: appMessages.rial.defaultMessage,
        baseUrl: process.env.NEXT_PUBLIC_GATEWAY,
      },
      auth: { accessToken },
    })
    const { dispatch } = reduxStore

    //@ts-ignore
    const results: ServerSideResultType = await Promise.allSettled(
      queryOptionsList.filter((v) => !!v).map((queryOptions: any) => dispatch(queryOptions)),
    )

    return {
      props: { initialReduxState: reduxStore.getState(), locale, session: session ?? null },
      results,
    }
  } catch (error) {
    return {
      props: { session },
    }
  }
}

export default serverSideRequests
