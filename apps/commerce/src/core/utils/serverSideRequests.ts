import { setLocale } from '@hasty-bazar-commerce/domains/App/App.reducer'
import { getServerSession } from '@hasty-bazar-commerce/domains/Auth/NextAuth/NextAuth'
import { catalogApi } from '@hasty-bazar-commerce/services/catalogApi.generated'
import { cmsApi } from '@hasty-bazar-commerce/services/cmsApi.generated'
import { idrApi } from '@hasty-bazar-commerce/services/idrApi.generated'
import { AnyAction, Store, ThunkAction } from '@reduxjs/toolkit'
import { QueryActionCreatorResult } from '@reduxjs/toolkit/dist/query/core/buildInitiate'
import { GetServerSidePropsContext } from 'next'
import { Session } from 'next-auth'
import { ParsedUrlQuery } from 'querystring'
import { ApiConstants } from '../constants'

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

const timeout = (milliseconds: number) => {
  return new Promise((_, reject) => {
    setTimeout(() => reject(new Error('Request took too long!')), milliseconds)
  })
}

async function serverSideRequests(
  store: Store,
  context: GetServerSidePropsContext<ParsedUrlQuery>,
  pageName?: string,
) {
  const session: Session | null = await getServerSession(context)
  const locale = context.locale

  const raceAll = async (promises: any, milliseconds: number) => {
    return await Promise.allSettled(
      promises
        .filter((v: any) => !!v)
        .map((p: any) => {
          return Promise.race([p, timeout(milliseconds)]).then((res) => store.dispatch(res))
        }),
    )
  }

  try {
    const queryOptionsList = []

    //default services like basket and user
    queryOptionsList.unshift(
      cmsApi.endpoints.getWebCmsMenugroupsByPlatformType.initiate({
        ...ApiConstants,
        platformType: 1021001,
      }),
    )
    if (pageName) {
      queryOptionsList.unshift(
        cmsApi.endpoints.getWebCmsPagesPlatformTypeByPlatformTypeNameAndName.initiate({
          ...ApiConstants,
          name: pageName,
          platformType: 1021001,
        }),
      )
      if (pageName === 'ProductDetail') {
        queryOptionsList.unshift(
          catalogApi.endpoints.getWebCatalogProductDetailByHsin.initiate({
            ...ApiConstants,
            hsin: context?.query?.hsin?.[0] || '',
          }),
        )
      }
    }
    if (session?.accessToken) {
      queryOptionsList.unshift(
        cmsApi.endpoints.getWebCmsContentsByEntityTypeIdAndEntityId.initiate({
          ...ApiConstants,
          entityId: session?.user?.partyId ?? '',
          entityTypeId: 3001,
          factor: 'ProfileImage',
        }),
        idrApi.endpoints.getWebIdrCustomersByMobile.initiate({
          ...ApiConstants,
          mobile: session?.user?.userName,
        }),
      )
    }

    store.dispatch(setLocale(locale ?? ''))
    //@ts-ignore
    await raceAll(queryOptionsList, 1000)

    return {
      props: {
        session: session ?? null,
        pageName: pageName ?? null,
      },
    }
  } catch (error) {
    return {
      props: {},
    }
  }
}

export default serverSideRequests
