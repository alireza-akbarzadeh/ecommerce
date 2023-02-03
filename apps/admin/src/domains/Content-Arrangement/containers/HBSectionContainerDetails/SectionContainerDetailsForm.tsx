import { BusinessTypeEnums } from '@hasty-bazar/admin-shared/core/enums'
import phrasesMessages from '@hasty-bazar-admin/core/translations/phrases.messages'
import {
  CreateSectionModel,
  useGetAdminCmsWidgetsQuery,
} from '@hasty-bazar/admin-shared/services/cmsApi.generated'
import { useGetAdminGeneralDataCollectionTypesFilteredQuery } from '@hasty-bazar/admin-shared/services/generalDataApi.generated'
import { HBForm, HBSelectProps, openToast } from '@hasty-bazar/core'
import { useRouter } from 'next/router'
import { useEffect, useMemo } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { useIntl } from 'react-intl'
import {
  useGetAdminCmsPagesSectionsByPageidSectionsAndIdQuery,
  usePostAdminCmsPagesSectionsByPageidSectionsMutation,
  usePutAdminCmsPagesSectionsByPageidSectionsAndIdMutation,
} from '../../cmsApi.generated.enhanced'
import useFetchData from '../../hooks/useFetchData'
import { SelectBoxOptionsType } from '../HBCreatorWidget'
import SectionContainerDetailsFormItem from './SectionContainerDetailsFormItem'

type SectionContainerDetailsForm = {
  formProvider: UseFormReturn
  pagePartFormProvider: UseFormReturn
}

export type SectionContainerDetailsFormType = Omit<
  CreateSectionModel,
  'outputQueryType' | 'pageDisplayType'
> & {
  widgetId?: {
    value?: number
  }
  outputQueryType?: {
    value?: number
  }
  pageDisplayType?: {
    id?: number
  }
}

export default function SectionContainerDetailsForm({
  formProvider,
  pagePartFormProvider,
}: SectionContainerDetailsForm) {
  const { formatMessage } = useIntl()
  const { reset } = formProvider
  const { platFormTypes } = useFetchData()
  const { query: { pagePartId, sectionId, pageId, action } = {}, push } = useRouter()
  const {
    data: { data } = {},
    isSuccess,
    isFetching,
    refetch,
  } = useGetAdminCmsPagesSectionsByPageidSectionsAndIdQuery(
    {
      id: sectionId as string,
      'client-name': 'cms',
      'client-version': '1',
      pageid: pageId as string,
    },
    {
      skip: !sectionId,
    },
  )

  const { data: widgetsdata } = useGetAdminCmsWidgetsQuery({
    'client-name': 'generalData',
    'client-version': '0',
    pageSize: 1000,
  })

  const widgetAutoCompleteItems = useMemo(
    () =>
      (widgetsdata?.data?.items?.map(({ displayName: title, id: value }) => ({
        title,
        value,
      })) || []) as HBSelectProps['menuItem'],
    [widgetsdata],
  )

  const { data: outputQueryTypeData } = useGetAdminGeneralDataCollectionTypesFilteredQuery({
    'client-name': 'generalData',
    'client-version': '0',
  })

  const outputQueryTypeItems = useMemo(
    () =>
      (outputQueryTypeData?.data?.items?.map((item: any) => ({
        title: item.title,
        value: item.fullCode,
      })) || []) as SelectBoxOptionsType,
    [outputQueryTypeData],
  )

  useEffect(() => {
    if (data && widgetsdata && outputQueryTypeData && !isFetching) {
      const { platformTypes } = data!
      const seletedPlatformTypes = platFormTypes?.filter(
        //@ts-ignore
        (item) => platformTypes?.indexOf(Number(item?.id!)) > -1,
      )

      const currentSectionData = {
        columnIndex: data?.columnIndex?.toString(),
        rowIndex: data?.rowIndex?.toString(),
        displayEndDate: data.displayEndDate,
        displayStartDate: data?.displayStartDate,
        displaySortOrder: data?.displaySortOrder?.toString(),
        isActive: data?.isActive,
        isPublished: data?.isPublished,
        name: data?.name,
        columnDistance: data?.columnDistance?.toString(),
        pagePartId: data?.pagePartId,
        widgetId: widgetAutoCompleteItems?.find((item) => item?.value === data?.widgetId),
        outputQueryType: outputQueryTypeItems?.find((item) => item?.value === data.outputQueryType),
        id: data?.id,
        isClosable: data?.isClosable,
        pageId: data?.pageId,
        platformTypes: seletedPlatformTypes,
        pageDisplayType: { id: data.pageDisplayType, title: data.pageDisplayTypeTitle },
      }
      if (action === 'edit') {
        reset(currentSectionData as unknown as SectionContainerDetailsForm)
      }
    }
  }, [isSuccess, isFetching, sectionId, widgetsdata, outputQueryTypeData])

  const [createSections, { reset: resetCreate }] =
    usePostAdminCmsPagesSectionsByPageidSectionsMutation()

  const [updateSections, { reset: resetUpdate }] =
    usePutAdminCmsPagesSectionsByPageidSectionsAndIdMutation()

  const handleSubmit = (
    data: SectionContainerDetailsFormType & {
      id: string
      pageId: string
    },
  ) => {
    resetCreate()
    resetUpdate()
    const { platformTypes, pageDisplayType, ...otherData } = data
    if (action === 'create') {
      createSections({
        'client-name': 'cms',
        'client-version': '0',
        pageid: pageId as string,
        createSectionModel: {
          ...otherData,
          pagePartId,
          //@ts-ignore
          platformTypes: platformTypes.map((item) => Number(item.id)),
          widgetId: data?.widgetId?.value,
          outputQueryType: data?.outputQueryType?.value || 0,
          pageDisplayType: pageDisplayType?.id,
        } as CreateSectionModel,
      }).then((res: any) => {
        if (res && res?.data?.success) {
          push({
            pathname: '/content-management/edit/',
            query: { sectionId: res.data.data?.id, pageId, pagePartId },
          })
        }
      })
    }
    if (action === 'edit') {
      updateSections({
        'client-name': 'cms',
        'client-version': '1',
        pageid: data.pageId as string,
        id: data.id,
        updateSectionModel: {
          ...otherData,
          //@ts-ignore
          platformTypes: platformTypes.map((item) => Number(item.id)),
          widgetId: data?.widgetId?.value,
          outputQueryType: data?.outputQueryType?.value || 0,
          pageDisplayType: pageDisplayType?.id,
        },
      }).then((res: any) => {
        if (res && res?.data?.success) {
          openToast({ type: 'success', message: formatMessage(phrasesMessages.successAdd) })
          refetch()
        }
      })
    }
  }

  return (
    <HBForm<SectionContainerDetailsFormType>
      id="content-management-section-form"
      onSubmit={handleSubmit}
      formProviderProps={formProvider}
      defaultValues={data as any}
    >
      <SectionContainerDetailsFormItem
        refetch={refetch}
        stateCode={'0'}
        widgetItems={widgetsdata?.data?.items!}
        widgetAutoCompleteItems={widgetAutoCompleteItems}
        outputQueryTypeItems={outputQueryTypeItems}
        formProvider={formProvider}
        pagePartFormProvider={pagePartFormProvider}
      />
    </HBForm>
  )
}
