import { CommerceIconButton } from '@hasty-bazar-commerce/components'
import { ApiConstants } from '@hasty-bazar-commerce/core/constants'
import { usePutWebCatalogCommerceFavoriteProductByIdMutation } from '@hasty-bazar-commerce/services/catalogApi.generated'
import { HBTextField } from '@hasty-bazar/core'
import { outlinedInputClasses, Stack, styled, Typography } from '@mui/material'
import { FC, useRef, useState } from 'react'
import { useIntl } from 'react-intl'
import FavoriteMessages from '../favorite.messages'

const NoteWrapperStyle = styled(Stack)(({ theme }) => ({
  position: 'relative',
}))

const InputStyle = styled(HBTextField)(({ theme }) => ({
  marginTop: theme.spacing(4),
  '& fieldset': {
    borderColor: theme.palette.grey[300],
  },
  [`& .${outlinedInputClasses.root}`]: {
    paddingBottom: theme.spacing(10.5),
  },
}))

interface IFavoriteNoteProps {
  note: string
  id: string
}

const FavoriteNote: FC<IFavoriteNoteProps> = (props) => {
  const { note, id } = props
  const { formatMessage } = useIntl()
  const [noteValue, setNoteValue] = useState<string>(note ?? '')
  const [isChanged, setIsChanged] = useState<boolean>(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const [updateMutation, { isLoading: updateLoading }] =
    usePutWebCatalogCommerceFavoriteProductByIdMutation()
  const [removeMutation, { isLoading: removeLoading }] =
    usePutWebCatalogCommerceFavoriteProductByIdMutation()

  const updateNote = async () => {
    try {
      await updateMutation({
        ...ApiConstants,
        id,
        updateFavoriteProductModel: { note: noteValue },
      })
      setIsChanged(false)
    } catch (e) {}
  }

  const handleChangeNote = (value: string) => {
    if (value.length <= 100) {
      setNoteValue(value)
      setIsChanged(true)
    }
  }

  const handleRemoveNote = async () => {
    try {
      await removeMutation({
        ...ApiConstants,
        id,
        updateFavoriteProductModel: { note: '' },
      })
      setIsChanged(false)
      setNoteValue('')
    } catch (e) {}
  }

  return (
    <Stack spacing={1}>
      <NoteWrapperStyle
        spacing={2.5}
        justifyContent="space-between"
        onClick={(e) => {
          e.stopPropagation()
          inputRef.current?.focus()
        }}
      >
        <InputStyle
          inputRef={inputRef}
          value={noteValue}
          onChange={(e) => {
            handleChangeNote(e.target.value)
          }}
          minRows={2}
          label={formatMessage({ ...FavoriteMessages.addNote })}
          multiline
        />

        <Stack
          direction="row"
          alignItems="center"
          justifyContent="flex-end"
          spacing={2}
          sx={{ position: 'absolute', right: 10, bottom: 10 }}
        >
          {noteValue.length > 0 && (
            <CommerceIconButton
              sx={{
                border: (theme) => `1px solid ${theme.palette.grey[300]}`,
                color: (theme) => `${theme.palette.error.main}!important`,
              }}
              icon="trashAlt"
              onClick={handleRemoveNote}
              loading={removeLoading}
            />
          )}
          {isChanged && (
            <CommerceIconButton
              onClick={updateNote}
              sx={{
                // border: (theme) => `1px solid ${theme.palette.grey[300]}`,
                color: (theme) => `${theme.palette.common.white}!important`,
                backgroundColor: 'primary.main',
              }}
              icon="check"
              loading={updateLoading}
            />
          )}
        </Stack>
      </NoteWrapperStyle>
      <Stack direction="row" justifyContent="flex-end">
        <Typography variant="caption" color="text.secondary">
          {noteValue.length.toString()}/۱۰۰
        </Typography>
      </Stack>
    </Stack>
  )
}

export default FavoriteNote
