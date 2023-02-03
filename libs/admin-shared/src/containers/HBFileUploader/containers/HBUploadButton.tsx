import { HBClassesType, HBIcon, HBIconType } from '@hasty-bazar/core'
import { Box, Typography } from '@mui/material'
import { styled, SxProps, Theme } from '@mui/system'
import { useState } from 'react'
import { HBFileUploaderListItemProps } from '../HBFileUploader'

type HBPageClassNames = 'uploadButton' | 'icon' | 'uploadButtonText' | 'inputField'

const classes: HBClassesType<HBPageClassNames> = {
  icon: ({ palette }) => ({
    mx: 4,
    color: palette['grey'][500],
  }),
  uploadButton: ({ spacing, palette }) => ({
    minWidth: spacing(30),
    height: spacing(30),
    width: spacing(30),
    border: 1,
    borderColor: palette.grey[500],
    borderRadius: spacing(0.5),
    borderStyle: 'dashed',
    p: 4,
    position: 'relative',
    textAlign: 'center',
  }),
  uploadButtonText: ({ palette }) => ({
    color: palette.grey[500],
    textAlign: 'center',
  }),
  inputField: {
    opacity: 0,
    position: 'absolute',
    right: 0,
    top: 0,
    width: '100%',
    height: '100%',
    cursor: 'pointer',
    ':disabled': {
      cursor: 'default',
    },
  },
}

const Input = styled('input')()

export type HBUploadButtonProps = {
  uploadButtonIcon: HBIconType
  uploadButtonTitle: string
  uploadButtonAcceptType: string
  uploadButtonOnUpload: (media: string, file: File) => void
  files?: HBFileUploaderListItemProps[]
  max?: number
  disabled?: boolean
  error?: boolean
}

function HBUploadButton({
  uploadButtonIcon,
  uploadButtonTitle = 'فایل را آپلود کنید.',
  uploadButtonAcceptType = 'image/*',
  uploadButtonOnUpload,
  disabled,
  files = [],
  max,
  error,
}: HBUploadButtonProps) {
  const [resetInput, setResetInput] = useState<number>(0)
  const handleChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const file = event.target.files[0] as File
      if (!file) return
      const media = URL.createObjectURL(file)
      uploadButtonOnUpload(media, file)
      setResetInput(Math.random())
    }
  }

  return (
    <Box sx={classes.uploadButton} style={{ borderColor: error ? '#ff0000' : undefined }}>
      <HBIcon sx={classes.icon} size="large" type={uploadButtonIcon} />
      <Typography variant="caption" sx={classes.uploadButtonText}>
        {uploadButtonTitle}
      </Typography>
      <Input
        sx={classes.inputField as SxProps<Theme> | undefined}
        type="file"
        accept={uploadButtonAcceptType}
        onChange={handleChange}
        key={resetInput}
        disabled={disabled || (!!max && max <= files.length)}
      />
    </Box>
  )
}

export default HBUploadButton
