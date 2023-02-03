import { BasketSubjectFuncs } from '@hasty-bazar-commerce/subjects/BasketSubjects'
import { useEffect, useMemo, useState } from 'react'

export const localStorageKey = 'client-session'

const useClientSession = () => {
  const [clientSession, setClientSession] = useState<string | null>(null)
  useEffect(() => {
    const valuingClientSession = () => {
      if (typeof window !== 'undefined') {
        if (!localStorage.getItem(localStorageKey)) {
          setClientSession('')
        } else {
          setClientSession(localStorage.getItem(localStorageKey))
        }
      }
    }

    valuingClientSession()

    const subscrition = BasketSubjectFuncs.getReceivedClientSession().subscribe((res) => {
      valuingClientSession()
    })

    return () => {
      subscrition.unsubscribe()
    }
  }, [])

  const memorizedValue = useMemo(() => {
    return clientSession
  }, [clientSession])

  return memorizedValue
}

export default useClientSession
