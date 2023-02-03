import { ShowTostType } from '@hasty-bazar-admin/domains/Attributes/AttributesAddEditPage'
import { TagsWrapper } from '@hasty-bazar-admin/domains/Attributes/containers/AttributesAddEditForm.styles'
import productGroupMessages from '@hasty-bazar-admin/domains/Product-Group/ProductGroup.messages'
import {
  GetTagQueryResult,
  useGetAdminCmsTagsQuery,
} from '@hasty-bazar/admin-shared/services/cmsApi.generated'
import { HBIcon, HBTag, HBToast } from '@hasty-bazar/core'
import { Box, IconButton, List, ListItemButton, Popover, Stack, TextField } from '@mui/material'
import React, { useCallback, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { useIntl } from 'react-intl'
import ContentFieldWrapper from '../../components/ContentFieldWrapper.style'

let doFilter: NodeJS.Timeout

export default function Tags({
  defaultTag,
  changeDefaultTag,
}: {
  defaultTag: GetTagQueryResult[]
  changeDefaultTag: (value: GetTagQueryResult[]) => void
}) {
  const { setValue } = useFormContext()

  const [tag, setTag] = useState<string>('')
  const [showTost, setShowToast] = useState<ShowTostType>({ open: false, message: '' })
  const [isCheck, setIsCheck] = useState(false)

  const [anchorEl, setAnchorEl] = React.useState<HTMLInputElement | HTMLTextAreaElement | null>(
    null,
  )

  const { data: tagsData, refetch: refreshData } = useGetAdminCmsTagsQuery(
    {
      'client-name': 'hasty-bazar-admin',
      'client-version': '1.0.0',
      name: tag?.trim(),
      pageSize: 1000,
    },
    { skip: !isCheck },
  )

  const { formatMessage } = useIntl()

  const handleAdd = (tagValue?: GetTagQueryResult) => {
    if (!tag && !tagValue) return
    setAnchorEl(null)

    if (defaultTag?.find((item) => item.title === (tagValue?.title || tag?.trim()))) {
      setShowToast({
        open: true,
        message: 'این تگ قبلا اضافه شده است',
        type: 'error',
      })
      return
    }
    setValue('contentTags', [...defaultTag, tagValue || { title: tag.trim(), id: '0' }])
    changeDefaultTag([...defaultTag, tagValue || { title: tag?.trim(), id: '0' }])
    setTag('')
  }

  const handleRemove = (index: number) => {
    setValue('contentTags', [...defaultTag.slice(0, index), ...defaultTag.slice(index + 1)])
    changeDefaultTag([...defaultTag.filter((item, i) => i !== index)])
  }

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    clearTimeout(doFilter)
    setIsCheck(false)

    const { value } = e.target
    setTag(value)
    if (!value) {
      setAnchorEl(null)
      return
    }

    doFilter = setTimeout(async () => {
      setIsCheck(true)
      await refreshData()
      const tagsValue = tagsData?.data?.items || []
      setAnchorEl(tagsValue.length > 0 ? e.target : null)
    }, 500)
  }

  const handleClosePopover = () => {
    setAnchorEl(null)
  }

  const open = Boolean(anchorEl)

  const SearchList = useCallback(() => {
    return (
      <Box sx={{ p: 3, minWidth: 300, height: 200, overflowY: 'auto' }}>
        <List>
          {tagsData?.data?.items?.map((item, index) => (
            <ListItemButton onClick={() => handleAdd(item)} key={index}>
              {item.title}
            </ListItemButton>
          ))}
        </List>
      </Box>
    )
  }, [tagsData?.data?.items])

  return (
    <>
      <Stack sx={{ mt: 4, mb: 6, width: '100%' }}>
        <Box sx={{ position: 'relative' }}>
          <ContentFieldWrapper>
            <TextField
              name="tag"
              label={formatMessage(productGroupMessages.tags)}
              fullWidth
              focused
              size="medium"
              InputProps={{
                endAdornment: (
                  <IconButton onClick={() => handleAdd(undefined)}>
                    <HBIcon
                      sx={{
                        color: 'primary.main',
                      }}
                      size="medium"
                      type={'plus'}
                    />
                  </IconButton>
                ),
              }}
              onChange={handleChange}
              sx={{
                mb: 0,
              }}
              value={tag}
            />
          </ContentFieldWrapper>
          <Popover
            open={open && tagsData?.data?.items! && tagsData?.data?.items?.length > 0}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            anchorEl={anchorEl}
            onClose={handleClosePopover}
            disableEnforceFocus
          >
            <SearchList />
          </Popover>
        </Box>
        <TagsWrapper direction="row" mt={2} gap={2}>
          {defaultTag?.map((tag, index) => {
            return (
              <HBTag
                key={String(index + tag.id!)}
                label={tag.title}
                onDelete={() => handleRemove(index)}
                variant="outlined"
                clickable
              />
            )
          })}
        </TagsWrapper>
      </Stack>
      <HBToast
        open={showTost.open}
        message={showTost.message}
        type={showTost?.type || 'error'}
        autoHideDuration={6000}
        onClose={() => setShowToast({ open: false, message: '', type: showTost?.type })}
      />
    </>
  )
}
