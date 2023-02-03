import phrasesMessages from '@hasty-bazar-admin/core/translations/phrases.messages'
import { MenuItemProps } from '@hasty-bazar/core'
import { useIntl } from 'react-intl'

function useCertificateGrid() {
  const { formatMessage } = useIntl()

  const userGridColumns = () => {
    return [
      {
        field: 'id',
        headerName: formatMessage(phrasesMessages.id),
        filter: 'agNumberColumnFilter',
        minWidth: 100,
        hide: true,
      },
    ]
  }

  const userGridToolbarMenu = ({
    disabledOnNoSelected,
    disabledActive,
    disabledUnActive,
    handleChangeStatus,
  }: {
    disabledOnNoSelected: boolean
    disabledActive: boolean
    disabledUnActive: boolean
    handleChangeStatus: (status: number) => void
  }): MenuItemProps[] => {
    return [
      {
        label: formatMessage(phrasesMessages.active),
        icon: 'toggleOn',
        disabled: disabledOnNoSelected || disabledActive,
        onClick: () => handleChangeStatus(1),
        show: !disabledActive,
      },
      {
        label: formatMessage(phrasesMessages.deActive),
        icon: 'toggleOff',
        disabled: disabledOnNoSelected || disabledUnActive,
        onClick: () => handleChangeStatus(0),
        show: !disabledUnActive,
      },
      {
        label: formatMessage(phrasesMessages.download),
        icon: 'arrowDown',
        disabled: disabledOnNoSelected,
      },
    ]
  }

  return {
    userGridColumns,
    userGridToolbarMenu,
  }
}

export default useCertificateGrid
