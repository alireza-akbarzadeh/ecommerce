import { Method } from 'axios'
import { useEffect, useState } from 'react'
import axios from '../handler'

/**
 * https://github.com/ali-master/react-typescript-hooks-sample
 */
const useFetch = <T extends object>(
  url: string,
  method: Method,
  body?: any,
): { loading: boolean; error: string | null; data: T | null } => {
  const [loading, setLoading] = useState<boolean>(false)
  const [data, setData] = useState<T | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setLoading(true)
    const fetchData = async () => {
      try {
        const response = await axios({
          url,
          method,
          data: body,
        })
        const data = response?.data
        setData(data?.data)
      } catch (error: any) {
        setError(error)
      } finally {
        setLoading(false)
      }
    }

    fetchData().then((r) => r)
  }, [url])

  return { loading, error, data }
}

export { useFetch }
