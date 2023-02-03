import { ContentTypeEnums, EntityTypeEnums } from '@hasty-bazar/admin-shared/core/enums'
import {
  EntityType,
  GetContentsQueryResult,
  useDeleteAdminCmsContentsByIdMutation,
  useGetAdminCmsContentsByEntityTypeIdAndEntityIdQuery,
  usePostAdminCmsContentsMutation,
  usePostAdminCmsUrlValidateMutation,
} from '@hasty-bazar/admin-shared/services/cmsApi.generated'
import {
  HBButton,
  HBClassesType,
  HBFieldset,
  HBIcon,
  HBTextField,
  openToast,
} from '@hasty-bazar/core'
import { Box, CircularProgress, Grid, InputAdornment, inputBaseClasses, Stack } from '@mui/material'
import React, { useMemo, useState } from 'react'
import { useIntl } from 'react-intl'
import LinkPreview from './components/LinkPreview'
import contentLinkMessages from './HBContentLink.messages'

export type ContentLinkType = {
  entityTypeId: EntityTypeEnums
  entityId: string
}

type HBPageClassNames = 'wrapper'
const classes: HBClassesType<HBPageClassNames> = {
  wrapper: {
    [`& .${inputBaseClasses.focused}:not(.MuiInputBase-colorError) fieldset`]: {
      borderColor: (theme) => `${theme.palette.grey[400]} !important`,
    },
    [`& .${inputBaseClasses.error} i`]: {
      mt: 0.5,
    },
  },
}

export default function ContentLinks({ entityTypeId, entityId }: ContentLinkType) {
  const { formatMessage } = useIntl()

  const [urlValue, setUrlValue] = useState<string>('')
  const [urlError, setUrlError] = useState<boolean>(false)

  const [checkUrlValidation, { isLoading }] = usePostAdminCmsUrlValidateMutation()

  const [addLink] = usePostAdminCmsContentsMutation()
  const [delLink] = useDeleteAdminCmsContentsByIdMutation()

  const {
    data: contentData,
    refetch: refreshData,
    isFetching,
  } = useGetAdminCmsContentsByEntityTypeIdAndEntityIdQuery(
    {
      'client-name': 'hasty-bazar-admin',
      'client-version': '1.0.0',
      entityTypeId: entityTypeId as unknown as EntityType,
      entityId,
    },
    { skip: !entityId },
  )

  const contentDataArray = useMemo(() => {
    if (contentData?.data?.totalItems! > 0) {
      return contentData?.data?.items?.filter(
        (item: GetContentsQueryResult) => item.contentTypeValueCode === ContentTypeEnums.Url,
      )
    }
    return []
  }, [isFetching, contentData])

  const handleAddLink = async () => {
    if (!urlValue) return

    if (!/^(http|https):\/\/[^ "]+$/.test(urlValue)) {
      setUrlError(true)
      return
    }

    if (contentData?.data?.items?.find((item) => item?.value === urlValue)) {
      openToast({ message: formatMessage(contentLinkMessages.notValidLink), type: 'error' })
      return
    }

    checkUrlValidation({
      'client-name': 'hasty-bazar-admin',
      'client-version': '1.0.0',
      url: urlValue,
    })
      .then((res: any) => {
        if (res?.data.success) {
          addLink({
            'client-name': 'hasty-bazar-admin',
            'client-version': '1.0.0',
            createContentModel: {
              contentType: ContentTypeEnums.Url,
              entityId,
              entityTypeId: entityTypeId + '',
              title: '',
              value: urlValue,
              description: '',
              tags: [],
              metadata: '',
            },
          })
            .then(() => {
              refreshData()
              setUrlValue('')
            })
            .catch(() => {
              openToast({
                message: formatMessage(contentLinkMessages.errorOnAddLink),
                type: 'error',
              })
            })
        } else {
          setUrlError(true)
        }
      })
      .catch(() => {
        openToast({ type: 'error', message: formatMessage(contentLinkMessages.errorOnCheckLink) })
      })
  }

  const handleRemoveLink = (id: string) => {
    delLink({
      'client-name': 'hasty-bazar-admin',
      'client-version': '1.0.0',
      id,
    })
      .then((res: any) => {
        if (res?.data?.success) {
          refreshData()
        } else {
          openToast({
            type: 'error',
            message: formatMessage(contentLinkMessages.errorOnDeleteLink),
          })
        }
      })
      .catch(() => {
        openToast({ type: 'error', message: formatMessage(contentLinkMessages.errorOnDeleteLink) })
      })
  }

  const handleChangeUrl = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrlError(false)
    setUrlValue(e.target.value)
  }

  return (
    <Stack spacing={3}>
      <Box sx={classes.wrapper}>
        <HBTextField
          onKeyDown={(event) => {
            if (event.code === 'Enter') {
              event.preventDefault()
              event.stopPropagation()
              handleAddLink()
            }
          }}
          label={formatMessage(contentLinkMessages.linkTitle)}
          variant="outlined"
          size="medium"
          value={urlValue}
          onChange={handleChangeUrl}
          disabled={isLoading}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <HBButton
                  disabled={isLoading}
                  variant="text"
                  sx={{ minWidth: 50 }}
                  onClick={handleAddLink}
                >
                  {isLoading ? (
                    <CircularProgress color="secondary" size={20} />
                  ) : (
                    <HBIcon
                      type={'plus'}
                      size="medium"
                      sx={{ color: (theme) => theme.palette.primary.main }}
                    />
                  )}
                </HBButton>
              </InputAdornment>
            ),
          }}
          fullWidth
          focused
          helperText={urlError ? formatMessage(contentLinkMessages.notValidLink) : ''}
          color={urlError ? 'error' : 'primary'}
          error={urlError}
        />
      </Box>
      {contentDataArray && contentDataArray.length > 0 && (
        <HBFieldset title={formatMessage(contentLinkMessages.linkList)}>
          <Grid container spacing={3} sx={{ mb: 2 }}>
            {contentDataArray.map((item: GetContentsQueryResult) => (
              <Grid item xs={12} sm={6} md={4} key={item.id}>
                <LinkPreview
                  url={item.value!}
                  id={item.id!}
                  onRemove={() => handleRemoveLink(item?.id!)}
                />
              </Grid>
            ))}
          </Grid>
        </HBFieldset>
      )}
    </Stack>
  )
}
