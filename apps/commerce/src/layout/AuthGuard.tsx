import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { FC, ReactElement } from 'react'

const AuthGuard: FC<{ children: ReactElement }> = ({ children }) => {
  const session = useSession()
  const router = useRouter()

  if (session.status === 'unauthenticated')
    router.replace('/auth/signin/?callbackUrl=' + router.asPath)

  return children
}

export default AuthGuard
