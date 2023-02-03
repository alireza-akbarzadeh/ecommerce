import { HBIcon } from '@hasty-bazar/core'
import { outlinedInputClasses, TextField, useTheme } from '@mui/material'
import phrasesMessages from 'libs/core/src/translations/phrases.messages'
import * as React from 'react'
import { useIntl } from 'react-intl'

interface InputSearchProps {
  value: string
  handleChange: (value: string) => void
}

const SearchInMenu = (props: InputSearchProps) => {
  const { formatMessage } = useIntl()
  const theme = useTheme()

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value
    props.handleChange(inputValue)
  }

  return (
    <TextField
      InputProps={{
        startAdornment: <HBIcon type="searchAlt" sx={{ color: theme.palette.grey[300] }} />,
      }}
      onChange={handleChange}
      size="small"
      value={props.value}
      type="text"
      placeholder={formatMessage(phrasesMessages.search)}
      sx={{
        backgroundColor: theme.palette.common.white,
        color: theme.palette.grey[400],
        [`& .${outlinedInputClasses.focused} i`]: {
          color: theme.palette.grey[900],
        },
        '& input': {
          p: 0,
          m: 1,
          width: 132,
          height: 32,
        },
        top: 60,
        position: 'fixed',
        padding: theme.spacing(2, 5),
      }}
    />
  )
}

export default SearchInMenu
