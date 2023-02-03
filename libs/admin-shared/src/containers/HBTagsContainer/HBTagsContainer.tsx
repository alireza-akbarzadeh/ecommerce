import useToast from '@hasty-bazar/admin-shared/hooks/useToast'
import { HBIcon, HBTag, HBTextField, HBTextFieldProps } from '@hasty-bazar/core'
import { Box } from '@mui/material'
import { FC, useEffect, useState } from 'react'
import { useIntl } from 'react-intl'
import hbTagsMessages from './hbTags.messages'

type HBTagsContainerProps = {
  label: string
  tagsArray: (tagsArray: string[]) => void
  tags: string[]
  disabled?: boolean
  textFiledProps?: Omit<Partial<HBTextFieldProps>, 'InputProps'> &
    Omit<HBTextFieldProps['inputProps'], 'startAdornment' | 'endAdornment'>
}

const HBTagsContainer: FC<HBTagsContainerProps> = (props: HBTagsContainerProps) => {
  const { label, tagsArray } = props
  const { showToast } = useToast()

  const { formatMessage } = useIntl()

  const [tagValue, setTagValue] = useState<string>('')
  const [tags, setTags] = useState<string[]>(props.tags || [])

  useEffect(() => {
    setTags(props.tags || [])
  }, [props.tags])

  const addTag = () => {
    if (!tagValue.trim()) return
    const newTags = [...tags]
    if (newTags.indexOf(tagValue) === -1 && tagValue.toString().trim().length > 0) {
      newTags.push(tagValue)
      setTags(newTags)
      tagsArray(newTags)
      setTagValue('')
    } else {
      showToast(formatMessage(hbTagsMessages.existError), 'error')
    }
  }

  const removeTag = (tag: string) => {
    const newTags = [...tags]
    const remainedTags = newTags.filter((i) => i !== tag)
    setTags(remainedTags)
    tagsArray(remainedTags)
  }

  return (
    <>
      <HBTextField
        disabled={props.disabled}
        value={tagValue}
        onChange={(event) => setTagValue(event.target.value)}
        onKeyDown={(event) => {
          if (event.code === 'Enter') {
            event.preventDefault()
            event.stopPropagation()
            addTag()
          }
        }}
        label={label}
        size="small"
        fullWidth
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
        {...props.textFiledProps}
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
            key={String(index + tag)}
            label={tag}
            onDelete={() => removeTag(tag)}
            variant="outlined"
            clickable
          />
        ))}
      </Box>
    </>
    // </form>
  )
}

export default HBTagsContainer
