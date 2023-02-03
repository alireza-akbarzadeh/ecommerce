import { ContentTypeEnums, EntityTypeEnums, HBButton, HBDialog } from '@hasty-bazar/core'
import { Avatar, CircularProgress, Grid, SxProps, Theme, Typography } from '@mui/material'
import { ForwardedRef, forwardRef, useEffect, useRef, useState } from 'react'
import { HBIcon } from '../HBIcon'
import { ChooseIconWrapper, ImageWrapperStyle, InputStyle, WrapperStyle } from './HBAvatar.styles'
import { AxiosInstance } from 'axios'

const { log } = console

export interface HBAvatarProps {
  sx?: SxProps<Theme>
  onError?: (error: string) => void
  onSuccess?: (profileUrl: string) => void
  onDeleted?: () => void
  changeWithIcon?: boolean
  profileUrl: string
  cmsUrl?: string
  partyId: string
  profileProgress?: number
  factor?: string
  avatarId?: string
  instance?: AxiosInstance
  removePhotoDialogTitle?: string
  cancelTitle?: string
  deleteTitle?: string
}

const HBAvatar = forwardRef(
  <T extends HTMLElement>(
    {
      sx,
      onError,
      onSuccess,
      onDeleted,
      profileUrl,
      cmsUrl,
      partyId,
      profileProgress,
      changeWithIcon,
      factor = 'ProfileImage',
      avatarId,
      instance,
      removePhotoDialogTitle,
      cancelTitle,
      deleteTitle,
    }: HBAvatarProps,
    ref: ForwardedRef<T>,
  ) => {
    const inputRef = useRef<HTMLInputElement>(null)
    const [filePath, setFilePath] = useState<string>(profileUrl)
    const [loading, setLoading] = useState<boolean>(false)
    const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false)

    const handleFileChange = async (event: any) => {
      const fileObj = event.target.files && event.target.files[0]
      if (!fileObj && !cmsUrl) {
        return
      }

      setLoading(true)

      const formData = new FormData()
      formData.append('EntityId', partyId)
      formData.append('EntityTypeId', EntityTypeEnums.User.toString())
      formData.append('Factor', factor || 'ProfileImage')
      formData.append('ContentType', ContentTypeEnums.Image.toString())
      formData.append('File', fileObj)
      if (!instance) return

      instance
        .post(`${cmsUrl}/Contents/file`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
        .then((res: any) => {
          log(res)

          if (res?.data?.success) {
            if (onSuccess) onSuccess(res.data?.data)
          } else {
            if (onError) onError(res?.messages?.[0].message || '')
          }
        })
        .catch((e) => {})
        .finally(() => setLoading(false))

      event.target.value = null
    }

    useEffect(() => {
      setFilePath(profileUrl)
    }, [profileUrl])

    const handleDelete = () => {
      setLoading(true)
      instance
        ?.delete(`${cmsUrl}/Contents/${avatarId}`)
        .then((res: any) => {
          if (res?.data?.success) {
            setOpenDeleteDialog(false)
            if (onSuccess) onDeleted?.()
          } else {
            if (onError) onError(res?.data?.messages?.[0].message || '')
          }
        })
        .catch((e) => {})
        .finally(() => setLoading(false))
    }

    return (
      <>
        <WrapperStyle sx={sx}>
          <ImageWrapperStyle
            sx={{ border: (theme) => `4px solid ${theme.palette.grey[200]}`, borderRadius: '100%' }}
          >
            <Avatar
              sx={{ width: '100%', height: '100%', position: 'absolute' }}
              src={filePath || ''}
            />
            {/* {!!profileProgress && <ProfileProgress value={profileProgress} />} */}
          </ImageWrapperStyle>
          <InputStyle
            type="file"
            accept=".png, .jpg, .jpeg"
            ref={inputRef}
            onChange={handleFileChange}
          />
          {changeWithIcon && (
            <ChooseIconWrapper
              alignItems="center"
              justifyContent="center"
              className="avatar-icon-wrapper"
              onClick={() =>
                !avatarId
                  ? inputRef.current?.click()
                  : removePhotoDialogTitle
                  ? setOpenDeleteDialog(true)
                  : handleDelete()
              }
            >
              {!loading && !avatarId && <HBIcon type="camera" size="medium" />}
              {loading && <CircularProgress size={20} />}
              {!loading && avatarId && (
                <HBIcon
                  type="trash"
                  size="small"
                  sx={{ color: (theme) => theme.palette.error.main }}
                />
              )}
            </ChooseIconWrapper>
          )}
        </WrapperStyle>

        <HBDialog
          maxWidth="xs"
          title={deleteTitle}
          open={openDeleteDialog}
          onClose={() => setOpenDeleteDialog(false)}
          onReject={() => setOpenDeleteDialog(false)}
        >
          <Typography variant="subtitle1">{removePhotoDialogTitle}</Typography>
          <Grid mt={4} rowSpacing={1} container alignItems="center" justifyContent="center">
            <Grid item xs={12} sm={6} sx={{ pr: { sm: 1, xs: 0 } }}>
              <HBButton
                fullWidth
                onClick={() => setOpenDeleteDialog(false)}
                variant="outlined"
                size="medium"
              >
                {cancelTitle}
              </HBButton>
            </Grid>
            <Grid item xs={12} sm={6} sx={{ pl: { sm: 1, xs: 0 } }}>
              <HBButton
                fullWidth
                loading={loading}
                sx={{ fontSize: 14 }}
                type="submit"
                onClick={() => handleDelete()}
              >
                {deleteTitle}
              </HBButton>
            </Grid>
          </Grid>
        </HBDialog>
      </>
    )
  },
)

HBAvatar.displayName = 'HBAvatar'
HBAvatar.defaultProps = {}

export default HBAvatar
