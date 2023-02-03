import { getServerSession } from '@hasty-bazar-vendor/domains/Auth/NextAuth/NextAuth'
import { GetServerSidePropsContext } from 'next'
import { Session } from 'next-auth'
import { ParsedUrlQuery } from 'querystring'

export async function serverSideRequests(context: GetServerSidePropsContext<ParsedUrlQuery>) {
  try {
    const session: Session | null = await getServerSession(context)

    if (!session?.accessToken) {
      return { props: {}, redirect: { destination: '/auth/signin', permanent: false } }
    }

    return {
      props: { locale: context.locale, session },
      redirect: undefined,
      session,
    }
  } catch (error) {
    return {
      props: {},
    }
  }
}
