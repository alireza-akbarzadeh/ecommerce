import { DownloadMethodType } from '@hasty-bazar/admin-shared/containers/HBDataGrid/useDataGrid'
import phrasesMessages from '@hasty-bazar-admin/core/translations/phrases.messages'
import { DataGrigToolbarCallbackProps } from '@hasty-bazar-admin/domains/Geographical/components/DataGrigToolbar'
import { usePostAdminCmsPagesDownloadExcelFileMutation } from '@hasty-bazar/admin-shared/services/cmsApi.generated'
import { downloadExcelUrl } from '@hasty-bazar/admin-shared/utils/downloadUrl'
import { HBDialog, openToast } from '@hasty-bazar/core'
import HBGrigToolbarItem from 'libs/core/src/components/HBGrigToolbar/components/HBGrigToolbarItem'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { useIntl } from 'react-intl'
import {
  useDeleteAdminCmsPagesDeletePageMutation,
  useDeleteAdminCmsPagesPagePartsByPageidPagepartsAndIdMutation,
  useDeleteAdminCmsPagesSectionsByPageidSectionsAndIdMutation,
} from '../cmsApi.generated.enhanced'
import DataGrigToolbar from '../components/DataGrigToolbar'
import ContentManagementPageMessages from '../ContentManagementPage.messages'
import useFetchData from '../hooks/useFetchData'
import SectionContainerDetailsMessages from './HBSectionContainerDetails/SectionContainerDetailsFormItem.messages'

type SectionContainerDetailsForm = {
  sectionFormProvider: UseFormReturn
  pageFormProvider: UseFormReturn
  pagePartFormProvider: UseFormReturn
}

export default function PageTitleBar({
  sectionFormProvider,
  pageFormProvider,
  pagePartFormProvider,
}: SectionContainerDetailsForm) {
  const [deleteDialog, setDeleteDialog] = useState<boolean>(false)
  const router = useRouter()
  const action = router.query.action as string
  const sectionId = router.query.sectionId as string
  const pageId = router.query?.pageId as string
  const pagePartId = router.query?.pagePartId as string
  const { formatMessage } = useIntl()
  const { expandedPage, expandedPagePart, expandedSection } = useFetchData()

  const getFormId = (pageId: string, pagePartId: string, sectionId: string) => {
    let formId = 'content-management-page-form'
    if (action === 'create') {
      if (pageId && pagePartId) {
        formId = 'content-management-section-form'
      } else if (pageId) {
        formId = 'content-management-pagePart-form'
      }
    } else if (action === 'edit') {
      if (pageId && pagePartId && sectionId) {
        formId = 'content-management-section-form'
      } else if (pageId && pagePartId) {
        formId = 'content-management-pagePart-form'
      }
    }
    return formId
  }
  const {
    formState: { isDirty: sectionIsDirty, isValid: sectionIsValid },
  } = sectionFormProvider

  const {
    formState: { isDirty: pageIsDirty, isValid: pageIsValid },
  } = pageFormProvider

  const {
    formState: { isDirty: pagePartIsDirty, isValid: pagePartIsValid },
  } = pagePartFormProvider

  const [deleteSection, { reset }] = useDeleteAdminCmsPagesSectionsByPageidSectionsAndIdMutation()
  const [deletePage] = useDeleteAdminCmsPagesDeletePageMutation()
  const [deletePagePart] = useDeleteAdminCmsPagesPagePartsByPageidPagepartsAndIdMutation()
  const handleDelete = () => {
    if (expandedPage) {
      deletePage({
        'client-name': 'hasty-bazar-admin',
        'client-version': '1.0.0',
        pageid: pageId,
      }).then((res: any) => {
        if (res && res?.data?.success) {
          openToast({ type: 'success', message: formatMessage(phrasesMessages.successDelete) })
          setDeleteDialog(false)
          router.push({
            pathname: '/content-management/create',
          })
        }
      })
    } else if (expandedPagePart) {
      deletePagePart({
        'client-name': 'hasty-bazar-admin',
        'client-version': '1.0.0',
        pageid: pageId,
        id: pagePartId,
      }).then((res: any) => {
        if (res && res?.data?.success) {
          openToast({ type: 'success', message: formatMessage(phrasesMessages.successDelete) })
          setDeleteDialog(false)
          router.push({
            pathname: '/content-management/edit',
            query: { pageId },
          })
        }
      })
    } else if (expandedSection) {
      reset()
      deleteSection({
        'client-name': 'hasty-bazar-admin',
        'client-version': '1.0.0',
        pageid: pageId,
        id: sectionId,
      }).then((res: any) => {
        if (res && res?.data?.success) {
          openToast({ type: 'success', message: formatMessage(phrasesMessages.successDelete) })
          setDeleteDialog(false)
          router.push({
            pathname: '/content-management/edit',
            query: { pageId, pagePartId },
          })
        }
      })
    }
  }

  const [downloadFile] = usePostAdminCmsPagesDownloadExcelFileMutation()
  const handleDownload = async (props: DownloadMethodType) => {
    const { filterFields, ...res } = props
    return await downloadFile({
      'client-name': 'hasty-bazar-admin',
      'client-version': '1.0.0',
      getPagesExcelQueryFilter: {
        ...res,
        ...filterFields,
      },
    })
  }

  const handleDownloadPage = () => {
    handleDownload({
      filter: undefined,
      ordering: undefined,
      headers: [
        {
          faName: formatMessage(ContentManagementPageMessages.pageInformationTitle),
          nativeName: 'PageName',
        },
        {
          faName: formatMessage(ContentManagementPageMessages.pagePartTitle),
          nativeName: 'pagePartName',
        },
        {
          faName: formatMessage(ContentManagementPageMessages.sectionTitle),
          nativeName: 'sectionName',
        },
        {
          faName: formatMessage(SectionContainerDetailsMessages.displaySortOrder),
          nativeName: 'displaySortOrder',
        },
        {
          faName: formatMessage(SectionContainerDetailsMessages.displayStartDate),
          nativeName: 'displayStartDate',
        },
        {
          faName: formatMessage(SectionContainerDetailsMessages.displayEndDate),
          nativeName: 'displayEndDate',
        },
        { faName: formatMessage(SectionContainerDetailsMessages.rowIndex), nativeName: 'rowIndex' },
        {
          faName: formatMessage(SectionContainerDetailsMessages.columnIndex),
          nativeName: 'columnIndex',
        },
        { faName: formatMessage(SectionContainerDetailsMessages.isActive), nativeName: 'isActive' },
        {
          faName: formatMessage(SectionContainerDetailsMessages.outputQueryType),
          nativeName: 'outputQueryType',
        },
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

  const onClickAddChild = () => {
    router.push(
      {
        pathname: `/content-management/create`,
        query: {},
      },
      undefined,
      {
        shallow: true,
      },
    )
  }

  const getSubmitDisabled = () => {
    if (expandedPage) {
      return !pageIsDirty
    } else if (expandedPagePart) {
      return !pagePartIsDirty
    } else if (expandedSection) {
      return !sectionIsDirty
    }
  }

  return (
    <>
      <DataGrigToolbar
        deleteProps={{
          disabled: action !== 'edit' || expandedPagePart,
        }}
        addProps={{
          type: 'submit',
          form: getFormId(pageId, pagePartId, sectionId),
          tooltip: formatMessage(phrasesMessages.save),
          disabled: getSubmitDisabled(),
        }}
        editProps={{
          show: false,
        }}
        statusProps={{
          show: false,
        }}
        refreshProps={{}}
        onClick={({ type }: DataGrigToolbarCallbackProps) => {
          if (type === 'delete') {
            setDeleteDialog(true)
          }
        }}
        searchProps={{ show: false }}
        items={[
          {
            label: formatMessage(phrasesMessages.downloadAll),
            icon: 'fileDownloadAlt',
            onClick: () => handleDownloadPage(),
          },
        ]}
      >
        <HBGrigToolbarItem
          icon="plus"
          tooltip={formatMessage(ContentManagementPageMessages.addNewPage)}
          onClick={() => onClickAddChild()}
        />
      </DataGrigToolbar>
      <HBDialog
        content={formatMessage(ContentManagementPageMessages.areYouSure)}
        title={formatMessage(phrasesMessages.delete)}
        onAccept={() => handleDelete()}
        onReject={() => setDeleteDialog(false)}
        open={deleteDialog}
        onClose={() => setDeleteDialog(false)}
        acceptBtn={formatMessage(phrasesMessages.delete)}
        rejectBtn={formatMessage(phrasesMessages.cancel)}
      />
    </>
  )
}
