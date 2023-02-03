import { BreadCrumbSection } from '@hasty-bazar/admin-shared/components/BreadCrumb'
import { HBRecordHistory } from '@hasty-bazar/admin-shared/containers'
import phrasesMessages from '@hasty-bazar-admin/core/translations/phrases.messages'
import useToast from '@hasty-bazar/admin-shared/hooks/useToast'
import {
  GetDocumentQueryResult,
  useGetAdminCmsDocumentsByIdQuery,
  usePostAdminCmsDocumentsMutation,
  usePutAdminCmsDocumentsByIdMutation,
} from '@hasty-bazar/admin-shared/services/cmsApi.generated'
import { useGetAdminGeneralDataBusinessEntitiesQuery } from '@hasty-bazar/admin-shared/services/generalDataApi.generated'
import { errorsToString } from '@hasty-bazar/admin-shared/utils'
import { HBForm } from '@hasty-bazar/core'
import { Box } from '@mui/material'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useIntl } from 'react-intl'
import DocumentAddEditForm from './containers/DocumentAddEditForm'
import documentsPageMessages from './Documents-Attributes.messages'

export type DocumentsFormType = Omit<GetDocumentQueryResult, 'entityTypeCode'> & {
  id?: string
  entityTypeCode?: {
    id?: string
  }
}

export default function DocumentAdd({ id }: { id?: string }) {
  const router = useRouter()
  const { formatMessage } = useIntl()
  const [addDocument] = usePostAdminCmsDocumentsMutation()
  const [updateDocument] = usePutAdminCmsDocumentsByIdMutation()
  const { showToast } = useToast()
  const FormProvider = useForm({ mode: 'all' })

  const { data: documentData, refetch } = useGetAdminCmsDocumentsByIdQuery(
    {
      'client-name': 'admin',
      'client-version': '1.0.0',
      id: id!,
    },
    { skip: !id },
  )

  const breadcrumbs = [
    {
      url: '/',
      title: formatMessage(phrasesMessages.dashboard),
    },
    {
      url: '/documents-attributes',
      title: formatMessage(documentsPageMessages.documentPageTitle),
    },
    {
      url: '#',
      title: id
        ? formatMessage(documentsPageMessages.editDocuments)
        : formatMessage(documentsPageMessages.addDocuments),
    },
  ]

  const handleSubmit = (
    data: DocumentsFormType & {
      [key: string]: any
    },
  ) => {
    Object.keys(data).forEach((key: string) => {
      if (typeof data[key] === 'object') {
        data[key] = data[key]?.id || data[key]?.value
      }
    })

    Object.keys(data).forEach((key: string) => {
      if (data[key] === '' || data[key] === undefined) {
        data[key] = null
      }
    })

    if (id) {
      updateDocument({
        'client-name': 'cms',
        'client-version': 'v1',
        id,
        // @ts-ignore
        updateDocumentModel: {
          ...data,
        },
      })
        .unwrap()
        .then((res) => {
          if (res?.success) {
            showToast(formatMessage(documentsPageMessages.updateSuccess), 'success')
            router.push('/documents-attributes')
          }
        })
    } else {
      addDocument({
        'client-name': 'cms',
        'client-version': 'v1',
        // TODO: some web service has been changed and we need to send entityTypeId instead of entityTypeEnum
        // @ts-ignore
        createDocumentModel: {
          ...data,
        },
      }).then((res: any) => {
        if (res?.data?.success) {
          showToast(formatMessage(documentsPageMessages.addSuccess), 'success')
          router.replace(`/documents-attributes`)
        } else
          showToast(
            errorsToString(res.error) || formatMessage(documentsPageMessages.addError),
            'error',
          )
      })
    }
  }

  const { data: relatedData } = useGetAdminGeneralDataBusinessEntitiesQuery({
    'client-name': 'admin',
    'client-version': '1.0.0',
    pageSize: 1000,
  })

  useEffect(() => {
    if (id) {
      FormProvider.reset({
        ...documentData?.data,
        typeOfUseCode: documentData?.data?.typeOfUseCode?.toString(),
      })
    }
  }, [documentData, relatedData])

  return (
    <>
      <BreadCrumbSection
        title={formatMessage(documentsPageMessages.documentPageTitle)}
        breadItems={breadcrumbs}
      />
      <Box
        bgcolor="common.white"
        px={8}
        pt={6}
        pb={10}
        sx={{
          borderRadius: 1,
          border: (theme) => `1px solid ${theme.palette.grey[200]}`,
          minHeight: 300,
        }}
      >
        <HBForm<DocumentsFormType>
          onSubmit={handleSubmit}
          mode="all"
          defaultValues={{
            isActive: true,
            id,
          }}
          formProviderProps={id ? FormProvider : undefined}
        >
          <DocumentAddEditForm relatedData={relatedData} refetch={refetch} />
        </HBForm>
      </Box>
      <HBRecordHistory data={documentData?.data} isBorder isShowAccordion disabled={!id} />
    </>
  )
}
