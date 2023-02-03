import { GridActionColumn } from '@hasty-bazar/admin-shared/components'
import phrasesMessages from '@hasty-bazar-admin/core/translations/phrases.messages'
import { ICellRendererParams } from 'ag-grid-community'
import { useIntl } from 'react-intl'

export interface CertificateGridActionColumnProps extends ICellRendererParams {
  handleEditCertificate?: (id: string) => void
  setDeleteDialogState?: ({ show, id }: { show: boolean; id: string }) => void
}

export default function CertificateGridActionColumn({
  handleEditCertificate,
  setDeleteDialogState,
  ...props
}: CertificateGridActionColumnProps) {
  const { formatMessage } = useIntl()

  return (
    <GridActionColumn
      {...props}
      menuItems={[
        {
          label: formatMessage(phrasesMessages.public),
          children: [
            {
              icon: 'pen',
              label: formatMessage(phrasesMessages.edit),
              onClick: () => handleEditCertificate?.(props.data.certificateId),
            },
            {
              icon: 'trashAlt',
              label: formatMessage(phrasesMessages.delete),
              onClick: () => setDeleteDialogState?.({ show: true, id: props.data.certificateId }),
            },
          ],
        },
      ]}
    />
  )
}
