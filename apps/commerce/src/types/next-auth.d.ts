import { DefaultSession } from 'next-auth'
import { JWT } from 'next-auth/jwt'
import { AuthenticationDto } from './serverTypes'

declare module 'next-auth/jwt' {
  /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
  interface JWT extends AuthenticationDto {
    currency: {
      slug: string
      thousand_sep: string
      decimal_sep: string
    }
    tax_percent: string
    date_format: string
  }
}

declare module 'next-auth' {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session extends Omit<DefaultSession, 'user'>, Partial<User> {
    user: {
      firstName: string
      lastName: string
      partyId: string
      partyRoleId: string
      userName: string
    }
    accessToken: string
    //error?: any
  }
  interface User extends JWT {}
}

// declare module 'next-auth/react' {
//   function useSession<R extends boolean>(
//     options?: UseSessionOptions<R>,
//   ): SessionContextValue<R>
// }
