import phrasesMessages from '@hasty-bazar-admin/core/translations/phrases.messages'
import { buttonClasses, Theme, Typography } from '@mui/material'
import { useIntl } from 'react-intl'
import FaqPageMessages from '../FaqPage.messages'

function useFormData() {
  const { formatMessage } = useIntl()

  const relatedPageColumns = [
    {
      field: 'title',
      width: 175,
      headerName: formatMessage(FaqPageMessages.pageTitle),
      showInChip: true,
    },
    {
      field: 'isPublish',
      width: 175,
      headerName: formatMessage(FaqPageMessages.publishState),
      showInChip: false,
      cellRenderer: () => (
        <Typography
          sx={({ spacing }) => ({
            color: 'success.main',
            bgcolor: 'success.light',
            borderRadius: spacing(1.5),
            p: spacing(1, 2.5),
            height: 24,
          })}
          px={3}
          variant="caption"
          component="span"
        >
          {formatMessage(phrasesMessages.release)}
        </Typography>
      ),
    },
    { field: 'id', width: 110, headerName: 'id', hidden: true, isIdField: true },
  ]
  const disableButtonStyle = {
    [`&.${buttonClasses.disabled}`]: {
      bgcolor: 'primary.main',
      opacity: '0.3',
      color: 'background.paper',
    },
  }

  const readonlyFieldStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    border: (theme: Theme) => `1px solid ${theme.palette.grey[400]}`,
    borderRadius: (theme: Theme) => theme.spacing(1),
    minHeight: 50,
    px: 8,
    py: 4,
    width: '100%',
  }
  return {
    relatedPageColumns,
    disableButtonStyle,
    readonlyFieldStyle,
  }
}
export default useFormData
