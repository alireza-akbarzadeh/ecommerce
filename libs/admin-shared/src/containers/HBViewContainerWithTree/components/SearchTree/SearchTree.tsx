import phrasesMessages from '@hasty-bazar/admin-shared/core/translations/phrases.messages'
import { HBIcon, HBIconButton, HBTextField } from '@hasty-bazar/core'
import Box from '@mui/material/Box'
import { useRouter } from 'next/router'
import { ChangeEvent, useEffect, useState } from 'react'
import { useSearchTree } from '../../hooks/useSearchTree'
import { SearchTreeProps } from '../../types/SearchTreeProps'
import { searchTreeClasses as classes } from './SearchTree.classes'

const SearchTree = (props: SearchTreeProps) => {
  const { onChange, formatMessage, spacing } = useSearchTree(props)

  const { id, treeItems, onIncrementLevel, onDecrementLevel } = props

  const router = useRouter()

  const [text, setText] = useState('')

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const search = e?.target?.value
    setText(search)
    if (id) {
      localStorage.setItem(`tree_${id}`, JSON.stringify({ search }))
    }
    onChange?.(e)
  }

  useEffect(() => {
    if (Number(treeItems?.length) > 0) {
      const _treeStorage = localStorage.getItem?.(`tree_${id}`)
      if (_treeStorage) {
        const _parsedTreeStorage = JSON.parse(_treeStorage)
        if (_parsedTreeStorage?.search) {
          setText(_parsedTreeStorage?.search)
          onChange?.({ target: { value: _parsedTreeStorage?.search } })
        }
      }
    }
  }, [treeItems])

  useEffect(() => {
    const _treeStorage = localStorage.getItem?.(`tree_${id}`)
    if (_treeStorage) {
      const _parsedTreeStorage = JSON.parse(_treeStorage)
      if (!_parsedTreeStorage?.search) {
        setText('')
        onChange?.({ target: { value: '' } })
      }
    }
  }, [router.asPath])

  return (
    <Box sx={classes.root}>
      <HBIconButton icon="angleDown" sx={classes.angleIcon} onClick={onIncrementLevel} />
      <HBIconButton icon="angleUp" sx={classes.angleIcon} onClick={onDecrementLevel} />
      <HBTextField
        sx={classes.input}
        fullWidth
        onChange={handleChange}
        value={text}
        placeholder={`${formatMessage(phrasesMessages.search)}...`}
        InputProps={{
          startAdornment: (
            <HBIcon type="searchAlt" sx={{ fontSize: spacing(5), mr: 2, color: 'grey.300' }} />
          ),
        }}
      />
    </Box>
  )
}
export default SearchTree
