import { HBAdminAccordion } from '@hasty-bazar/admin-shared/components'
import { BreadCrumbSection } from '@hasty-bazar/admin-shared/components/BreadCrumb'
import {
  CollectionType,
  CreateCollectionModel,
  useGetAdminGeneralDataCollectionCollectionFieldsQuery,
} from '@hasty-bazar/admin-shared/services/generalDataApi.generated'
import { HBForm, openToast } from '@hasty-bazar/core'
import { Box } from '@mui/material'
import { useRouter } from 'next/router'
import { FC, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useIntl } from 'react-intl'
import collectionPageMessages from './CollectionPage.messages'
import { CollectionAddEditForm, CollectionQueryBuilder } from './containers'
import CollectionQueryResult from './containers/CollectionQueryResult'
import {
  useGetAdminGeneralDataCollectionByIdQuery,
  usePostAdminGeneralDataCollectionMutation,
  usePutAdminGeneralDataCollectionByIdMutation,
} from './generalDataApi.enhanced'
import { makeId } from './util'

export type CollectionAddEditFormType = CreateCollectionModel

const CollectionAddEditPage: FC = () => {
  const formProviderProps = useForm<CollectionAddEditFormType>({
    mode: 'all',
  })

  const router = useRouter()
  const id = router.query.id?.[0]
  const { formatMessage } = useIntl()
  const [expandedPreview, setExpandedPreview] = useState<boolean>(!!id)
  const [expandedQueryResult, setExpandedQueryResult] = useState<boolean>(!!id)
  const [refreshQueryResult, setRefreshQueryResult] = useState<string>('')
  const [refreshQueryBuilder, setRefreshQueryBuilder] = useState<string>('')

  const { data: collectionData } = useGetAdminGeneralDataCollectionByIdQuery(
    {
      'client-name': 'Swagger on HIT.Hastim.GeneralData.Endpoints.WebApi',
      'client-version': '1.0.1.100',
      id: id!,
    },
    {
      skip: !id,
    },
  )

  const [createCollection, { error: createError, data: createCollectionData }] =
    usePostAdminGeneralDataCollectionMutation()
  const [updateCollection, { error: updateError, data: updateCollectionData }] =
    usePutAdminGeneralDataCollectionByIdMutation()

  const { data: collectionFieldData, refetch: collectionFieldsRefetch } =
    useGetAdminGeneralDataCollectionCollectionFieldsQuery(
      {
        'client-name': 'Swagger on HIT.Hastim.GeneralData.Endpoints.WebApi',
        'client-version': '1.0.1.100',
        collectionType: formProviderProps.getValues('collectionType')!,
        withNestedProperties: true,
      },
      {
        skip: !formProviderProps.getValues('collectionType'),
      },
    )

  const breadcrumbs = [
    {
      url: '/',
      title: formatMessage(collectionPageMessages.dashbord),
    },
    {
      url: '/collection',
      title: formatMessage(collectionPageMessages.collection),
    },
    {
      url: '#',
      title: id
        ? formatMessage(collectionPageMessages.editCollection)
        : formatMessage(collectionPageMessages.addCollection),
    },
  ]

  useEffect(() => {
    if (createCollectionData?.success) {
      router.push(`/collection/edit/${createCollectionData?.data?.id}`)
    }
  }, [createCollectionData])

  useEffect(() => {
    if (updateCollectionData?.success) {
      openToast({ message: formatMessage(collectionPageMessages.successEdit), type: 'success' })
    }
  }, [updateCollectionData])

  const handleSubmit = async (values: CollectionAddEditFormType) => {
    const { collectionType, collectionSortOptionId, maxDisplayResult } = values
    let body = {
      ...values,
      query: {
        json: '',
        sql: '',
        mongo: '',
      },
      status: 0,
      isActive: true,
      collectionType: Number(collectionType),
      queryType: 1024001,
      collectionSortOptionId: collectionSortOptionId || null,
      maxDisplayResult: maxDisplayResult || null,
      hasCache: values.hasCache ?? false,
      cacheTimeToLive: values.cacheTimeToLive ?? 0,
    } as CollectionAddEditFormType

    if (!id) {
      createCollection({
        'client-name': 'Swagger on HIT.Hastim.Catalog.Endpoints.WebApi',
        'client-version': '1.0.1.100',
        createCollectionModel: body,
      })
    } else {
      const putModel: CollectionAddEditFormType = {
        name: values.name,
        code: values.code,
        collectionType: Number(values.collectionType) as CollectionType,
        maxDisplayResult: values.maxDisplayResult || null,
        query: collectionData?.data?.query,
        queryType: 1024001,
        collectionSortOptionId: values.collectionSortOptionId || null,
        originName: values.originName,
        hasCache: values.hasCache ?? false,
        cacheTimeToLive: values.cacheTimeToLive ?? 0,
      }
      updateCollection({
        'client-name': 'update-attribute',
        'client-version': '1.0.0',
        updateCollectionModel: putModel,
        id,
      }).then((res: any) => {
        if (res && res?.data?.success) {
          handleChangeCollectoin()
          handleChangeQuery()
        }
      })
    }
  }

  const handleChangeQuery = () => {
    setRefreshQueryResult(makeId(5))
  }

  const handleChangeCollectoin = () => {
    setRefreshQueryBuilder(makeId(5))
  }

  return (
    <>
      <BreadCrumbSection
        title={formatMessage(collectionPageMessages.collection)}
        breadItems={breadcrumbs}
      />
      <Box
        bgcolor="common.white"
        px={8}
        pt={6}
        pb={10}
        sx={{
          borderRadius: 4,
          border: (theme) => `1px solid ${theme.palette.grey[200]}`,
          minHeight: 300,
        }}
      >
        <HBForm<CollectionAddEditFormType>
          formProviderProps={formProviderProps}
          onSubmit={handleSubmit}
          defaultValues={{
            isActive: true,
          }}
          mode="all"
        >
          {<CollectionAddEditForm />}
        </HBForm>
      </Box>
      <HBAdminAccordion
        title={formatMessage(collectionPageMessages.categoriesOfFilters)}
        disabled={!id}
        expanded={expandedPreview && !!id}
        onChange={(event, expandedPreview) => {
          setExpandedPreview(expandedPreview)
        }}
      >
        <CollectionQueryBuilder
          collectionType={formProviderProps.getValues('collectionType')}
          formProviderProps={formProviderProps}
          collectionFieldData={collectionFieldData?.data}
          collectionFieldsRefetch={collectionFieldsRefetch}
          changeQuery={handleChangeQuery}
          key={refreshQueryBuilder}
        />
      </HBAdminAccordion>
      <HBAdminAccordion
        title={formatMessage(collectionPageMessages.collectionQueryResult)}
        disabled={!id}
        expanded={expandedQueryResult && !!id}
        onChange={(event, expandedPreview) => {
          setExpandedQueryResult(expandedPreview)
        }}
      >
        {id && (
          <CollectionQueryResult
            collectionType={formProviderProps.getValues('collectionType')}
            formProviderProps={formProviderProps}
            gridColumn={collectionFieldData?.data?.items
              ?.filter((item) => item.resultData?.showInCollectionResult)
              .map((item) => {
                return {
                  name: item.resultData?.gridFieldName!,
                  title: item.title!,
                  isShow: item.resultData?.isDefaultField!,
                  type: item?.dataTypeTitle!,
                }
              })}
            refreshQueryResult={refreshQueryResult}
            id={id}
          />
        )}
      </HBAdminAccordion>
    </>
  )
}
export default CollectionAddEditPage
