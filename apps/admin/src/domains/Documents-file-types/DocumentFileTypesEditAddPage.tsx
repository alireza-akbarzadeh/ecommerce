import { BreadCrumbSection } from '@hasty-bazar/admin-shared/components/BreadCrumb'
import { HBRecordHistory } from '@hasty-bazar/admin-shared/containers'
import phrasesMessages from '@hasty-bazar-admin/core/translations/phrases.messages'
import useToast from '@hasty-bazar/admin-shared/hooks/useToast'
import {
  UpdateFileTypeModel,
  useGetAdminCmsFileTypesByIdQuery,
  usePostAdminCmsFileTypesMutation,
  usePutAdminCmsFileTypesByIdMutation,
} from '@hasty-bazar/admin-shared/services/cmsApi.generated'
import { errorsToString } from '@hasty-bazar/admin-shared/utils'
import { HBForm } from '@hasty-bazar/core'
import { Box } from '@mui/material'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useIntl } from 'react-intl'
import DocumentFileTypesAddEditForm from './containers/DocumentFileTypesAddEditForm'
import documentsPageMessages from './Documents-File-Types.messages'

export type DocumentsFileTypesFormType = UpdateFileTypeModel & {
  id?: string
}

export default function DocumentAdd({ id }: { id?: string }) {
  const router = useRouter()
  const { formatMessage } = useIntl()
  const [addDocument] = usePostAdminCmsFileTypesMutation()
  const [updateDocument] = usePutAdminCmsFileTypesByIdMutation()
  const { showToast } = useToast()
  const FormProvider = useForm({ mode: 'all' })

  const { data: documentData, refetch } = useGetAdminCmsFileTypesByIdQuery(
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
      url: '/documents-file-types',
      title: formatMessage(documentsPageMessages.documentFileTypesPageTitle),
    },
    {
      url: '#',
      title: id
        ? formatMessage(documentsPageMessages.editDocuments)
        : formatMessage(documentsPageMessages.addDocuments),
    },
  ]

  const handleSubmit = (data: DocumentsFileTypesFormType) => {
    if (id) {
      updateDocument({
        'client-name': 'cms',
        'client-version': 'v1',
        id,
        updateFileTypeModel: {
          ...data,
        },
      }).then((res: any) => {
        if (res?.data?.success) {
          showToast(formatMessage(documentsPageMessages.updateSuccess), 'success')
          refetch()
        } else
          showToast(
            errorsToString(res.error) || formatMessage(documentsPageMessages.updateError),
            'error',
          )
      })
    } else {
      addDocument({
        'client-name': 'cms',
        'client-version': 'v1',
        createFileTypeModel: {
          ...data,
        },
      }).then((res: any) => {
        if (res?.data?.success) {
          showToast(formatMessage(documentsPageMessages.addSuccess), 'success')
          router.replace(`/documents-file-types`)
        } else
          showToast(
            errorsToString(res.error) || formatMessage(documentsPageMessages.addError),
            'error',
          )
      })
    }
  }

  useEffect(() => {
    if (id) {
      FormProvider.reset({
        ...documentData?.data,
      })
    }
  }, [documentData])

  return (
    <>
      <BreadCrumbSection
        title={formatMessage(documentsPageMessages.documentFileTypesPageTitle)}
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
        <HBForm<DocumentsFileTypesFormType>
          onSubmit={handleSubmit}
          mode="all"
          defaultValues={{
            isActive: true,
            id,
          }}
          formProviderProps={id ? FormProvider : undefined}
        >
          <DocumentFileTypesAddEditForm documentId={id} />
        </HBForm>
      </Box>
      <HBRecordHistory data={documentData?.data} isBorder isShowAccordion disabled={!id} />
    </>
  )
}
