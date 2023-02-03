import { CommerceLoading } from '@hasty-bazar-commerce/components'
import usePay, { appTokenLocalKey } from '@hasty-bazar-commerce/core/hook/usePay'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

const AppPay = () => {
  const router = useRouter()
  const { runAppPay } = usePay()

  const handelAppPayment = () => {
    localStorage.setItem(appTokenLocalKey, router?.query?.appToken as string)
    runAppPay({
      paymentId: router?.query?.paymentId?.[0] ?? '',
      token: (router?.query?.appToken as string) ?? '',
    })
  }
  useEffect(() => {
    if (router?.query?.appToken) {
      handelAppPayment()
    }
  }, [router?.query])

  return <CommerceLoading />
}
AppPay.layout = ({ children }: any) => <>{children}</>
export default AppPay
