import { DownloadMethodType } from '@hasty-bazar/admin-shared/containers/HBDataGrid/useDataGrid'
import phrasesMessages from '@hasty-bazar-admin/core/translations/phrases.messages'
import useToast from '@hasty-bazar/admin-shared/hooks/useToast'
import { errorsToString } from '@hasty-bazar/admin-shared/utils'
import { downloadExcelUrl } from '@hasty-bazar/admin-shared/utils/downloadUrl'
import { openToast } from '@hasty-bazar/core'
import HBGrigToolbarItem from 'libs/core/src/components/HBGrigToolbar/components/HBGrigToolbarItem'
import HBGridToolbar from 'libs/core/src/components/HBGrigToolbar/HBGrigToolbar'
import { useRouter } from 'next/router'
import { isEmpty } from 'ramda'
import { Dispatch, SetStateAction, useEffect } from 'react'
import { useIntl } from 'react-intl'
import megaMenuMessages from '../../MegaMenu.messages'
import { useDeleteAdminCmsMenugroupsByMenuGroupIdRemoveMenuItemAndMenuItemIdMutation } from '../../menuApi.enhanced'
import { formId } from '../../TreeStructurePage'

type PageTitleBarProps = {
  refetchTree: () => void
  setSelectedNodeId: Dispatch<SetStateAction<string>>
}
export default function PageTitleBar({ refetchTree, setSelectedNodeId }: PageTitleBarProps) {
  const { formatMessage } = useIntl()
  const router = useRouter()
  const menuGroupId = router?.query?.menuGroupId?.[0] || ''
  const menuId = (router?.query?.menuId as string) || ''
  const { showToast } = useToast()
  const goToAddPage = () => {
    setSelectedNodeId('')
    router.push({
      pathname: `/mega-menu/structure/${menuGroupId}/add`,
    })
  }

  const [deleteMenuItem, { error: deleteError }] =
    useDeleteAdminCmsMenugroupsByMenuGroupIdRemoveMenuItemAndMenuItemIdMutation()

  const deleteMenu = () => {
    deleteMenuItem({
      'client-name': 'delete-menu-item',
      'client-version': '1.0.0',
      menuGroupId,
      menuItemId: menuId,
    })
      //@ts-ignore
      .then((res: any) => {
        if (res?.data?.success) {
          openToast({ message: formatMessage(phrasesMessages.successDelete), type: 'success' })
          setSelectedNodeId('')
          router.push({
            pathname: `/mega-menu/structure/${menuGroupId}/add`,
          })
        }
      })
      .catch(() => {})
      .finally(() => {})
  }

  useEffect(() => {
    if (deleteError) {
      if (!isEmpty(deleteError)) {
        showToast(errorsToString(deleteError), 'error')
      }
    }
  }, [deleteError])

  const refreshMenus = () => {
    refetchTree()
  }

  const [downloadFile] = usePostAdminCmsMenugroupsDownloadExcelMenuitemMutation()
  const handleDownload = async (props: DownloadMethodType) => {
    const { filterFields, ...res } = props
    // TODO: some web service has been changes and we need to fix it
    // @ts-ignore
    return await downloadFile?.({
      'client-name': 'hasty-bazar-admin',
      'client-version': '1.0.0',
      getMenuItemsExcellQueryFilter: {
        ...res,
        ...filterFields,
      },
    })
  }

  const handleDownloadPage = (isDownloadAll?: boolean) => {
    handleDownload({
      filter: undefined,
      ordering: undefined,
      headers: [
        { faName: formatMessage(megaMenuMessages.code), nativeName: 'code' },
        { faName: formatMessage(megaMenuMessages.title), nativeName: 'title' },
        {
          faName: formatMessage(megaMenuMessages.displaySortOrder),
          nativeName: 'displaySortOrder',
        },
        { faName: formatMessage(megaMenuMessages.isLeaf), nativeName: 'isLeaf' },
        { faName: formatMessage(megaMenuMessages.recallType), nativeName: 'recallType' },
        { faName: formatMessage(megaMenuMessages.businessQuery), nativeName: 'queryId' },
        { faName: formatMessage(megaMenuMessages.pageQuery), nativeName: 'pageId' },
        { faName: 'productCategories', nativeName: 'productCategories' },
        { faName: formatMessage(megaMenuMessages.url), nativeName: 'url' },
      ],
      pageNumber: 1,
      pageSize: 100000,
      filterFields: {},
    }).then((res: any) => {
      if (res?.data?.success) {
        const url = res?.data?.data?.excelFile
        downloadExcelUrl(url)
      }
    })
  }

  return (
    <HBGridToolbar
      searchProps={{ show: false }}
      editProps={{ show: false }}
      addProps={{ onClick: goToAddPage }}
      deleteProps={{ onClick: deleteMenu }}
      refreshProps={{ onClick: refreshMenus }}
      items={[
        {
          label: formatMessage(phrasesMessages.downloadAll),
          icon: 'fileDownloadAlt',
          onClick: () => handleDownloadPage(true),
        },
      ]}
    >
      <HBGrigToolbarItem
        icon="check"
        tooltip={formatMessage(phrasesMessages.create)}
        form={formId}
        type={'submit'}
      />
    </HBGridToolbar>
  )
}
//TODO: web service has been changed and this code is not working
function usePostAdminCmsMenugroupsDownloadExcelMenuitemMutation() {
  return [{}, {}]
}
