import { Status } from '@hasty-bazar/admin-shared/components'
import { HBDataGridClientRef } from '@hasty-bazar/admin-shared/containers/HBDataGrid'
import { DownloadMethodType } from '@hasty-bazar/admin-shared/containers/HBDataGrid/useDataGrid'
import phrasesMessages from '@hasty-bazar-admin/core/translations/phrases.messages'
import {
  useDeleteAdminIdrPartiesByIdMutation,
  usePostAdminIdrPartiesExcelMutation,
} from '@hasty-bazar/admin-shared/services/idrApi.generated'
import { MenuItemProps, openToast } from '@hasty-bazar/core'
import {
  CheckboxSelectionCallbackParams,
  HeaderCheckboxSelectionCallbackParams,
  ICellRendererParams,
} from 'ag-grid-community'
import { RefObject } from 'react'
import { useIntl } from 'react-intl'
import { PasswordStatus } from '../../components'
import UserColumnLink from '../../components/UserColumnLink'
import userPageMessages from '../../UserPage.messages'

function useUserGrid(gridRef: RefObject<HBDataGridClientRef>) {
  const [deleteUser] = useDeleteAdminIdrPartiesByIdMutation()
  const { formatMessage } = useIntl()

  const checkboxSelection = function (params: CheckboxSelectionCallbackParams) {
    return params.columnApi.getRowGroupColumns().length === 0
  }

  const headerCheckboxSelection = function (params: HeaderCheckboxSelectionCallbackParams) {
    return params.columnApi.getRowGroupColumns().length === 0
  }

  const handleRemoveUser = async (
    userIds: string[],
    setLoading: (loading: boolean) => void,
    callback: () => void,
  ) => {
    const requests = userIds.map((id) => {
      return deleteUser({
        'client-name': 'hasty-bazar-admin',
        'client-version': '1.0.0',
        id,
      }).then((res) => {
        return res
      })
    })

    setLoading(true)
    let responses: any[] = []
    responses = await Promise.all(requests)
    const failed = responses.filter((res) => !res?.data?.success).length
    const success = responses.filter((res) => res?.data?.success).length

    if (success > 0) {
      openToast({
        message: formatMessage(userPageMessages.usersDeleteSuccessFully, { userCount: success }),
        type: 'success',
      })
    }
    setLoading(false)
    callback()
  }

  const userGridColumns = () => {
    return [
      {
        field: 'id',
        headerName: formatMessage(phrasesMessages.id),
        filter: 'agTextColumnFilter',
        minWidth: 100,
        cellRenderer: (params: ICellRendererParams) => params.value,
      },
      {
        field: 'firstName',
        headerName: formatMessage(phrasesMessages.name),
        filter: 'agTextColumnFilter',
        minWidth: 200,
        cellRenderer: UserColumnLink,
      },
      {
        field: 'lastName',
        headerName: formatMessage(phrasesMessages.lastName),
        filter: 'agTextColumnFilter',
        minWidth: 200,
        cellRenderer: UserColumnLink,
      },
      {
        field: 'mobile',
        headerName: formatMessage(phrasesMessages.phoneNumber),
        filter: 'agTextColumnFilter',
        minWidth: 150,
      },
      {
        field: 'email',
        headerName: formatMessage(phrasesMessages.email),
        filter: 'agTextColumnFilter',
        minWidth: 200,
      },
      {
        field: 'nationalCode',
        headerName: formatMessage(phrasesMessages.nationalCode),
        filter: 'agTextColumnFilter',
        minWidth: 200,
      },
      {
        field: 'passwordState',
        headerName: formatMessage(phrasesMessages.password),
        cellRenderer: PasswordStatus,
        filter: 'agNumberColumnFilter',
        minWidth: 150,
        cellRendererParams: {
          success: formatMessage(userPageMessages.passwordSuccess),
          expired: formatMessage(userPageMessages.passwordExpired),
          notSet: formatMessage(userPageMessages.passwordNoSet),
        },
      },
      {
        field: 'createdByFullName',
        headerName: formatMessage(userPageMessages.usersCreatedBy),
        filter: 'agTextColumnFilter',
        minWidth: 150,
      },
      {
        field: 'createdOn',
        headerName: formatMessage(userPageMessages.createdOn),
        filter: 'agDateColumnFilter',
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
        field: 'modifiedByFullName',
        headerName: formatMessage(userPageMessages.modifiedBy),
        filter: 'agTextColumnFilter',
        minWidth: 150,
      },
      {
        field: 'modifiedOn',
        headerName: formatMessage(userPageMessages.modifiedOn),
        filter: 'agDateColumnFilter',
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
        field: 'partyRoles',
        maxWidth: 300,
        headerName: formatMessage(userPageMessages.usersRoleTitle),
        filter: false,
        sortable: false,
        minWidth: 200,
        cellRenderer: (params: ICellRendererParams) => {
          let roles: Array<string> = []
          params.value.map((i: any) => roles.push(i.typeTitle))
          return roles.length ? roles.join(',') : '-'
        },
      },
      {
        field: 'isActive',
        headerName: formatMessage(userPageMessages.isActive),
        filter: 'agTextColumnFilter',
        maxWidth: 100,
        cellRenderer: Status,
        cellRendererParams: {
          active: formatMessage(phrasesMessages.active),
          inActive: formatMessage(phrasesMessages.deActive),
        },
      },
    ]
  }

  const [downloadFile] = usePostAdminIdrPartiesExcelMutation()

  const handleDownload = async (props: DownloadMethodType) => {
    const { filterFields, ...res } = props
    return await downloadFile({
      'client-name': 'hasty-bazar-admin',
      'client-version': '1.0.0',
      getPartiesExcelQueryFilter: {
        ...res,
        ...filterFields,
      },
    })
  }

  const handleDownloadPage = (isDownloadAll?: boolean) => {
    gridRef.current?.downloadGridData({
      downloadFileMethod: handleDownload,
      downloadAll: isDownloadAll,
    })
  }

  const userGridToolbarMenu = ({
    disabledOnNoSelected,
    disabledActive,
    disabledUnActive,
    handleChangeStatus,
    handleDownloadGrid,
  }: {
    disabledOnNoSelected: boolean
    disabledActive: boolean
    disabledUnActive: boolean
    handleChangeStatus?: (status: boolean) => void
    handleDownloadGrid?: () => void
  }): MenuItemProps[] => {
    return [
      {
        label: formatMessage(phrasesMessages.active),
        icon: 'toggleOn',
        disabled: disabledOnNoSelected || disabledActive,
        onClick: () => handleChangeStatus?.(true),
        show: !disabledActive,
      },
      {
        label: formatMessage(phrasesMessages.deActive),
        icon: 'toggleOff',
        disabled: disabledOnNoSelected || disabledUnActive,
        onClick: () => handleChangeStatus?.(false),
        show: !disabledUnActive,
      },
      {
        label: formatMessage(phrasesMessages.download),
        icon: 'fileDownload',
        onClick: handleDownloadPage,
      },
      {
        label: formatMessage(phrasesMessages.downloadAll),
        icon: 'fileDownloadAlt',
        onClick: () => handleDownloadPage(true),
      },
    ]
  }

  return {
    handleRemoveUser,
    checkboxSelection,
    headerCheckboxSelection,
    userGridColumns,
    userGridToolbarMenu,
  }
}

export default useUserGrid
