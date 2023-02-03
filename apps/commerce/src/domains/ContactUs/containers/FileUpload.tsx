import { CommerceIconButton, VideoThumbnail } from '@hasty-bazar-commerce/components'
import { ApiConstants } from '@hasty-bazar-commerce/core/constants'
import { useDeleteWebCmsContentsByIdMutation } from '@hasty-bazar-commerce/services/cmsApi.generated'
import { ContentTypeEnums, HBIcon, openToast } from '@hasty-bazar/core'
import { Box, Stack, Typography } from '@mui/material'
import Image from 'next/image'
import React, { FC, ReactNode, useMemo, useState } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { useIntl } from 'react-intl'
import contactUsMessage from '../contactUs.messages'
import { AddFileStyle, FileCardStyle } from './ContactUsContainer.style'

export interface IFileUpload {
  id: string
  value: string
  contentType: number
}

export interface FileUploadProps {
  accept: string
  labelText?: ReactNode
  multiple?: boolean
}

const FileUpload: FC<FileUploadProps> = ({ accept, labelText = '', multiple }) => {
  const { formatMessage } = useIntl()
  const { control, watch, register, setValue, getValues } = useFormContext()
  const [loading, setLoading] = useState(false)
  const [deleteWebCmsContentsByIdMutation, { isLoading }] = useDeleteWebCmsContentsByIdMutation()
  const fileList: IFileUpload[] = useMemo(() => getValues('attachments'), [watch('attachments')])

  const handleAddFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = event.target.files && (event.target.files[0] as File)
    if (!uploadedFile) return
    // TODO: check file size on server side
    // if (uploadedFile.size > 10 * 1024 * 1024)
    //   return openToast({
    //     message: formatMessage(contactUsMessage.fileSizeMessage),
    //     type: 'error',
    //     vertical: 'top',
    //   })
    const ContentType = uploadedFile.type.includes('image')
      ? ContentTypeEnums.Image
      : ContentTypeEnums.Video

    setLoading(true)
    const formData = new FormData()
    formData.append('EntityTypeId', '9001')
    formData.append('Factor', 'file')
    formData.append('ContentType', `${ContentType}`)
    formData.append('File', uploadedFile)
    fetch(`${process.env.NEXT_PUBLIC_CMS_URL}/Contents/file`, {
      method: 'POST',
      body: formData,
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.success) {
          setValue(
            'attachments',
            [...getValues('attachments')].concat({
              id: res.data.id,
              value: res.data.value,
              contentType: ContentType,
            }),
          )
        } else {
          openToast({
            message: formatMessage(contactUsMessage.fileFormatNotValid),
            type: 'error',
            vertical: 'top',
          })
        }
      })
      .catch(() => {
        openToast({
          message: formatMessage(contactUsMessage.connectionError),
          type: 'error',
          vertical: 'top',
        })
      })
      .finally(() => {
        setLoading(false)
      })
    event.target.value = ''
  }

  const handleRemoveFile = async (id: string) => {
    await deleteWebCmsContentsByIdMutation({
      ...ApiConstants,
      id,
    })
      .unwrap()
      .then((payload) => {
        if (payload.success) {
          setValue(
            'attachments',
            [...getValues('attachments')].filter((item) => item.id !== id),
          )
          openToast({
            message: formatMessage(contactUsMessage.deleteFileSuccess),
            type: 'success',
            vertical: 'top',
          })
        }
      })
      .catch(() =>
        openToast({
          message: formatMessage(contactUsMessage.connectionError),
          type: 'error',
          vertical: 'top',
        }),
      )
  }

  const keyStr = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/='

  const triplet = (e1: number, e2: number, e3: number) =>
    keyStr.charAt(e1 >> 2) +
    keyStr.charAt(((e1 & 3) << 4) | (e2 >> 4)) +
    keyStr.charAt(((e2 & 15) << 2) | (e3 >> 6)) +
    keyStr.charAt(e3 & 63)

  const rgbDataURL = (r: number, g: number, b: number) =>
    `data:image/gif;base64,R0lGODlhAQABAPAA${
      triplet(0, r, g) + triplet(b, 255, 255)
    }/yH5BAAAAAAALAAAAAABAAEAAAICRAEAOw==`

  const AttachmentController: FC<{ view: ReactNode }> = ({ view }) => {
    return (
      <Controller
        name="attachments"
        control={control}
        rules={{ required: false }}
        render={({ field }) => (
          <>
            <input
              {...register('attachments')}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                handleAddFile(e)
                field.onChange(fileList)
              }}
              accept={accept}
              id="file-upload"
              type="file"
              style={{ display: 'none' }}
            />
            <Typography component="label" htmlFor="file-upload" width="fit-content">
              {view}
            </Typography>
          </>
        )}
      />
    )
  }

  return Array.isArray(fileList) && fileList.length > 0 ? (
    <Stack direction="row" columnGap={3} rowGap={3} flexWrap="wrap">
      {fileList.map((item) => {
        return (
          <Box key={item.id} sx={{ width: 60, height: 60, position: 'relative' }}>
            <CommerceIconButton
              onClick={() => handleRemoveFile(item.id)}
              disabled={loading}
              iconSize="small"
              icon="times"
              sx={{
                minWidth: 18,
                width: 18,
                height: 18,
                position: 'absolute',
                cursor: 'pointer',
                zIndex: 1,
                left: -3,
                top: -3,
                color: 'grey.500',
                bgcolor: 'common.white',
                borderRadius: 10,
                lineHeight: 0,
              }}
            />
            <FileCardStyle>
              {item.contentType === ContentTypeEnums.Image ? (
                <Image
                  placeholder="blur"
                  blurDataURL={rgbDataURL(208, 205, 205)}
                  layout="fill"
                  objectFit="cover"
                  objectPosition="center"
                  src={`${process.env.NEXT_PUBLIC_CDN}/${item.value}`}
                />
              ) : (
                <VideoThumbnail src={item.value} width="inherit" height="inherit" />
              )}
            </FileCardStyle>
          </Box>
        )
      })}
      {multiple && (
        <AttachmentController
          view={
            <AddFileStyle>
              <HBIcon type="plus" sx={{ color: 'info.main' }} />
            </AddFileStyle>
          }
        />
      )}
    </Stack>
  ) : (
    <AttachmentController view={labelText} />
  )
}

export default FileUpload
