import { ColDef } from 'ag-grid-community'
import { useMemo } from 'react'
import { useIntl } from 'react-intl'
import messageTemplatePageMessages from '../MessageTemplate.messages'

const useMessageTemplateColumn = () => {
  const { formatMessage } = useIntl()
  const gridColumns = [
    {
      field: 'name',
      headerName: formatMessage(messageTemplatePageMessages.templateTitle),
      maxWidth: 300,
      minWidth: 300,
      filter: 'agTextColumnFilter',
    },
    {
      field: 'subject',
      headerName: formatMessage(messageTemplatePageMessages.messageSubject),
      maxWidth: 350,
      minWidth: 350,
      filter: 'agTextColumnFilter',
    },
  ]
  const autoGroupColumnDef = useMemo<ColDef>(() => {
    return {
      headerCheckboxSelection: true,
      cellRenderer: 'agGroupCellRenderer',
    }
  }, [])

  return { gridColumns, autoGroupColumnDef }
}
export default useMessageTemplateColumn
