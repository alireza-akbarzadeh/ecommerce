import { useRouter } from 'next/router'
import UserCategoriesForm from '../userCategoriesForm'
const UserCategoriesAddEdit = () => {
  const { query } = useRouter()
  const id = query?.id?.[0] ?? ('' as string)

  return <UserCategoriesForm {...{ id }} />
}

export default UserCategoriesAddEdit
