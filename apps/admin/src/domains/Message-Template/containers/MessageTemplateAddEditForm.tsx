import { HBTinyEditor } from '@hasty-bazar/admin-shared/components'
import { HBContentUploader } from '@hasty-bazar/admin-shared/containers/HBContentUploader'
import HBSelectController from '@hasty-bazar/admin-shared/containers/HBSelectController'
import HBSelectMultiColumnController from '@hasty-bazar/admin-shared/containers/HBSelectMultiColumnController'
import HBSuggestController from '@hasty-bazar/admin-shared/containers/HBSuggestController'
import HBTextFieldController from '@hasty-bazar/admin-shared/containers/HBTextFieldController'
import {
  BusinessTypeEnums,
  ContentTypeEnums,
  EntityTypeEnums,
} from '@hasty-bazar/admin-shared/core/enums'
import phrasesMessages from '@hasty-bazar-admin/core/translations/phrases.messages'
import validationsMessages from '@hasty-bazar-admin/core/translations/validations.messages'
import { useGetAdminCmsContentsByEntityTypeIdAndEntityIdQuery } from '@hasty-bazar/admin-shared/services/cmsApi.generated'
import {
  useGetAdminGeneralDataBusinessEntitiesGetMessageTemplateVariablesQuery,
  useGetAdminGeneralDataBusinessTypeValueByBusinessTypeByBusinessTypeQuery,
} from '@hasty-bazar/admin-shared/services/generalDataApi.generated'
import {
  GetPartiesQueryResult,
  useGetAdminIdrPartiesQuery,
} from '@hasty-bazar/admin-shared/services/idrApi.generated'
import { HBButton, HBDialog, HBIcon } from '@hasty-bazar/core'
import { Box, buttonClasses, Grid, Stack, Typography } from '@mui/material'
import { useRouter } from 'next/router'
import { FC, useEffect, useRef, useState } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { useIntl } from 'react-intl'
import useReceiverColumn from '../hooks/useReceiverColumn'
import messageTemplatePageMessages from '../MessageTemplate.messages'
import { MessageTemplateType } from '../MessageTemplateAddEditPage'
const MessageTemplateAddEditEorm: FC = () => {
  const [openConfirmModal, setOpenConfirmModal] = useState<boolean>(false)
  const [searchText, setSearchText] = useState<string>()
  const [page, setPage] = useState(1)
  const [partiesData, setPartiesData] = useState<GetPartiesQueryResult[]>([])
  const { columnDefs } = useReceiverColumn()

  const { data: parties, refetch: refetchParties } = useGetAdminIdrPartiesQuery({
    'client-name': 'Swagger on HIT.Hastim.IDR.Endpoints.AdminApi',
    'client-version': '1.0.1.100',
    pageNumber: page,
    pageSize: 20,
    firstName: searchText,
    lastName: searchText,
    filter: 'FirstName.Contains(--FirstName) Or LastName.Contains(--LastName)',
  })

  useEffect(() => {
    parties?.data?.items && setPartiesData((prev) => [...prev, ...parties?.data?.items!])
  }, [parties?.data?.items])

  const ref = useRef<HTMLButtonElement>(null)
  const { formatMessage } = useIntl()
  const router = useRouter()
  const id = router.query.id?.[0]
  const {
    control,
    setValue,
    formState: { isDirty, isValid },
  } = useFormContext<MessageTemplateType>()
  const { data: protocolTypeData } =
    useGetAdminGeneralDataBusinessTypeValueByBusinessTypeByBusinessTypeQuery({
      'client-name': 'Swagger on HIT.Hastim.GeneralData.Endpoints.AdminApi',
      'client-version': '1.0.1.100',
      businessType: BusinessTypeEnums.ProtocolType,
    })

  const handleGoBack = () => {
    if (!isDirty) {
      router.replace('/message-template')
    } else {
      setOpenConfirmModal(true)
    }
  }
  const handleCancel = () => {
    setOpenConfirmModal(false)
    router.replace('/message-template')
  }
  const handleSave = () => {
    if (isValid) {
      ref.current?.click()
    }
    setOpenConfirmModal(false)
  }

  const { data } = useGetAdminGeneralDataBusinessEntitiesGetMessageTemplateVariablesQuery({
    'client-name': '',
    'client-version': '',
    pageSize: 1000,
  })
  const { data: uploadedData } = useGetAdminCmsContentsByEntityTypeIdAndEntityIdQuery(
    {
      'client-name': '',
      'client-version': '',
      entityId: String(id),
      entityTypeId: EntityTypeEnums.MessageTemplate,
    },
    {
      skip: !id,
    },
  )
  const uploadedValues = uploadedData?.data?.items?.map((item) => item.value)

  return (
    <Stack gap={6}>
      <Grid container spacing={6}>
        <Grid item xs={12} sm={6} md={8}>
          <HBTextFieldController
            name="name"
            label={formatMessage(messageTemplatePageMessages.templateTitle)}
            inputProps={{ maxLength: 80 }}
            formRules={{
              validate: (value) => !!value.trim() || !value,
              required: true,
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <HBTextFieldController
            name="subject"
            label={formatMessage(messageTemplatePageMessages.subject)}
            inputProps={{ maxLength: 150 }}
            formRules={{
              validate: (value) => !!value.trim() || !value,
              required: true,
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <HBSelectController
            inputLabelProps={{ required: true }}
            formRules={{ required: true }}
            fullWidth
            name="hasDefaultReceiver"
            label={formatMessage(messageTemplatePageMessages.hasDefaultReceiver)}
            menuItem={[
              { title: formatMessage(messageTemplatePageMessages.no), value: 0 },
              { title: formatMessage(messageTemplatePageMessages.yes), value: 1 },
            ]}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <HBSelectMultiColumnController
            name="receivers"
            label={formatMessage(messageTemplatePageMessages.otherReceivers)}
            items={partiesData}
            onInputChange={(_, searchValue) => {
              setPartiesData([])
              setSearchText(searchValue)
              setPage(1)
              refetchParties()
            }}
            size="small"
            columnDefs={columnDefs}
            pageSize={20}
            totalItems={parties?.data?.totalItems!}
            loadNextPage={() => {
              setPage(page + 1)
            }}
            isOptionEqualToValue={(option, _value) => option.id === _value.id}
            multiple
            formRules={{ required: false }}
            autoComplete={false}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <HBSelectController
            inputLabelProps={{ required: true }}
            formRules={{ required: true }}
            fullWidth
            name="protocolType"
            label={formatMessage(messageTemplatePageMessages.protocolTypeCode)}
            menuItem={
              protocolTypeData?.data?.items?.map((item) => ({
                value: +item.id!,
                title: item.title!,
              })) || []
            }
          />
        </Grid>

        <Grid item xs={12}>
          <Box sx={{ my: 1 }}>
            <Box sx={{ my: 1 }}>
              <Typography variant="button" color="primary.main">
                {formatMessage(messageTemplatePageMessages.messageBodyField)}
              </Typography>
              <Typography variant="button" color="primary.main" sx={{ px: 1, fontFamily: 'arial' }}>
                *
              </Typography>
            </Box>
            <HBSuggestController
              formRules={{
                required: {
                  value: true,
                  message: formatMessage(validationsMessages.isRequired),
                },
                validate: (value) => {
                  return !!value
                    .replace(/(<([^>]+)>)/gi, '')
                    .replace(/&nbsp;/g, '')
                    .trim()
                },
              }}
              name="messageBody"
              items={
                data?.data?.items?.map((item) => ({
                  title: item.fullTitle!,
                  value:
                    `<span contenteditable="false" data-parameter="@${item.fullName}" style="background-color:#E7E9EB;">${item.fullTitle}</span>`!,
                })) || []
              }
              renderInput={(param) => {
                return <HBTinyEditor init={{ max_height: 400 }} {...param} />
              }}
              renderItem={(param) => {
                return <Box>{param.item.title}</Box>
              }}
              paperComponent={(param) => {
                return <Box>{param.children}</Box>
              }}
            />
          </Box>
        </Grid>
        {id && (
          <Grid item xs={12}>
            <Controller
              name="attachmentURLs"
              render={() => (
                <HBContentUploader
                  entityId={String(id)}
                  entityTypeId={EntityTypeEnums.MessageTemplate}
                  fileType={ContentTypeEnums.Image}
                  showContainer={false}
                  onSuccess={(uploadedData) => {
                    if (typeof uploadedData === 'string') {
                      setValue('attachmentURLs', 'deleted')
                    } else {
                      uploadedValues?.push(uploadedData.value)
                      setValue('attachmentURLs', JSON.stringify(uploadedValues))
                    }
                  }}
                />
              )}
            />
          </Grid>
        )}
      </Grid>
      <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between">
        <HBButton
          variant="outlined"
          onClick={handleGoBack}
          startIcon={<HBIcon type="angleRight" />}
        >
          {formatMessage(phrasesMessages.back)}
        </HBButton>
        <HBButton
          ref={ref}
          type="submit"
          disabled={!isValid || !isDirty}
          sx={{
            [`&.${buttonClasses.disabled}`]: {
              bgcolor: 'primary.main',
              opacity: '0.3',
              color: 'background.paper',
            },
          }}
        >
          {formatMessage(phrasesMessages.save)}
        </HBButton>
      </Stack>
      <HBDialog
        title={formatMessage(phrasesMessages.saveSuccess)}
        content={formatMessage(phrasesMessages.dialogConfirmationContent)}
        onAccept={handleSave}
        onReject={handleCancel}
        open={openConfirmModal}
        onClose={() => setOpenConfirmModal(false)}
        acceptBtn={formatMessage(phrasesMessages.confirm)}
        rejectBtn={formatMessage(phrasesMessages.cancel)}
      />
    </Stack>
  )
}

export default MessageTemplateAddEditEorm
