import { HBLink } from '@hasty-bazar/admin-shared/components'
import { usePostAdminCmsUrlPreviewMutation } from '@hasty-bazar/admin-shared/services/cmsApi.generated'
import { HBIconButton } from '@hasty-bazar/core'
import { Box, Stack, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import LinkSkeleton from './LinkSkeleton'

export type LinkType = {
  id: string
  url: string
  onRemove?: (value: string) => void
}

export default function LinkPreview({ id, url, onRemove }: LinkType) {
  const [showLink, { isLoading }] = usePostAdminCmsUrlPreviewMutation()
  const [description, setDescription] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [title, setTitle] = useState('')

  useEffect(() => {
    showLink({
      'client-name': 'hasty-bazar-admin',
      'client-version': '1.0.0',
      url,
    }).then((res: any) => {
      if (res?.data?.success) {
        setDescription(res?.data?.data?.description!)
        setImageUrl(res?.data?.data?.imageUrl!)
        setTitle(res?.data?.data?.title!)
      }
    })
  }, [url])

  if (isLoading) return <LinkSkeleton />

  return (
    <Stack
      spacing={3}
      sx={(theme) => ({
        border: `solid 1px ${theme.palette.grey[400]}`,
        p: 2,
        borderRadius: theme.spacing(1),
        wordWrap: 'break-word',
        height: '100%',
      })}
    >
      <Box display={'flex'} justifyContent="flex-end">
        <HBIconButton icon="times" onClick={() => onRemove?.(id)} variant="text" />
      </Box>
      <HBLink
        target={'_blank'}
        href={url}
        sx={{
          color: (theme) => theme.palette.info.main,
          textDecoration: 'none',
          textAlign: 'right',
        }}
      >
        <Typography variant="caption">{url}</Typography>
      </HBLink>
      {description || (title && <Typography variant="caption">{description || title}</Typography>)}
      {imageUrl && (
        <img
          src={imageUrl}
          alt={title}
          style={{ width: '100%', height: 140, borderRadius: 4, objectFit: 'cover' }}
        />
      )}
    </Stack>
  )
}
