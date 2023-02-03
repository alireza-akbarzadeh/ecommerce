import HBImg from '@hasty-bazar/admin-shared/containers/HBFileUploader/containers/HBImage.style'
import HBVideo from '@hasty-bazar/admin-shared/containers/HBFileUploader/containers/HBVideo.style'
import { GetContentsByEntityTypeQueryResult } from '@hasty-bazar/admin-shared/services/cmsApi.generated'
import { ContentTypeEnums, HBClassesType, HBIconButton } from '@hasty-bazar/core'
import { Box, Typography } from '@mui/material'
import { useIntl } from 'react-intl'

type FullScreenModalProps = {
  handleCloseFullScreen: () => void
  data: GetContentsByEntityTypeQueryResult
  fileType:
    | ContentTypeEnums.Image
    | ContentTypeEnums.Video
    | ContentTypeEnums.Document
    | ContentTypeEnums.Banner
}

type HBPageClassnames = 'modalContainer' | 'modalHeader' | 'imageBox' | 'media'

const classes: HBClassesType<HBPageClassnames> = {
  modalContainer: ({ spacing }) => ({
    width: '100%',
    height: '100%',
    backgroundColor: 'background.paper',
    p: 6,
  }),
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  imageBox: {
    width: '100%',
    height: 'calc(100% - 50px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 3,
    position: 'relative',
    bottom: 0,
    right: 0,
  },
  media: {
    objectFit: 'cover',
    maxHeight: '100%',
    maxWidth: '100%',
  },
}

const FullScreenModal = (props: FullScreenModalProps) => {
  const { handleCloseFullScreen, data, fileType } = props
  const { formatMessage } = useIntl()

  return (
    <Box sx={classes.modalContainer}>
      <Box sx={classes.modalHeader}>
        <Typography variant="h5"></Typography>
        <HBIconButton onClick={handleCloseFullScreen} variant="text" icon="times" />
      </Box>
      <Box sx={classes.imageBox}>
        {fileType === ContentTypeEnums.Image && (
          <HBImg src={`${process.env['NEXT_PUBLIC_CDN']}${data.value}`} sx={classes.media} />
        )}

        {fileType === ContentTypeEnums.Banner && (
          <HBImg src={`${process.env['NEXT_PUBLIC_CDN']}${data.value}`} sx={classes.media} />
        )}

        {fileType === ContentTypeEnums.Video && (
          <HBVideo controls sx={classes.media}>
            <source
              src={`${process.env['NEXT_PUBLIC_CDN']}${data.value}`}
              type="video/mp4"
            ></source>
          </HBVideo>
        )}
      </Box>
    </Box>
  )
}
export default FullScreenModal
