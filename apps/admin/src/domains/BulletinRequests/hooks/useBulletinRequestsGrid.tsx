import phrasesMessages from '@hasty-bazar-admin/core/translations/phrases.messages'
import { ICellRendererParams } from 'ag-grid-community'
import { AgGridReact } from 'ag-grid-react'
import { RefObject, useMemo } from 'react'
import { useIntl } from 'react-intl'
import bulletinRequestsMessages from '../bulletinRequests.messages'

const useBulletinRequestsGrid = ({ gridRef }: { gridRef: RefObject<AgGridReact> }) => {
  const { formatMessage } = useIntl()

  const columnDefs = useMemo(
    () => [
      {
        field: 'id',
        headerName: formatMessage(phrasesMessages.id),
        hide: true,
        filter: 'agTextColumnFilter',
      },
      {
        field: 'row',
        headerName: formatMessage(bulletinRequestsMessages.row),
        filter: 'agTextColumnFilter',
        minWidth: 120,
        maxWidth: 120,
        cellRenderer: (params: ICellRendererParams) => {
          return params.rowIndex + 1
        },
      },
      {
        field: 'emailAddress',
        headerName: formatMessage(bulletinRequestsMessages.email),
        filter: 'agTextColumnFilter',
        minWidth: 150,
      },
      {
        field: 'partyFullName',
        headerName: formatMessage(bulletinRequestsMessages.user),
        filter: 'agTextColumnFilter',
        minWidth: 150,
      },
      {
        field: 'newsLetterEnumTitle',
        headerName: formatMessage(bulletinRequestsMessages.type),
        filter: 'agTextColumnFilter',
        minWidth: 150,
      },
      {
        field: 'registerDate',
        headerName: formatMessage(bulletinRequestsMessages.registryDate),
        filter: 'agTextColumnFilter',
        minWidth: 150,
        cellRenderer: (params: ICellRendererParams) => {
          return params.value
            ? new Date(params.value).toLocaleDateString('fa-IR', {
                month: '2-digit',
                day: '2-digit',
                year: 'numeric',
              })
            : '-'
        },
      },
      {
        field: 'cancelRegisterDate',
        headerName: formatMessage(bulletinRequestsMessages.cancelDate),
        filter: 'agTextColumnFilter',
        minWidth: 150,
        cellRenderer: (params: ICellRendererParams) => {
          return params.value
            ? new Date(params.value).toLocaleDateString('fa-IR', {
                month: '2-digit',
                day: '2-digit',
                year: 'numeric',
              })
            : '-'
        },
      },
    ],
    [gridRef.current?.api?.getSelectedRows()],
  )

  return {
    columnDefs,
  }
}
export default useBulletinRequestsGrid
