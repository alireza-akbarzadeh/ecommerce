import { GridActionMenuProps } from '@hasty-bazar/admin-shared/components'
import phrasesMessages from '@hasty-bazar-admin/core/translations/phrases.messages'
import {
  useDeleteAdminIdrPartiesByIdRolesMutation,
  usePostAdminIdrPartiesByIdRolesMutation,
} from '@hasty-bazar/admin-shared/services/idrApi.generated'
import { errorsToString } from '@hasty-bazar/admin-shared/utils'
import { openToast } from '@hasty-bazar/core'
import { ICellRendererParams } from 'ag-grid-community'
import { AgGridReact } from 'ag-grid-react'
import { RefObject } from 'react'
import { useIntl } from 'react-intl'
import userPageMessages from '../../UserPage.messages'
import { RolesDataGridProps } from '../UserRoleDataGrid'

function useRoleGrid(userId: string, gridRef: RefObject<AgGridReact>) {
  const [deleteRole] = useDeleteAdminIdrPartiesByIdRolesMutation()
  const [submitUserRole] = usePostAdminIdrPartiesByIdRolesMutation()

  const { formatMessage } = useIntl()

  const gridLoading = (show: boolean) => {
    if (show) {
      gridRef.current!.api.showLoadingOverlay()
    } else {
      gridRef.current!.api.hideOverlay()
    }
  }

  const removeUserRole = ({ roleId, callback }: { roleId?: string; callback: () => void }) => {
    if (typeof roleId !== 'string' && typeof roleId !== 'number') {
      roleId = undefined
    }
    gridLoading(true)
    deleteRole({
      'client-name': 'hasty-bazar-admin',
      'client-version': '1.0.0',
      id: userId,
      unAssignPartyRoleModel: {
        roleId,
      },
    })
      .then((res: any) => {
        if (res?.data?.success) callback()
        else {
          openToast({
            message: errorsToString(res?.error) || formatMessage(userPageMessages.removeRoleError),
            type: 'error',
          })
        }
      })
      .catch((e) => {})
      .finally(() => {
        gridLoading(false)
      })
  }

  const gridMenuItems = ({
    props,
    handleRemoveRole,
  }: {
    props: ICellRendererParams
    handleRemoveRole: (roleId?: string) => void
  }) => {
    let items: GridActionMenuProps[] = [
      {
        label: formatMessage(phrasesMessages.public),
        children: [
          {
            icon: 'trashAlt',
            disabled: true,
            label: formatMessage(phrasesMessages.delete),
            onClick: () => {
              handleRemoveRole(props.data?.type)
            },
          },
        ],
      },
    ]

    return items
  }

  const addUsersRole = (callback: () => void) => {
    try {
      const row = {
        createdOn: null,
        createdBy: '',
        title: '',
        state: 0,
        platform: '-',
        isAdd: true,
      }
      gridRef.current!.api.applyTransaction({
        add: [row],
        addIndex: 0,
      })
      callback()
    } catch (e) {}
  }

  const getAllRows = () => {
    let rowData: RolesDataGridProps[] = []
    gridRef.current!.api.forEachNode((node) => rowData.push(node.data))
    return rowData
  }

  const cancelSubmitRole = (callback: () => void) => {
    let rowData = gridRef.current!.api.getModel().getRow(0)
    gridRef.current!.api.applyTransaction({
      remove: [rowData?.data],
    })!
    callback()
  }

  const submitUsersRole = async (callback: () => void) => {
    const newRow = gridRef.current!.api.getModel().getRow(0)
    if (!newRow?.data?.typeTitle) {
      openToast({
        message: formatMessage(userPageMessages.roleRequired),
        type: 'error',
      })
      return
    }

    let rowData = getAllRows()

    if (rowData.filter((role) => role?.type === newRow?.data.typeTitle && role?.id).length > 0) {
      openToast({
        message: formatMessage(userPageMessages.roleExist),
        type: 'error',
      })
      return
    }
    gridLoading(true)
    submitUserRole({
      'client-name': 'hasty-bazar-admin',
      'client-version': '1.0.0',
      id: userId,
      assignPartyRoleModel: {
        roleId: newRow?.data.typeTitle,
      },
    })
      .then((res: any) => {
        if (res?.data?.success) callback()
        else {
          openToast({
            message: errorsToString(res?.error) || formatMessage(userPageMessages.addRoleError),
            type: 'error',
          })
        }
      })
      .catch((e) => {})
      .finally(() => {
        gridLoading(false)
      })
  }
  return {
    gridLoading,
    removeUserRole,
    gridMenuItems,
    addUsersRole,
    getAllRows,
    cancelSubmitRole,
    submitUsersRole,
  }
}

export default useRoleGrid
