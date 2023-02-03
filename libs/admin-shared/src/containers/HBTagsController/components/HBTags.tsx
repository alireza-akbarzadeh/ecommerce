import { GetContentsByEntityTypeTagQueryResult } from '@hasty-bazar/admin-shared/services/cmsApi.generated'
import { HBIcon, HBTag, HBTextField, openToast } from '@hasty-bazar/core'
import { Box } from '@mui/material'
import { FC, useEffect, useState } from 'react'
import { useIntl } from 'react-intl'
import tagsControllerMessages from '../HBTagsController.messages'

type HBTagsProps = {
  label: string
  tagsArray: (tagsArray: GetContentsByEntityTypeTagQueryResult[]) => void
  tags: GetContentsByEntityTypeTagQueryResult[]
  required?: boolean
  hasError?: boolean
}

type TagType = GetContentsByEntityTypeTagQueryResult & {
  newTagId?: string
}

const HBTags: FC<HBTagsProps> = (props: HBTagsProps) => {
  const { label, tagsArray } = props

  const { formatMessage } = useIntl()

  const [tagValue, setTagValue] = useState<string>('')
  const [tags, setTags] = useState<TagType[]>(props.tags || [])

  useEffect(() => {
    setTags(props.tags || [])
  }, [props.tags])

  const addTag = () => {
    if (!tagValue.trim()) return
    const newTags = [...tags]
    if (newTags.find((tag) => tag.title === tagValue)) {
      openToast({
        message: formatMessage(tagsControllerMessages.existError),
        type: 'error',
      })
      return
    }
    newTags.push({
      title: tagValue,
      id: '0',
      newTagId: new Date().getTime().toString(),
    })
    setTags(newTags)
    tagsArray(newTags)
    setTagValue('')
  }

  const removeTag = (tagItem: TagType) => {
    const newTags = [...tags]
    const remainedTags = newTags.filter(
      (tag) => tag.newTagId !== tagItem.newTagId || (tag.id !== tagItem.id && tagItem.id !== '0'),
    )

    setTags(remainedTags)
    tagsArray(remainedTags)
  }

  return (
    <>
      <HBTextField
        value={tagValue}
        onChange={(event) => setTagValue(event.target.value)}
        onKeyDown={(event) => {
          if (event.code === 'Enter') {
            event.preventDefault()
            event.stopPropagation()
            addTag()
          }
        }}
        label={label + (props?.required ? ' *' : '')}
        size="small"
        fullWidth
        error={props.hasError}
        InputProps={{
          endAdornment: (
            <Box
              onClick={addTag}
              sx={{
                cursor: 'pointer',
                color: 'primary.main',
                pt: 1,
              }}
            >
              <HBIcon type="plus" />
            </Box>
          ),
        }}
      />

      <Box
        sx={{
          mt: 2,
          display: 'flex',
          flexDirection: 'row',
          gap: 2,
          flexWrap: 'wrap',
        }}
      >
        {tags?.map((tag, index) => (
          <HBTag
            key={String(index + tag.title!)}
            label={tag.title!}
            onDelete={() => removeTag(tag)}
            variant="outlined"
            clickable
          />
        ))}
      </Box>
    </>
  )
}

export default HBTags
