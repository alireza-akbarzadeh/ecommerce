import { HBSwitchController } from '@hasty-bazar/admin-shared/containers/HBSwitchController'
import HBTextFieldController from '@hasty-bazar/admin-shared/containers/HBTextFieldController'
import { BusinessTypeEnums } from '@hasty-bazar/admin-shared/core/enums'
import phrasesMessages from '@hasty-bazar-admin/core/translations/phrases.messages'
import {
  useGetAdminCmsFileTypesQuery,
  useGetAdminCmsVisualSizeSettingsQuery,
} from '@hasty-bazar/admin-shared/services/cmsApi.generated'
import {
  GetBusinessEntitiesQueryResultPagedCollectionQueryResultApiResult,
  useGetAdminGeneralDataBusinessTypeValueByBusinessTypeByBusinessTypeQuery,
} from '@hasty-bazar/admin-shared/services/generalDataApi.generated'
import { HBAutocompleteController, HBButton, HBDialog } from '@hasty-bazar/core'
import { Box, Grid, Stack, Typography } from '@mui/material'
import { useRouter } from 'next/router'
import { useEffect, useRef, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { useIntl } from 'react-intl'
import { DocumentsFormType } from '../DocumentEditAddPage'
import documentsPageMessages from '../Documents-Attributes.messages'
import DocumentsWorkFlow from './DocumentsWorkFlow'

export default function DocumentAddEditForm({
  relatedData,
  refetch,
}: {
  relatedData: GetBusinessEntitiesQueryResultPagedCollectionQueryResultApiResult | undefined
  refetch: () => void
}) {
  const [openConfirmModal, setOpenConfirmModal] = useState(false)
  const router = useRouter()
  const { formatMessage } = useIntl()
  const submitRef = useRef<HTMLButtonElement>(null)
  const {
    formState: { isValid, isDirty },
    setValue,
    watch,
  } = useFormContext<DocumentsFormType>()

  useEffect(() => {
    // @ts-ignore
    setValue('entityTypeCodeTitle', watch('entityTypeCode')?.title)
  }, [watch('entityTypeCode')])

  const { data: visualSizeData } = useGetAdminCmsVisualSizeSettingsQuery({
    'client-name': 'admin',
    'client-version': '1.0.0',
    pageSize: 1000,
  })

  const { data: fileTypeData } = useGetAdminCmsFileTypesQuery({
    'client-name': 'admin',
    'client-version': '1.0.0',
    pageSize: 1000,
  })

  const { data: typeOfUseData } =
    useGetAdminGeneralDataBusinessTypeValueByBusinessTypeByBusinessTypeQuery({
      'client-name': 'admin',
      'client-version': '1.0.0',
      businessType: BusinessTypeEnums.TypeOfUse,
    })

  const handleGoBack = () => {
    if (isDirty) {
      setOpenConfirmModal(true)
    } else {
      router.replace('/documents-attributes')
    }
  }

  const handleSave = () => {
    if (isValid) {
      submitRef.current?.click()
    }
    setOpenConfirmModal(false)
  }
  const handleCancel = () => {
    setOpenConfirmModal(false)
    router.replace('/documents-attributes')
  }

  return (
    <>
      <Box display="flex" justifyContent="space-between">
        <Typography variant="h4">
          {formatMessage(documentsPageMessages.documentPageTitle)}
        </Typography>
        <Box>
          <DocumentsWorkFlow refetch={refetch} />
        </Box>
      </Box>
      <Box mt={8}>
        <Typography variant="body1" color="text.secondary">
          {formatMessage(documentsPageMessages.enterDocumentsData)}
        </Typography>
        <Grid container spacing={6} mt={6}>
          <Grid item xs={12} sm={6} md={2}>
            <HBTextFieldController
              required
              formRules={{
                required: true,
                maxLength: 100,
              }}
              name={'code'}
              label={formatMessage(documentsPageMessages.formItemCode)}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <HBTextFieldController
              required
              formRules={{
                required: true,
                maxLength: 4000,
              }}
              name={'subject'}
              label={formatMessage(documentsPageMessages.formItemSubject)}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <HBAutocompleteController
              label={formatMessage(documentsPageMessages.formItemType)}
              fieldName="fileTypeId"
              isOptionEqualToValue={(o, v) => o?.id == v}
              getOptionLabel={(option) => `${option.name}`}
              options={fileTypeData?.data?.items || []}
              formRules={{
                required: true,
              }}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <HBAutocompleteController
              label={formatMessage(documentsPageMessages.formItemExistence)}
              fieldName="entityTypeCode"
              isOptionEqualToValue={(o, v) => o?.id == v}
              getOptionLabel={(option) => `${option.title}`}
              options={relatedData?.data?.items || []}
              formRules={{
                required: true,
              }}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <HBTextFieldController
              formRules={{ required: false, maxLength: 4000 }}
              name={'factor'}
              label={formatMessage(documentsPageMessages.formItemRefactor)}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <HBAutocompleteController
              label={formatMessage(documentsPageMessages.formItemTypeOfUse)}
              fieldName="typeOfUseCode"
              isOptionEqualToValue={(o, v) => o?.id == v}
              getOptionLabel={(option) => `${option.name}`}
              options={typeOfUseData?.data?.items || []}
              formRules={{
                required: true,
              }}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <HBAutocompleteController
              label={formatMessage(documentsPageMessages.formItemMinPixel)}
              fieldName="minResolutionId"
              isOptionEqualToValue={(o, v) => o?.id == v}
              getOptionLabel={(option) => `${option.width}x${option.height}`}
              options={visualSizeData?.data?.items || []}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <HBAutocompleteController
              label={formatMessage(documentsPageMessages.formItemMaxPixel)}
              fieldName="maxResolutionId"
              isOptionEqualToValue={(o, v) => o?.id == v}
              getOptionLabel={(option) => `${option.width}x${option.height}`}
              options={visualSizeData?.data?.items || []}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <HBAutocompleteController
              label={formatMessage(documentsPageMessages.formItemSuggestedPixels)}
              fieldName="sujestedResolutionId"
              isOptionEqualToValue={(o, v) => o?.id == v}
              getOptionLabel={(option) => `${option.width}x${option.height}`}
              options={visualSizeData?.data?.items || []}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <HBTextFieldController
              name={'minFileSizeInMB'}
              label={formatMessage(documentsPageMessages.formItemMinSize)}
              formRules={{ required: false }}
              type="number"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <HBTextFieldController
              name={'maxFileSizeInMB'}
              label={formatMessage(documentsPageMessages.formItemMaxSize)}
              formRules={{ required: false }}
              type="number"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <HBTextFieldController
              name={'maxVideoLengthInMinute'}
              label={formatMessage(documentsPageMessages.formItemMaxTimeVideo)}
              formRules={{ required: false }}
              type="number"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <HBTextFieldController
              name={'minImageCount'}
              label={formatMessage(documentsPageMessages.formItemMinImageCount)}
              formRules={{ required: false }}
              type="number"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <HBTextFieldController
              name={'maxImageCount'}
              label={formatMessage(documentsPageMessages.formItemMaxImageCount)}
              formRules={{ required: false }}
              type="number"
            />
          </Grid>
        </Grid>
        <Box mt={20} display="flex" justifyContent="space-between">
          <HBButton variant="outlined" type="button" onClick={handleGoBack}>
            {formatMessage(documentsPageMessages.back)}
          </HBButton>
          <Box display="flex" alignItems="center" gap={6} justifyContent="flex-end">
            <Stack direction="row" gap={2}>
              <Typography variant="body1">
                {formatMessage(documentsPageMessages.formItemIsActive)}
              </Typography>
              <HBSwitchController name={'isActive'} />
            </Stack>
            <HBButton
              variant="contained"
              color="primary"
              type="submit"
              disabled={!isDirty || !isValid}
              ref={submitRef}
            >
              {formatMessage(documentsPageMessages.save)}
            </HBButton>
          </Box>
        </Box>
      </Box>
      <HBDialog
        title={formatMessage(phrasesMessages.saveSuccess)}
        content={formatMessage(documentsPageMessages.attributesLikeToSave)}
        onAccept={handleSave}
        onReject={handleCancel}
        open={openConfirmModal}
        onClose={() => setOpenConfirmModal(false)}
        acceptBtn={formatMessage(phrasesMessages.confirm)}
        rejectBtn={formatMessage(phrasesMessages.cancel)}
      />
    </>
  )
}
