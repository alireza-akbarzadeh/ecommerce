import { HBContentUploader } from '@hasty-bazar/admin-shared/containers/HBContentUploader'
import { ContentTypeEnums, EntityTypeEnums } from '@hasty-bazar/admin-shared/core/enums'
import { GetBusinessTypeValuesQueryResult } from '@hasty-bazar/admin-shared/services/generalDataApi.generated'
import { HBButton, HBDialog } from '@hasty-bazar/core'
import { Box, Grid, Typography } from '@mui/material'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useForm, UseFormReturn } from 'react-hook-form'
import { useIntl } from 'react-intl'
import ContentManagementPageMessages from '../../ContentManagementPage.messages'
import Preview from '../../Preview'
import { HBAdvertisementSliderWidgetCreator } from './HBAdvertisementSliderWidgetCreator'
import { HBBusinessSliderWidgetCreator } from './HBBusinessSliderWidgetCreator'
import { HBHtmlWidgetCreator } from './HBHtmlWidgetCreator'
import HBVisionButtonWidgetCreator from './HBVisionButtonWidgetCreator'

type widgetProps = {
  fullCode: number
  formProvider: UseFormReturn
}

enum PlatformTypes {
  Web = '1021001',
  Ios = '1021002',
  Android = '1021003',
}

export default function HBWidget({ fullCode, formProvider }: widgetProps) {
  const { formatMessage } = useIntl()
  const { query: { sectionId } = {} } = useRouter()
  const [openDialog, setOpenDialog] = useState<boolean>(false)
  const [showWebPreview, setShowWebPreview] = useState<boolean>(false)
  const [showWebPreviewButton, setShowWebPreviewButton] = useState<boolean>(false)
  const [showMobilePreviewButton, setShowMobilePreviewButton] = useState<boolean>(false)
  const widgetProvider = useForm({
    mode: 'all',
  })

  useEffect(() => {
    const platformTypes: GetBusinessTypeValuesQueryResult[] =
      formProvider.getValues('platformTypes')
    if (platformTypes?.some((item) => item.id == PlatformTypes.Web)) {
      setShowWebPreviewButton(true)
    } else {
      setShowWebPreviewButton(false)
    }

    if (
      platformTypes?.some(
        (item) => item.id == PlatformTypes.Ios || item.id == PlatformTypes.Android,
      )
    ) {
      setShowMobilePreviewButton(true)
    } else {
      setShowMobilePreviewButton(false)
    }
  }, [formProvider.watch('platformTypes')])

  const getWidget = (
    fullCode: number,
    formProvider: UseFormReturn,
    widgetProvider: UseFormReturn,
  ) => {
    switch (fullCode) {
      case ContentTypeEnums.Html:
        return <HBHtmlWidgetCreator widgetId={fullCode} />
      case ContentTypeEnums.BusinessSlider:
        return (
          <HBBusinessSliderWidgetCreator
            formProviderProps={formProvider}
            widgetId={fullCode}
            widgetProviderProps={widgetProvider}
          />
        )
      case ContentTypeEnums.Button:
        return <HBVisionButtonWidgetCreator widgetProviderProps={widgetProvider} />
      case ContentTypeEnums.Image:
        return (
          <HBContentUploader
            entityId={sectionId ? String(sectionId) : undefined}
            entityTypeId={EntityTypeEnums.Section}
            fileType={ContentTypeEnums.Image}
            title={formatMessage(ContentManagementPageMessages.pictureUpload)}
          />
        )
      case ContentTypeEnums.Video:
        return (
          <HBContentUploader
            entityId={sectionId ? String(sectionId) : undefined}
            entityTypeId={EntityTypeEnums.Section}
            fileType={ContentTypeEnums.Video}
            title={formatMessage(ContentManagementPageMessages.videoUpload)}
          />
        )
      case ContentTypeEnums.ImageSlider:
        return (
          <HBAdvertisementSliderWidgetCreator
            widgetProviderProps={widgetProvider}
            widgetId={fullCode}
          />
        )
    }
  }

  return (
    <Grid container sx={{ mt: 2 }}>
      <Grid container item xs={12} md={12}>
        <Grid item xs={12} md={1.5}>
          <Typography
            variant="subtitle1"
            mb={1}
            color="text.primary"
            sx={{ height: 40, display: 'flex', alignItems: 'center' }}
          >
            {formatMessage(ContentManagementPageMessages.previewSectionTitle)}
          </Typography>
        </Grid>
        <Grid item xs={12} md={6}>
          {showMobilePreviewButton && (
            <HBButton
              size={'medium'}
              variant="outlined"
              sx={{ mr: 10 }}
              onClick={() => {
                setShowWebPreview(false)
                setOpenDialog(true)
              }}
            >
              {formatMessage(ContentManagementPageMessages.mobilePreview)}
            </HBButton>
          )}
          {showWebPreviewButton && (
            <HBButton
              size={'medium'}
              variant="outlined"
              onClick={() => {
                setShowWebPreview(true)
                setOpenDialog(true)
              }}
            >
              {formatMessage(ContentManagementPageMessages.webPreview)}
            </HBButton>
          )}
        </Grid>
      </Grid>
      <Grid item xs={12} md={12} key={sectionId as string}>
        {getWidget(fullCode, formProvider, widgetProvider)}
      </Grid>
      <HBDialog
        title={
          showWebPreview
            ? formatMessage(ContentManagementPageMessages.dynamicPreview)
            : formatMessage(ContentManagementPageMessages.previewSectionTitle).replace(':', '')
        }
        open={openDialog}
        onReject={() => setOpenDialog(false)}
        onClose={() => setOpenDialog(false)}
        maxWidth={'lg'}
      >
        <Box sx={{ width: 1200 }}>
          <Preview mainProvider={formProvider} showWebPreview={showWebPreview} />
        </Box>
      </HBDialog>
    </Grid>
  )
}
