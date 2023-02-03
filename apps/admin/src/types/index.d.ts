import { AppProps } from 'next/app'

declare type CustomAppProps = AppProps & {
  session: Session
  initialReduxState: any
}
