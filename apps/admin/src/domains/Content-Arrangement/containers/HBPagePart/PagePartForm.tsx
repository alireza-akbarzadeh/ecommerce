import phrasesMessages from '@hasty-bazar-admin/core/translations/phrases.messages'
import { UpdatePagePartModel } from '@hasty-bazar/admin-shared/services/cmsApi.generated'
import { HBForm, openToast } from '@hasty-bazar/core'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { useIntl } from 'react-intl'
import {
  useGetAdminCmsPagesPagePartsByPageidPagepartsAndIdQuery,
  usePostAdminCmsPagesPagePartsByPageidPagepartsMutation,
  usePutAdminCmsPagesPagePartsByPageidPagepartsAndIdMutation,
} from '../../cmsApi.generated.enhanced'
import useFetchData from '../../hooks/useFetchData'
import PagePartFormItem from './PagePartFormItem'

type PagePartForm = {
  formProvider: UseFormReturn
  pageFormProvider: UseFormReturn
}

export default function PageInformationForm({ formProvider, pageFormProvider }: PagePartForm) {
  const { reset } = formProvider
  const { query: { pagePartId, pageId, action } = {}, push } = useRouter()
  const { platFormTypes } = useFetchData()
  const { formatMessage } = useIntl()

  const { data: { data: pagePartData } = {} } =
    useGetAdminCmsPagesPagePartsByPageidPagepartsAndIdQuery(
      {
        id: pagePartId as string,
        pageid: pageId as string,
        'client-name': 'cms',
        'client-version': '1',
      },
      {
        skip: !pagePartId,
      },
    )

  const [createPageParts] = usePostAdminCmsPagesPagePartsByPageidPagepartsMutation()

  const [updatePageParts] = usePutAdminCmsPagesPagePartsByPageidPagepartsAndIdMutation()

  const handleSubmit = (data: UpdatePagePartModel) => {
    const { platformTypes, ...otherData } = data
    if (action === 'create') {
      createPageParts({
        'client-name': 'cms',
        'client-version': '1',
        pageid: pageId as string,
        createPagePartModel: {
          ...otherData,
          //@ts-ignore
          platformTypes: (platformTypes as any).map((item) => Number(item.id)),
        },
      }).then((res: any) => {
        if (res && res?.data?.success) {
          openToast({ type: 'success', message: formatMessage(phrasesMessages.successAdd) })
          push({
            pathname: '/content-management/edit/',
            query: { pageId, pagePartId: res?.data?.data?.id },
          })
        }
      })
    }
    if (action === 'edit') {
      updatePageParts({
        'client-name': 'cms',
        'client-version': '1',
        pageid: pageId as string,
        id: pagePartData?.id!,
        updatePagePartModel: {
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
    if (pagePartData && platFormTypes && pagePartId) {
      const { platformTypes, ...otherData } = pagePartData!
      const seletedPlatformTypes = platFormTypes?.filter(
        //@ts-ignore
        (item) => platformTypes?.indexOf(Number(item?.id!)) > -1,
      )
      reset({ ...otherData, platformTypes: seletedPlatformTypes })
    }
  }, [pagePartData, platFormTypes])

  useEffect(() => {
    if (action === 'create' && !pagePartId) {
      reset({ name: '', platformTypes: null, originName: '', sort: '' })
    }
  }, [action, pageId])

  return (
    <HBForm<UpdatePagePartModel>
      id="content-management-pagePart-form"
      onSubmit={handleSubmit}
      formProviderProps={formProvider}
    >
      <PagePartFormItem pageFormProvider={pageFormProvider} />
    </HBForm>
  )
}
