import { wrapper } from '@hasty-bazar-commerce/core/redux/store'
import { serverSideRequests } from '@hasty-bazar-commerce/core/utils'
import { ResultPage } from '@hasty-bazar-commerce/domains/Result'
import { GetServerSideProps } from 'next'
import { FC } from 'react'

interface IResultDataType {
  paymentId: string
}

const Result: FC<IResultDataType> = (props) => {
  return <ResultPage paymentId={props.paymentId} />
}

export default Result

export const getServerSideProps: GetServerSideProps = wrapper.getServerSideProps(
  (store) => async (ctx) => {
    const { props } = await serverSideRequests(store, ctx)

    return { props: { ...props, paymentId: ctx.query?.paymentId?.[0] } }
  },
)
