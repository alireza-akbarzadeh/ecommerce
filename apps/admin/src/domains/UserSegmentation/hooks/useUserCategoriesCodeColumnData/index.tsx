import { DownloadMethodType } from '@hasty-bazar/admin-shared/containers/HBDataGrid/useDataGrid'
import { RoleType } from '@hasty-bazar/admin-shared/core/enums/RoleType'
import phrasesMessages from '@hasty-bazar-admin/core/translations/phrases.messages'
import { usePostAdminGeneralDataUserSegmentationByIdDownloadResultExcelFileMutation } from '@hasty-bazar/admin-shared/services/generalDataApi.generated'
import { useGetAdminIdrPartiesQuery } from '@hasty-bazar/admin-shared/services/idrApi.generated'
import { HBSelectMultiColumn, HBTextField, MenuItemProps } from '@hasty-bazar/core'
import { ICellRendererParams } from 'ag-grid-community'
import { useRouter } from 'next/router'
import { useCallback, useMemo } from 'react'
import { useIntl } from 'react-intl'
import QueryResultGridActionColumn from '../../components/userQueryGridColumnActions'
import { UserTypeCode } from '../../enums/UserCategoriesFormEnum'
import UserCategoriesMessage from '../../messages/UserCategoriesMessage'
import { IQueryResultData } from '../../types/IUserCategories'
import { CellBoxStyle, Status, sx } from './columnStyle'
const useUserCategoriesCodeColumnData = ({
  setDeleteDialogState,
  selectedRows,
  checkboxSelection,
  headerCheckboxSelection,
  gridRef,
  data,
}: IQueryResultData) => {
  const { formatMessage } = useIntl()
  const router = useRouter()
  const id = router.query.id?.[0] as string

  const checkAccountRoleParty = (key: number) => {
    switch (key) {
      case UserTypeCode.Customer:
        return RoleType.customer
      case UserTypeCode.Vendor:
        return RoleType.vendor
      case UserTypeCode.User:
        return undefined
    }
  }
  const { data: usersApi } = useGetAdminIdrPartiesQuery(
    {
      'client-name': '',
      'client-version': '',
      isActive: true,
      roleAccountParty: checkAccountRoleParty(data?.userTypeCode!),
      filter: 'IsActive_Equal_--IsActive',
      pageSize: 1000,
    },
    {
      skip: !data?.userTypeCode,
    },
  )

  const GridActions = useCallback(
    (props: ICellRendererParams) => {
      return <QueryResultGridActionColumn setDeleteDialogState={setDeleteDialogState} {...props} />
    },
    [selectedRows],
  )

  const vendorColumn = [
    {
      field: 'fullName',
      width: 140,
      headerName: formatMessage(UserCategoriesMessage.accountPartyName),
      showInChip: true,
    },
    {
      field: 'mobile',
      width: 140,
      headerName: formatMessage(phrasesMessages.phoneNumber),
      showInChip: false,
    },
    { field: 'id', width: 5, headerName: 'id', hidden: true, isIdField: true },
  ]

  const columnDefs = useMemo(
    () => [
      {
        field: '_actions',
        headerName: '',
        maxWidth: 110,
        minWidth: 110,
        resizable: false,
        sortable: false,
        filter: false,
        suppressAutoSize: true,
        suppressMenu: true,
        checkboxSelection,
        headerCheckboxSelection,
        showRowGroup: true,
        cellRenderer: 'agGroupCellRenderer',
        cellRendererParams: {
          suppressCount: true,
          suppressDoubleClickExpand: true,
          innerRenderer: GridActions,
        },
      },

      {
        field: 'fullName',
        maxWidth: 270,
        headerName: formatMessage(UserCategoriesMessage.accountPartyName),
        filter: 'agTextColumnFilter',
        cellRenderer: ({ setValue, data }: ICellRendererParams) =>
          data?.isAddUser ? (
            <CellBoxStyle>
              <HBSelectMultiColumn
                label={formatMessage(UserCategoriesMessage.accountPartyName)}
                items={usersApi?.data?.items || []}
                onChange={(_, newValue) => {
                  if (setValue) {
                    setValue(newValue)
                  }
                }}
                sx={sx}
                columnDefs={vendorColumn}
                pageSize={15}
                totalItems={usersApi?.data?.items?.length!}
                value={data?.fullName}
              />
            </CellBoxStyle>
          ) : (
            data?.fullName || ' - '
          ),
      },
      {
        maxWidth: 200,
        field: 'mobile',
        headerName: formatMessage(phrasesMessages.phoneNumber),
        filter: 'agTextColumnFilter',
        cellRenderer: ({ setValue, data }: ICellRendererParams) =>
          data?.isAddPhone ? (
            <CellBoxStyle>
              <HBTextField
                label={formatMessage(phrasesMessages.phoneNumber)}
                type={'number'}
                onChange={(event) => setValue?.(event?.target?.value)}
                value={data?.mobile}
              />
            </CellBoxStyle>
          ) : (
            data?.mobile || ' - '
          ),
      },
      {
        maxWidth: 200,
        field: 'roleTitle',
        headerName: formatMessage(UserCategoriesMessage.accountPartyRole),
        filter: 'agTextColumnFilter',
        cellRenderer: ({ value }: ICellRendererParams) => (value ? value : '-'),
      },
      {
        maxWidth: 180,
        field: 'isActive',
        headerName: formatMessage(UserCategoriesMessage.accountPartyStatus),
        filter: 'agTextColumnFilter',
        cellRenderer: ({ data, value }: ICellRendererParams) =>
          data?.isAdd ? (
            '-'
          ) : (
            <Status
              mt={2.5}
              p={1}
              color={value ? 'secondary.main' : 'error.main'}
              bgcolor={value ? 'secondary.lighter' : 'error.lighter'}
            >
              {formatMessage(value ? phrasesMessages.active : phrasesMessages.deActive)}
            </Status>
          ),
      },
      {
        field: 'creationTypeCodeTitle',
        headerName: formatMessage(UserCategoriesMessage.saveType),
        filter: 'agTextColumnFilter',
        cellRenderer: ({ value }: ICellRendererParams) => (value ? value : '-'),
      },
    ],
    [gridRef.current?.api?.getSelectedRows()],
  )

  const [postAdminGeneralDataUserSegmentationByIdDownloadResultExcelFile] =
    usePostAdminGeneralDataUserSegmentationByIdDownloadResultExcelFileMutation()

  const handleDownload = async (props: DownloadMethodType) => {
    const { filterFields, ...res } = props
    return await postAdminGeneralDataUserSegmentationByIdDownloadResultExcelFile({
      'client-name': 'hasty-bazar-admin',
      'client-version': '1.0.0',
      getUserSegmentationResultsExcelFileQueryFilter: {
        ...res,
        ...filterFields,
      },
      id,
    })
  }

  const handleDownloadPage = (isDownloadAll?: boolean) => {
    gridRef?.current?.downloadGridData({
      downloadFileMethod: handleDownload,
      downloadAll: isDownloadAll,
    })
  }

  const toolbarMoreItems = useMemo<MenuItemProps[]>(() => {
    return [
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
  }, [selectedRows])

  return { columnDefs, toolbarMoreItems, GridActions }
}

export default useUserCategoriesCodeColumnData
