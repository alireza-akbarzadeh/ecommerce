import { FC, PropsWithChildren, ReactNode, useEffect, useState } from 'react'

interface IFakeSuspense {
  delay: number
  fallback?: ReactNode
}
const FakeSuspense: FC<PropsWithChildren<IFakeSuspense>> = ({
  delay,
  children,
  fallback = <></>,
}) => {
  const [isShown, setIsShown] = useState(false)

  useEffect(() => {
    setTimeout(() => {
      setIsShown(true)
    }, delay)
  }, [delay])

  return <>{isShown ? children : fallback}</>
}

export default FakeSuspense
