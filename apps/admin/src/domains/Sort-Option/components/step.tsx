import phrasesMessages from '@hasty-bazar-admin/core/translations/phrases.messages'
import { Box } from '@mui/material'
import { ICellRendererParams } from 'ag-grid-community'
import { useIntl } from 'react-intl'
export interface ParamsValueType extends ICellRendererParams {
  active?: string
  inActive?: string
}

export type AlertElementType = {
  value?: string
  status: 'draft' | 'release'
}

export const AlertElement = ({ value, status }: AlertElementType) => {
  return (
    <Box
      color={status === 'draft' ? 'warning.main' : 'success.main'}
      bgcolor={status === 'draft' ? 'warning.light' : 'success.light'}
      borderRadius={2}
      padding={1}
      component="span"
    >
      {value}
    </Box>
  )
}

export default function Step({ value }: ParamsValueType) {
  const { formatMessage } = useIntl()
  return (
    <Box>
      {value === 1 ? (
        <AlertElement value={formatMessage(phrasesMessages.draft)} status="draft" />
      ) : (
        <AlertElement value={formatMessage(phrasesMessages.release)} status="release" />
      )}
    </Box>
  )
}
