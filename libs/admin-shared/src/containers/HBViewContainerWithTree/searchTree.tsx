import phrasesMessages from '@hasty-bazar/admin-shared/core/translations/phrases.messages'
import { HBClassesType, HBIcon, HBIconButton, HBTextField } from '@hasty-bazar/core'
import Box from '@mui/material/Box'
import { useEffect, useState } from 'react'
import { useIntl } from 'react-intl'

type HBPageClassnames = 'root' | 'angleIcon' | 'input'

const classes: HBClassesType<HBPageClassnames> = {
  root: ({ palette, spacing }) => ({
    backgroundColor: palette.grey[200],
    p: 4,
    display: 'flex',
  }),
  angleIcon: ({ palette, spacing }) => ({
    mr: 2,
    color: palette.grey[700],
    background: palette.common.white,
    borderRadius: spacing(2),
    width: 45,
    height: 40,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }),
  input: ({ palette, spacing }) => ({
    backgroundColor: '#FFF',
    borderRadius: spacing(2),
    '& .MuiOutlinedInput-root': {
      '& > fieldset': { borderColor: palette.grey[200] },
    },
    '& .MuiOutlinedInput-root.Mui-focused': {
      '& > fieldset': {
        borderRadius: spacing(2),
      },
    },
    '& .MuiOutlinedInput-root:hover': {
      '& > fieldset': {
        borderRadius: spacing(2),
      },
    },
  }),
}

type SearchTreeProps = {
  handleSearch?: (search: string) => void
}

const SearchTree = ({ handleSearch = () => {} }: SearchTreeProps) => {
  const { formatMessage } = useIntl()
  const [search, setSearch] = useState('')

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      handleSearch(search)
    }, 400)
    return () => clearTimeout(delayDebounceFn)
  }, [search])

  return (
    <Box sx={classes.root}>
      <HBIconButton icon="angleDown" sx={classes.angleIcon} />
      <HBIconButton icon="angleUp" sx={classes.angleIcon} />
      <HBTextField
        sx={classes.input}
        fullWidth
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder={`${formatMessage(phrasesMessages.search)}...`}
        InputProps={{
          startAdornment: (
            <HBIcon type="search" sx={{ mr: 2, color: ({ palette }) => palette.grey[300] }} />
          ),
        }}
      />
    </Box>
  )
}
export default SearchTree
