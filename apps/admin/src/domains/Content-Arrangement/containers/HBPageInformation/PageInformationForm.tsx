import phrasesMessages from '@hasty-bazar-admin/core/translations/phrases.messages'
import {
  CreatePageModel,
  ClonePagePartsFromTemplateCommand,
} from '@hasty-bazar/admin-shared/services/cmsApi.generated'
import { HBForm, openToast } from '@hasty-bazar/core'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { useIntl } from 'react-intl'
import {
  useGetAdminCmsPagesByIdQuery,
  usePostAdminCmsPagesClonePagePartsMutation,
  usePutAdminCmsPagesUpdatePageMutation,
} from '../../cmsApi.generated.enhanced'
import useFetchData from '../../hooks/useFetchData'
import PageInformationFormItem from './PageInformationFormItem'

type PageInformationForm = {
  formProvider: UseFormReturn
}

interface formData extends Omit<ClonePagePartsFromTemplateCommand, 'templatePageId'> {
  templatePageId: { id: string; name: string }
}

export default function PageInformationForm({ formProvider }: PageInformationForm) {
  const { reset } = formProvider
  const { query: { pageId, action } = {}, push } = useRouter()
  const { platFormTypes, templatePages } = useFetchData()
  const { formatMessage } = useIntl()

  const {
    data: { data: pageData } = {},
    refetch,
    isFetching,
  } = useGetAdminCmsPagesByIdQuery(
    {
      id: pageId as string,
      'client-name': 'cms',
      'client-version': '1',
    },
    {
      skip: !pageId,
    },
  )

  const [createPage] = usePostAdminCmsPagesClonePagePartsMutation()

  const [updatePage] = usePutAdminCmsPagesUpdatePageMutation()

  const handleSubmit = (data: formData) => {
    const { platformTypes, templatePageId, ...otherData } = data
    if (action === 'create') {
      createPage({
        'client-name': 'cms',
        'client-version': '0',
        clonePagePartsFromTemplateCommand: {
          ...otherData,
          //@ts-ignore
          platformTypes: (platformTypes as any).map((item) => Number(item.id)),
          templatePageId: templatePageId?.id,
        },
      }).then((res: any) => {
        if (res && res?.data?.success) {
          openToast({ type: 'success', message: formatMessage(phrasesMessages.successAdd) })
          push({
            pathname: '/content-management/edit/',
            query: { pageId: res?.data?.data?.id },
          })
        }
      })
    }
    if (action === 'edit') {
      updatePage({
        'client-name': 'cms',
        'client-version': '1',
        pageid: pageData?.id!,
        updatePageModel: {
          ...otherData,
          //@ts-ignore
          platformTypes: (platformTypes as any).map((item) => Number(item.id)),
        },
      }).then((res: any) => {
        if (res && res?.data?.success) {
          openToast({ type: 'success', message: formatMessage(phrasesMessages.successUpdate) })
        }
      })
    }
  }

  useEffect(() => {
    if (pageData && platFormTypes && !isFetching && action !== 'create') {
      const { platformTypes, templateName, templateId, ...otherData } = pageData!
      const seletedPlatformTypes = platFormTypes?.filter(
        //@ts-ignore
        (item) => platformTypes?.indexOf(Number(item?.id!)) > -1,
      )
      const templatePage = templatePages?.filter((item) => item.id == templateId)[0]
      reset({ ...otherData, platformTypes: seletedPlatformTypes, templatePageId: templatePage })
    }
  }, [platFormTypes, pageId, isFetching])

  useEffect(() => {
    if (action === 'create' && !pageId) {
      reset({})
    }
  }, [action])

  return (
    <HBForm<CreatePageModel>
      id="content-management-page-form"
      onSubmit={handleSubmit}
      formProviderProps={formProvider}
    >
      <PageInformationFormItem refetch={refetch} stateCode={pageData?.stateCode!} />
    </HBForm>
  )
}
