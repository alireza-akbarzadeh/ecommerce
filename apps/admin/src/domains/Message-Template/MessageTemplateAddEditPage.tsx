import { BreadCrumbSection } from '@hasty-bazar/admin-shared/components/BreadCrumb'
import { HBWorkflow } from '@hasty-bazar/admin-shared/containers'
import { StateMachineCode } from '@hasty-bazar/admin-shared/core/enums'
import phrasesMessages from '@hasty-bazar-admin/core/translations/phrases.messages'
import {
  ApiResult,
  CreateMessageTemplateResultApiResult,
  GetMessageTemplateQueryResult,
  ProtocolType,
  useGetAdminGeneralDataMessageTemplatesByIdQuery,
  useGetAdminGeneralDataMessageTemplatesGetStateInfoByStateCodeAndStateMachineCodeFactorQuery as useGetStateInfo,
  useGetAdminGeneralDataMessageTemplatesGetTransitionByEntityIdAndStateMachineCodeFactorQuery as useGetStateList,
  usePostAdminGeneralDataMessageTemplatesChangeStateMutation,
  usePostAdminGeneralDataMessageTemplatesMutation,
  usePutAdminGeneralDataMessageTemplatesByIdMutation,
} from '@hasty-bazar/admin-shared/services/generalDataApi.generated'
import { useGetAdminIdrPartiesMultiPartyQuery } from '@hasty-bazar/admin-shared/services/idrApi.generated'
import { HBForm, HBIcon, openToast } from '@hasty-bazar/core'
import { Box, Stack, Typography } from '@mui/material'
import { useRouter } from 'next/router'
import { FC, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useIntl } from 'react-intl'
import MessageTemplateAddEditForm from './containers/MessageTemplateAddEditForm'
import messageTemplatePageMessages from './MessageTemplate.messages'

export type MessageTemplateType = {
  name: string
  protocolType: ProtocolType
  subject: string
  messageBody: string
  attachmentURLs?: string
  receivers?: string
  hasDefaultReceiver: boolean
}

const MessageTemplateAddEditPage: FC = () => {
  const { formatMessage } = useIntl()
  const router = useRouter()
  const id = router.query.id?.[0]
  const FormProvider = useForm({ mode: 'all' })

  const { data, refetch } = useGetAdminGeneralDataMessageTemplatesByIdQuery(
    {
      'client-name': '',
      'client-version': '',
      id: id as string,
    },
    { skip: !id },
  )

  const { data: receiversData } = useGetAdminIdrPartiesMultiPartyQuery(
    {
      'client-name': 'Swagger on HIT.Hastim.IDR.Endpoints.AdminApi',
      'client-version': '1.0.1.100',
      //@ts-ignore//
      userIds: data?.data?.receivers,
      pageSize: 100000,
    },
    { skip: !id || !data?.data?.receivers },
  )

  useEffect(() => {
    if (id && !!data?.data && (!data?.data?.receivers || !!receiversData?.data)) {
      FormProvider.reset({
        ...data?.data,
        hasDefaultReceiver: (data?.data as GetMessageTemplateQueryResult)?.hasDefaultReceiver
          ? 1
          : 0,
        receivers: receiversData?.data?.items,
      })
    }
  }, [data?.data, receiversData?.data])

  const [putMessageTemplate] = usePutAdminGeneralDataMessageTemplatesByIdMutation()
  const [postMessageTemplate] = usePostAdminGeneralDataMessageTemplatesMutation()

  const handleSubmit = async (values: MessageTemplateType) => {
    const { receivers, hasDefaultReceiver, ...otherValues } = values
    let receiversId = ''
    !!receivers &&
      (receivers as any)?.forEach((item: any, index: number) => {
        receiversId += index !== (receivers as any).length - 1 ? `${item.id},` : item.id
      })
    const createUpdateModel = {
      ...otherValues,
      hasDefaultReceiver: !!hasDefaultReceiver,
      receivers: receiversId,
    }
    if (!id) {
      postMessageTemplate({
        'client-name': '',
        'client-version': '',
        createMessageTemplateModel: createUpdateModel,
      }).then((res: { data: CreateMessageTemplateResultApiResult }) => {
        if (res?.data?.success) {
          openToast({ message: formatMessage(phrasesMessages.successAdd), type: 'success' })
          router.replace('/message-template')
        }
      })
    } else {
      putMessageTemplate({
        'client-name': 'update-commission',
        'client-version': '1.0.0',
        updateMessageTemplateModel: createUpdateModel,
        id: id!,
      }).then((res: { data: ApiResult }) => {
        if (res?.data?.success) {
          openToast({ message: formatMessage(phrasesMessages.successUpdate), type: 'success' })
          router.replace('/message-template')
        }
      })
    }
  }
  const breadcrumbs = [
    {
      url: '/',
      title: formatMessage(phrasesMessages.dashboard),
    },
    {
      url: '/message-template',
      title: formatMessage(messageTemplatePageMessages.messageTemplateTitle),
    },
    {
      url: '#',
      title: id
        ? formatMessage(messageTemplatePageMessages.editMessageTemplate)
        : formatMessage(messageTemplatePageMessages.addMessageTemplate),
    },
  ]
  return (
    <>
      <BreadCrumbSection
        title={formatMessage(messageTemplatePageMessages.messageTemplateTitle)}
        breadItems={breadcrumbs}
      />
      <Box
        bgcolor="common.white"
        px={8}
        py={6}
        borderRadius={4}
        display={'flex'}
        flexDirection={'column'}
        gap={6}
        sx={{
          width: 1,
          border: (theme) => `1px solid ${theme.palette.grey[200]}`,
        }}
      >
        <Box display="flex" justifyContent="space-between">
          <Typography variant="h4" display={'flex'} gap={2} color="text.primary">
            <HBIcon type="envelope" />
            {id
              ? formatMessage(messageTemplatePageMessages.editTemplate)
              : formatMessage(messageTemplatePageMessages.addNewTemplate)}
          </Typography>
          {id && (
            <HBWorkflow
              factor="1"
              entityId={id!}
              machineCode={StateMachineCode.MessageTemplate}
              useGetStateList={useGetStateList}
              useGetState={useGetStateInfo}
              useChangeState={usePostAdminGeneralDataMessageTemplatesChangeStateMutation}
              stateCode={data?.data?.stateCode}
              onChangeState={refetch}
            />
          )}
        </Box>
        <Stack spacing={4}>
          <HBForm
            onSubmit={handleSubmit}
            mode="all"
            formProviderProps={id ? FormProvider : undefined}
          >
            <MessageTemplateAddEditForm />
          </HBForm>
        </Stack>
      </Box>
    </>
  )
}

export default MessageTemplateAddEditPage
