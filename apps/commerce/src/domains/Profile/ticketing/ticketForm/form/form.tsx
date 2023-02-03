import HBTextFieldController from '@hasty-bazar-commerce/components/HBTextFieldController'
import { ApiConstants } from '@hasty-bazar-commerce/core/constants'
import { EntityTypeEnums } from '@hasty-bazar-commerce/core/enums'
import useUploader from '@hasty-bazar-commerce/hooks/useUploadFile'
import {
  EntityType,
  useDeleteWebCmsContentsByIdMutation,
  usePutWebCmsContentsUpdateContentEntityByContentIdMutation,
} from '@hasty-bazar-commerce/services/cmsApi.generated'
import {
  GetCategoryResult,
  GetSecendCategoryResult,
  PostWebCrmTicketsApiArg,
  PostWebCrmTicketsApiResponse,
  useGetWebCrmTicketsGetCaseSecondTypeQuery,
  useGetWebCrmTicketsGetCategoryQuery,
} from '@hasty-bazar-commerce/services/crmApi.generated'
import { HBAutocompleteController, HBButton, HBForm, openToast } from '@hasty-bazar/core'
import { buttonBaseClasses, Stack } from '@mui/material'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { useIntl } from 'react-intl'
import { TicketHeader } from '../../components'
import ticketingMessages from '../../ticketing.messages'
import { CaseTypeCaption } from '../ticketType'
import PreviewFile from './previewFile'
import UploadComponent from './uploadComponent'

interface TicketTypeItemProps {
  onBack: () => void
  caseTypeCode: CaseTypeCaption
}

export type FormType = Omit<PostWebCrmTicketsApiArg['body'], 'File'> & {
  File?: File
}
function Form({ onBack, caseTypeCode }: TicketTypeItemProps) {
  const [uploadLoading, setIsLoading] = useState(false)
  const { formatMessage } = useIntl()
  const router = useRouter()

  const url = `${process.env.NEXT_PUBLIC_GATEWAY}/Web/CRM/Tickets`
  const { data } = useSession()
  const { userName: Mobile, partyId } = data?.user || {}

  const [updateContent] = usePutWebCmsContentsUpdateContentEntityByContentIdMutation()
  const [contentId, setContentId] = useState<string>('')
  const [deleteContent] = useDeleteWebCmsContentsByIdMutation()

  const { isLoading, submitForm } = useUploader<FormType, PostWebCrmTicketsApiResponse>({
    url,
    onSuccess(data) {
      openToast({
        vertical: 'top',
        horizontal: 'center',
        message: data.message,
        type: 'success',
      })
      if (contentId) {
        updateContent({
          contentId,
          ...ApiConstants,
          updateContentEntityModel: {
            entityId: data.entityId!,
            entityType: EntityTypeEnums.Ticket as unknown as EntityType,
          },
        })
      }
      router.push('/profile/ticketing')
    },
    onError(error) {
      openToast({
        vertical: 'top',
        horizontal: 'center',
        message: error.message || formatMessage(ticketingMessages.error),
        type: 'error',
      })
    },
  })

  const formProviderProps = useForm<FormType>({
    mode: 'onChange',
  })

  const categories = useGetWebCrmTicketsGetCategoryQuery({
    ...ApiConstants,
    caseTypeCode: caseTypeCode!,
  })
  const { File, RequestCategoryCode } = useWatch({
    control: formProviderProps.control,
  })

  const secondCategories = useGetWebCrmTicketsGetCaseSecondTypeQuery(
    {
      ...ApiConstants,
      caseTypeCode: caseTypeCode!,
      requestCategoryCode: RequestCategoryCode!,
    },
    {
      skip: !RequestCategoryCode,
    },
  )

  const onSubmit = (data: FormType) => {
    const RequestCategoryName = categories.data?.data?.find(
      (item) => item.requestCategoryCode === data.RequestCategoryCode,
    )?.requestCategoryName

    const formData = {
      ...data,
      Mobile,
      PartyId: partyId,
      CaseTypeCode: caseTypeCode,
      ...(data.SecondRequestTypeCode
        ? {
            SecondRequestTypeName: secondCategories.data?.data?.find(
              (item) => item.caseSecondTypecode === data.SecondRequestTypeCode,
            )?.caseSecondTypeName,
          }
        : {}),
      RequestCategoryName,
    }
    submitForm(formData as FormType)
  }

  const formTitleSelector: Partial<Record<CaseTypeCaption, string>> = {
    [CaseTypeCaption.Question]: formatMessage(ticketingMessages.question),
    [CaseTypeCaption.Suggestion]: formatMessage(ticketingMessages.suggestion),
    [CaseTypeCaption.Complaint]: formatMessage(ticketingMessages.complaint),
  }

  return (
    <HBForm<FormType> onSubmit={onSubmit} formProviderProps={formProviderProps}>
      <TicketHeader
        onButtonClick={onBack}
        title={formatMessage(ticketingMessages.createRequestTitle, {
          type: formTitleSelector?.[caseTypeCode],
        })}
        buttonText={formatMessage(ticketingMessages.back)}
        icon="arrowRight"
      />
      <Stack
        width={{
          sx: '100%',
          md: '50%',
        }}
        display="flex"
        py={6}
        gap={6}
      >
        <HBAutocompleteController<FormType, GetCategoryResult>
          fieldName="RequestCategoryCode"
          autoCompleteProps={{
            loading: categories.isLoading,
            loadingText: formatMessage(ticketingMessages.loading),
            onChange: (e, value) => {
              formProviderProps.setValue('RequestCategoryCode', value?.requestCategoryCode!)
            },
          }}
          textFiledProps={{
            InputLabelProps: {
              shrink: true,
              sx: {
                color: 'primary.main',
              },
            },
          }}
          label={formatMessage(ticketingMessages.category)}
          options={categories.data?.data || []}
          isOptionEqualToValue={(option, value: any) => option.requestCategoryCode === value}
          getOptionLabel={(option) => option.requestCategoryName || ''}
          controllerProps={{
            rules: {
              required: {
                value: true,
                message: formatMessage(ticketingMessages.required, {
                  field: formatMessage(ticketingMessages.category),
                }),
              },
            },
          }}
        />
        {!!secondCategories.data?.data?.length && (
          <HBAutocompleteController<FormType, GetSecendCategoryResult>
            fieldName="SecondRequestTypeCode"
            label={formatMessage(ticketingMessages.choseComplaintType)}
            options={secondCategories.data?.data || []}
            isOptionEqualToValue={(option, value) => option.caseSecondTypecode === value}
            autoCompleteProps={{
              onChange: (e, value) => {
                formProviderProps.setValue('SecondRequestTypeCode', value?.caseSecondTypecode!)
              },
            }}
            getOptionLabel={(option) => option?.caseSecondTypeName || ''}
            controllerProps={{
              rules: {
                required: false,
              },
            }}
          />
        )}
        <HBTextFieldController<FormType>
          name="MessageDescription"
          multiline
          InputLabelProps={{
            sx: {
              color: 'primary.main',
            },
            shrink: true,
          }}
          rows={4}
          label={formatMessage(ticketingMessages.describeTicket)}
          formRules={{
            required: {
              value: true,
              message: formatMessage(ticketingMessages.required, {
                field: formatMessage(ticketingMessages.describeTicket),
              }),
            },
          }}
        />

        <Stack display="flex" flexDirection="row" gap={6}>
          <UploadComponent
            disabled={!!File}
            setLoading={(loading) => {
              setIsLoading(loading)
            }}
            onUpload={({ file, data }) => {
              setContentId(data.data?.id!)
              formProviderProps.setValue('File', file)
              formProviderProps.setValue('FilePath', data.data?.value!)
            }}
          />

          {File && (
            <PreviewFile
              File={File}
              onRemove={() => {
                deleteContent({
                  ...ApiConstants,
                  id: contentId,
                })
                formProviderProps.setValue('File', undefined)
                formProviderProps.setValue('FilePath', undefined)
              }}
            />
          )}
        </Stack>
        <HBButton
          type="submit"
          loading={isLoading || categories.isLoading || uploadLoading}
          variant="contained"
          disabled={!formProviderProps.formState.isValid}
          color="primary"
          sx={{
            width: 146,
            [`&.${buttonBaseClasses.disabled}`]: {
              opacity: '0.3',
              backgroundColor: 'primary.main',
              color: 'info.contrastText',
            },
          }}
        >
          {formatMessage(ticketingMessages.submitRequest)}
        </HBButton>
      </Stack>
    </HBForm>
  )
}

export default Form
