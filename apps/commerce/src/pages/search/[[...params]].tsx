import { wrapper } from '@hasty-bazar-commerce/core/redux/store'
import { serverSideRequests } from '@hasty-bazar-commerce/core/utils'
import { SearchPage } from '@hasty-bazar-commerce/domains/Search'
import { SearchFilterLayout } from '@hasty-bazar-commerce/layout/SearchFilterLayout'
import { GetServerSideProps } from 'next'

const Search = () => {
  return <SearchPage />
}

Search.layout = ({ children }: any) => <SearchFilterLayout>{children}</SearchFilterLayout>

export default Search

export const getServerSideProps: GetServerSideProps = wrapper.getServerSideProps(
  (store) => async (ctx) => {
    const { props } = await serverSideRequests(store, ctx)
    return { props }
  },
)
