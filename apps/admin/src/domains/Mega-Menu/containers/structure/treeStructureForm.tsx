import Grid from '@mui/material/Grid'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { useFormContext } from 'react-hook-form'
import TreeStructureFormItems from './TreeStructureFormItems'

const TreeStructureForm = ({ menuItemsData = [] }: any) => {
  const router = useRouter()
  const { reset } = useFormContext()
  const menuId = router?.query?.menuId
  const action = router?.query?.menuGroupId?.[1] === 'add' ? 'add' : 'edit'

  useEffect(() => {
    if (menuItemsData.length) {
      if (menuId && action === 'edit') {
        //@ts-ignore
        const selectedItem = menuItemsData?.find((item) => item.id === menuId)
        const currentSectionData = {
          code: selectedItem?.code,
          title: selectedItem?.title,
          displaySortOrder: selectedItem?.displaySortOrder,
          isLeaf: selectedItem?.isLeaf,
          recallType: selectedItem?.recallType,
          pageId: selectedItem?.pageId,
          productCategories: selectedItem?.productCategories,
          queryId: selectedItem?.queryId,
          url: selectedItem?.url ?? '',
        }
        reset(currentSectionData)
      } else {
        reset({
          code: '',
          title: '',
          displaySortOrder: undefined,
          isLeaf: false,
          recallType: null,
          url: '',
        })
      }
    }
  }, [menuItemsData, menuId, action])

  return (
    <Grid container spacing={6}>
      <TreeStructureFormItems action={action} />
    </Grid>
  )
}

export default TreeStructureForm
