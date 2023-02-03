import { CommerceLoading } from '@hasty-bazar-commerce/components'
import { ApiConstants } from '@hasty-bazar-commerce/core/constants'
import { usePostWebPaymentPaymentCallbackMutation } from '@hasty-bazar-commerce/services/paymentApi.generated'
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

const CallbackTest = (props: IResultDataType) => {
  const router = useRouter()
  const { data } = props
  const [paymentCallbackMutation] = usePostWebPaymentPaymentCallbackMutation()

  useEffect(() => {
    if (data) {
      paymentCallbackMutation({
        ...ApiConstants,
        paymentCallBackModel: {
          paymentProviderId: router.query?.providerType?.[0],
          jsonResult: JSON.stringify(data),
        },
      })
        .unwrap()
        .then((payload) => {
          if (payload.success) {
            router.replace(`/payment/result/${payload.data?.paymentId}`)
          }
        })
    }
  }, [data])

  return <CommerceLoading />
}

CallbackTest.layout = ({ children }: any) => <>{children}</>
export default CallbackTest

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  let ipgData

  if (ctx.req.method === 'POST') {
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
