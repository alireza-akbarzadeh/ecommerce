import { useGetAdminCmsWidgetsByIdQuery } from '@hasty-bazar/admin-shared/services/cmsApi.generated'
import { useGetAdminCmsPagesGetSectionByIdQuery } from './cmsApi.generated.enhanced'

import { Box } from '@mui/material'
import RenderDynamicSection from './RenderDynamicSection'
import { UseFormReturn } from 'react-hook-form'

type PreviewProps = {
  mainProvider: UseFormReturn
  showWebPreview: boolean
}
export default function Preview({ mainProvider, showWebPreview }: PreviewProps) {
  const { watch: mainWatch, getValues } = mainProvider

  const { data } = useGetAdminCmsWidgetsByIdQuery(
    {
      'client-name': 'generalData',
      'client-version': '0',
      id: mainWatch('widgetId')?.value,
    },
    { skip: !mainWatch('widgetId')?.value },
  )

  const { data: sectionData } = useGetAdminCmsPagesGetSectionByIdQuery(
    {
      'client-name': 'generalData',
      'client-version': '0',
      id: getValues('id'),
    },
    { skip: !mainProvider.watch('id') },
  )

  return (
    <>
      {data?.data?.mobileBase64Image && !showWebPreview ? (
        <Box
          sx={{
            p: 2,
            mx: { xs: 2, sm: 'auto' },
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
          }}
        >
          (
          <img
            key={mainWatch('widgetId')?.value}
            src={`data:image/png;base64,${data?.data?.mobileBase64Image!}`}
            style={{ maxWidth: '100%' }}
          />
          )
        </Box>
      ) : null}
      <RenderDynamicSection sections={[{ ...sectionData?.data }]} />
    </>
  )
}
