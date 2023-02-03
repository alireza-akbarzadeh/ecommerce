import { CommerceLoading } from '@hasty-bazar-commerce/components'
import { appTokenLocalKey } from '@hasty-bazar-commerce/core/hook/usePay'
import { openToast } from '@hasty-bazar/core'
import { GetServerSideProps } from 'next'
import { useRouter } from 'next/router'
import getRawBody from 'raw-body'
import { useEffect } from 'react'

export interface IContentType {
  [x: string]: string | undefined
}

interface IResultDataType {
  data: IContentType
}

const AppCallback = (props: IResultDataType) => {
  const router = useRouter()
  const { data } = props

  const handleAppPayCallback = async () => {
    try {
      const token = localStorage.getItem(appTokenLocalKey)
      if (token) {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_APPGATEWAY}/App/Payment/payment/callback`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
            method: 'POST',
            body: JSON.stringify({
              paymentProviderId: router.query?.providerType?.[0],
              jsonResult: JSON.stringify(data),
            }),
          },
        )
        const result = await res.json()

        if (result?.success && result?.data)
          router.replace(`/payment/app/result/${result.data?.paymentId}`)
        else
          openToast({
            message: result?.messages?.[0]?.message,
            type: 'error',
            vertical: 'top',
          })
      }
    } catch (error) {}
  }
  useEffect(() => {
    if (data) handleAppPayCallback()
  }, [data])

  return <CommerceLoading />
}

AppCallback.layout = ({ children }: any) => <>{children}</>
export default AppCallback

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  let ipgData

  if (ctx.req.method == 'POST') {
    const body = await getRawBody(ctx.req)
    const data = decodeURI(body.toString('utf-8')).split('&')
    const parseData = data.reduce((prev, current) => {
      const pair = current.split('=')
      const key = pair[0]
      const value = decodeURIComponent(pair[1] || '')
      if (prev[key]) {
        if (Object.prototype.toString.call(prev[key]) === '[object Array]') {
          prev[key].push(value)
        } else {
          prev[key] = [prev[key], value]
        }
      } else {
        prev[key] = value
      }
      return prev
    }, {} as any)

    ipgData = parseData
  }

  return {
    props: { data: ipgData ?? null },
  }
}
