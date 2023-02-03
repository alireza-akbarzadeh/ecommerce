import { Box, List, ListItem, ListItemButton, Typography } from '@mui/material'
import React, { forwardRef, useEffect, useRef, useState } from 'react'
import { HBTextField } from '../HBTextField'
import { getElementOffset } from './utils/getElemntPosition'

export interface HBSuggestRenderInputParams {
  onKeyDown: (event: React.KeyboardEvent) => void
  onClick: () => void
  onChange: (value: string) => void
  value: string
  onBlur?: () => void
}

export interface HBSuggestItem {
  title: string
  value: string
  [key: string]: any
}

export interface HBSuggestRenderItemParams {
  item: HBSuggestItem
}
export interface PaperComponentParams {
  children: React.ReactNode
}

export interface HBSuggestProps {
  renderInput?: (params: HBSuggestRenderInputParams) => React.ReactNode
  renderItem: (params: HBSuggestRenderItemParams) => React.ReactNode
  value?: string
  onChange?: (value: string) => void
  items: HBSuggestItem[]
  paperComponent?: (params: PaperComponentParams) => React.ReactNode
}

const HBSuggest = forwardRef((props: HBSuggestProps, ref) => {
  const [isMention, setIsMention] = useState<boolean>(false)
  const [mentionIndex, setMentionIndex] = useState<number>(-1)
  const [mentionValue, setMentionValue] = useState<string>('')
  const [value, setValue] = useState<string>('')
  const [spanOffset, setSpanOffset] = useState<{ left: number; top: number }>({ left: 0, top: 0 })
  const [mouseEnterMentionBox, setMouseEnterMentionBox] = useState<boolean>(false)
  const mentionSpanRef = useRef<HTMLSpanElement>(null)
  const tempMentionSpanRef = useRef<HTMLSpanElement>(null)
  const mentionDivRef = useRef<HTMLDivElement>(null)
  const [isKeyDown, setIsKeyDown] = useState<boolean>(false)

  const hideMention = () => {
    setIsMention(false)
    setMentionIndex(-1)
    setMentionValue('')
    setMouseEnterMentionBox(false)
  }

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === '@') {
      setIsMention(true)
    }

    if (event.key === ' ' || event.key === 'Enter' || event.key === 'Escape') {
      hideMention()
    }
    if (!isKeyDown) {
      setIsKeyDown(true)
    }
  }

  const onClick = () => {
    hideMention()
  }

  const onBlur = () => {
    !mouseEnterMentionBox && hideMention()
  }

  useEffect(() => {
    if (!isKeyDown) {
      setValue(props?.value!)
    }
  }, [props?.value])

  const onChange = (changeValue: string) => {
    const tempValue = changeValue
    const index = tempValue.search(/(?:\s|^|>|&nbsp;)@(?:\s|$|<|&nbsp;)/gi)
    setMentionIndex((prevIndex) => (prevIndex == -1 ? index : prevIndex))

    setValue(changeValue)
    props?.onChange?.(changeValue)
  }

  useEffect(() => {
    if (mentionIndex !== -1) {
      const mentionText =
        mentionIndex === value?.length ? '@' : value?.substring(mentionIndex + 1, value?.length)

      const mentionTextEndIndex =
        mentionText?.indexOf(' ') > 0 ? mentionText?.indexOf(' ') : mentionText?.indexOf('<')
      if (mentionTextEndIndex === -1) {
        setMentionValue(mentionText?.substring(0, mentionText?.length))
      } else {
        setMentionValue(mentionText?.substring(0, mentionTextEndIndex))
      }
    }
  }, [value, mentionIndex])

  const onSelect = (selectValue: string) => {
    const beforMention = value?.substring(0, mentionIndex)
    const afterMention = value?.substring(mentionIndex, value?.length)
    setValue(`${beforMention} ${afterMention.replace('@', selectValue)}`)
    hideMention()
  }

  useEffect(() => {
    let offset = null
    if (mentionSpanRef?.current) {
      offset = getElementOffset(mentionSpanRef.current!)
    } else {
      offset = getElementOffset(tempMentionSpanRef.current!)
    }
    setSpanOffset(offset)
  }, [mentionSpanRef.current, isMention])

  const RenderList = () => {
    return (
      <List sx={{ width: '100%', maxWidth: 500, bgcolor: 'background.paper' }}>
        {props?.items?.map((item, index) => {
          return (
            <ListItem key={index} component="div" disablePadding>
              <ListItemButton
                onClick={(event) => {
                  event?.stopPropagation()
                  onSelect(item?.value)
                }}
              >
                {props?.renderItem({ item })}
              </ListItemButton>
            </ListItem>
          )
        })}
      </List>
    )
  }

  return (
    <Box sx={{ position: 'relative', whiteSpace: 'pre-wrap' }} ref={ref}>
      <Typography
        component={'span'}
        ref={tempMentionSpanRef}
        sx={{ pointerEvents: 'none', color: 'transparent', marginTop: 60 }}
      >
        @
      </Typography>
      {isMention && mentionIndex != -1 && (
        <Box sx={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 }}>
          <Box
            sx={{
              position: 'absolute',
              left: 0,
              right: 0,
              top: 0,
              bottom: 0,
              pointerEvents: 'none',
              color: 'transparent',
              zIndex: -1,
              lineHeight: '38px',
              paddingTop: 13,
            }}
            ref={mentionDivRef}
          >
            {value?.slice(0, mentionIndex)}

            <Typography component={'span'} ref={mentionSpanRef}>
              {mentionValue}
            </Typography>
            {value?.slice(mentionIndex + mentionValue?.length + 1)}
          </Box>
          <Box
            onMouseEnter={() => setMouseEnterMentionBox(true)}
            onMouseLeave={() => setMouseEnterMentionBox(false)}
            sx={{
              background: 'white',
              borderRadius: 2,
              boxShadow: '0 1px 5px rgba(0,0,0,.2)',
              maxHeight: 300,
              overflow: 'auto',
              width: 400,
              position: 'absolute',
              right: spanOffset.left - 395,
              top: spanOffset.top,
              zIndex: 999999,
            }}
          >
            {props?.paperComponent &&
              props.paperComponent({
                children: RenderList(),
              })}
            {!props?.paperComponent && RenderList()}
          </Box>
        </Box>
      )}
      {props.renderInput && props.renderInput({ onKeyDown, onClick, onChange, value, onBlur })}
    </Box>
  )
})

HBSuggest.displayName = 'HBSuggest'
HBSuggest.defaultProps = {
  renderInput: (params) => {
    return (
      <HBTextField
        fullWidth
        {...params}
        onChange={(event) => {
          params.onChange(event.target.value)
        }}
      />
    )
  },
}

export default HBSuggest
