import { Status } from '@hasty-bazar/admin-shared/components'
import { HBWorkflowState } from '@hasty-bazar/admin-shared/containers'
import { StateMachineCode } from '@hasty-bazar/admin-shared/core/enums'
import phrasesMessages from '@hasty-bazar-admin/core/translations/phrases.messages'
import { useGetAdminCmsMenugroupsGetStateInfoByStateCodeAndStateMachineCodeFactorQuery as useGetStateInfo } from '@hasty-bazar/admin-shared/services/cmsApi.generated'
import { ICellRendererParams } from 'ag-grid-community'
import { format } from 'date-fns-jalali'
import StructureInfoIcon from '../containers/menu-groups/structure-info-icon'
import MegaMenuPageMessages from '../MegaMenu.messages'

export function generateDataGrid(formatMessage: any) {
  return [
    {
      field: 'menuTypeTitle',
      headerName: formatMessage(MegaMenuPageMessages.menuType),
      filter: 'agTextColumnFilter',
      minWidth: 130,
      hide: false,
    },
    {
      field: 'code',
      headerName: formatMessage(MegaMenuPageMessages.code),
      filter: 'agNumberColumnFilter',
      minWidth: 100,
      hide: false,
    },
    {
      field: 'title',
      headerName: formatMessage(MegaMenuPageMessages.title),
      filter: 'agTextColumnFilter',
      minWidth: 200,
      hide: false,
    },
    {
      field: 'menuDirectionTitle',
      headerName: formatMessage(MegaMenuPageMessages.menuDirection),
      filter: 'agTextColumnFilter',
      minWidth: 130,
      hide: false,
    },
    {
      field: 'menuDisplayTypeTitle',
      headerName: formatMessage(MegaMenuPageMessages.menuDisplayType),
      filter: 'agTextColumnFilter',
      minWidth: 130,
      hide: false,
    },
    {
      field: 'platformTypeTitle',
      headerName: formatMessage(MegaMenuPageMessages.platformType),
      filter: 'agTextColumnFilter',
      minWidth: 130,
      hide: false,
    },
    {
      field: '',
      headerName: formatMessage(MegaMenuPageMessages.treeStructureInfo),
      filter: false,
      sortable: false,
      resizable: false,
      minWidth: 150,
      hide: false,
      cellRenderer: (params: ICellRendererParams) => (
        <StructureInfoIcon selectedId={params.data?.id} />
      ),
    },
    {
      field: 'activeFromDate',
      headerName: formatMessage(MegaMenuPageMessages.activeFromDate),
      filter: 'agTextColumnFilter',
      minWidth: 200,
      hide: false,
      cellRenderer: ({ value }: any) => format(new Date(value), 'HH:mm - yyyy/MM/dd'),
    },
    {
      field: 'status',
      headerName: formatMessage(MegaMenuPageMessages.step),
      filter: 'agNumberColumnFilter',
      minWidth: 100,
      hide: false,
      cellRenderer: ({ data }: ICellRendererParams) => (
        <HBWorkflowState
          factor="1"
          machineCode={StateMachineCode.MegaMenu}
          stateCode={data?.stateCode}
          useGetStateInfo={useGetStateInfo}
        />
      ),
    },
    {
      field: 'description',
      headerName: formatMessage(MegaMenuPageMessages.description),
      filter: 'agTextColumnFilter',
      minWidth: 300,
      hide: false,
    },
    {
      field: 'isActive',
      headerName: formatMessage(MegaMenuPageMessages.statusIdField),
      filter: 'agNumberColumnFilter',
      maxWidth: 100,
      hide: true,
      cellRenderer: Status,
      cellRendererParams: {
        active: formatMessage(phrasesMessages.active),
        inActive: formatMessage(phrasesMessages.deActive),
      },
    },
  ]
}
