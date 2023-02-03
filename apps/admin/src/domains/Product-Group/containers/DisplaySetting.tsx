import HBGrid from '@hasty-bazar/admin-shared/containers/HBDataGrid'
import {
  useDeleteAdminCatalogCategoriesByIdDisplayConfigsAndSectionIdMutation,
  useGetAdminCatalogCategoriesByIdDisplayConfigsQuery,
  usePostAdminCatalogCategoriesByIdDisplayConfigsMutation,
  usePutAdminCatalogCategoriesByIdDisplayConfigsAndSectionIdMutation,
} from '@hasty-bazar/admin-shared/services/catalogApi.generated'
import {
  SectionByContentQueryResult,
  useGetAdminCmsPagesPlatformTypeByPlatformTypeNameAndNameQuery,
} from '@hasty-bazar/admin-shared/services/cmsApi.generated'
import { HBIconButton } from '@hasty-bazar/core'
import { Box, Stack, Typography } from '@mui/material'
import { RowDragEvent } from 'ag-grid-community'
import { AgGridReact } from 'ag-grid-react'
import { useRouter } from 'next/router'
import { FC, useEffect, useMemo, useRef, useState } from 'react'
import { useIntl } from 'react-intl'
import productGroupMessages from '../ProductGroup.messages'

type DisplaySettingProps = {}

const DisplaySetting: FC<DisplaySettingProps> = () => {
  const { formatMessage } = useIntl()

  const actionUrl = ''
  const destinationGridRef = useRef<AgGridReact>(null)
  const originGridRef = useRef<AgGridReact>(null)
  const { query: { slug: [, id] = [] } = {} } = useRouter()
  const [originDataGrid, setOriginDataGrid] = useState<
    SectionByContentQueryResult[] | null | undefined
  >(null)

  const { data: { data: originDataGridData } = {}, refetch: refetchOriginDataGrid } =
    useGetAdminCmsPagesPlatformTypeByPlatformTypeNameAndNameQuery(
      {
        'client-name': 'test',
        'client-version': '0',
        name: 'CategoryDefaultPage',
        platformType: 1021001,
      },
      {
        skip: !id,
      },
    )

  const {
    data: { data: { items: destinationDataGrid = [] } = {} } = {},
    refetch: refetchDestinationDataGrid,
  } = useGetAdminCatalogCategoriesByIdDisplayConfigsQuery(
    {
      'client-name': 'test',
      'client-version': '0',
      id,
      ordering: 'displayConfigOrder asc',
    },
    {
      skip: !id,
    },
  )

  useEffect(() => {
    if (originDataGridData?.pageParts?.length) {
      const originData = originDataGridData?.pageParts.find(
        (item) => item.originName === 'Dynamic',
      )?.sections
      setOriginDataGrid(
        originData?.filter((o) => !destinationDataGrid?.some((des) => des.sectionId === o.id)),
      )
    }
  }, [originDataGridData, destinationDataGrid])

  const [createCatalogCategory] = usePostAdminCatalogCategoriesByIdDisplayConfigsMutation()

  const [deleteCatalogCategory] =
    useDeleteAdminCatalogCategoriesByIdDisplayConfigsAndSectionIdMutation()

  const [editCatalogCategory] = usePutAdminCatalogCategoriesByIdDisplayConfigsAndSectionIdMutation()

  const originColumnDefs = useMemo(
    () => [
      {
        headerName: formatMessage(productGroupMessages.row),
        checkboxSelection: true,
        valueGetter: 'node.rowIndex + 1',
        suppressMenu: true,
        sortable: false,
        maxWidth: 90,
      },
      {
        field: 'name',
        headerName: formatMessage(productGroupMessages.originColumnName),
        suppressMenu: true,
        sortable: false,
        minWidth: 120,
      },
    ],
    [],
  )

  const destinationColumnDefs = useMemo(
    () => [
      {
        field: '_actions',
        headerName: '',
        maxWidth: 70,
        resizable: false,
        sortable: false,
        filter: false,
        suppressAutoSize: true,
        suppressMenu: true,
        showRowGroup: true,
        rowDrag: true,
      },
      {
        headerName: formatMessage(productGroupMessages.row),
        valueGetter: 'node.rowIndex + 1',
        suppressMenu: true,
        checkboxSelection: true,
        sortable: false,
        maxWidth: 90,
      },
      {
        field: 'sectionName',
        headerName: formatMessage(productGroupMessages.sectionName),
        suppressMenu: true,
        sortable: false,
        minWidth: 120,
      },
    ],
    [],
  )

  const createDisplayConfig = async () => {
    const selectedNodes = originGridRef.current?.api?.getSelectedNodes()
    const destinationNodesLength = destinationGridRef.current?.api.getRenderedNodes()
      .length as number
    if (!selectedNodes || selectedNodes?.length === 0) return

    let index = 1
    for (const node of selectedNodes) {
      await createCatalogCategory({
        'client-name': 'test',
        'client-version': '0',
        id,
        assignCategoryDisplayConfigModel: {
          sectionId: node.data.id,
          sectionName: node.data.name,
          displaySortOrder: destinationNodesLength + index,
        },
      })
      index++
    }

    refetchDestinationDataGrid()
    refetchOriginDataGrid()
  }

  const deleteDisplayConfig = async () => {
    const selectedNodes = destinationGridRef.current?.api?.getSelectedNodes()
    if (!selectedNodes || selectedNodes?.length === 0) return

    for (const selectNode of selectedNodes) {
      await deleteCatalogCategory({
        'client-name': 'test',
        'client-version': '0',
        id,
        sectionId: selectNode.data?.sectionId,
      })
    }

    refetchDestinationDataGrid()
    refetchOriginDataGrid()
  }

  const handleDragDestinationItems = async (event: RowDragEvent) => {
    if (!destinationGridRef.current) return
    await editCatalogCategory({
      'client-name': 'test',
      'client-version': '0',
      sectionId: event.node.data.sectionId,
      id,
      changeOrderAssignedCategoryDisplayConfigModel: {
        sectionName: event.node.data.sectionName,
        displaySortOrder:
          event.overIndex === -1
            ? destinationGridRef.current?.api.getRenderedNodes().length
            : event.overIndex + 1,
      },
    })
    refetchDestinationDataGrid()
    destinationGridRef.current?.api.refreshCells()
  }

  return (
    <Stack direction="row" alignItems="center" spacing={2}>
      <Box sx={{ width: '100%' }}>
        <Typography sx={{ mb: 2 }} variant="subtitle1">
          {formatMessage(productGroupMessages.displaySettingSelected)}
        </Typography>
        <HBGrid
          actionUrl={actionUrl}
          columnDefs={destinationColumnDefs}
          rowModelType={'clientSide'}
          rowData={destinationDataGrid}
          rowDragManaged={true}
          enableRtl
          rowSelection="multiple"
          ref={destinationGridRef}
          onRowDragEnd={handleDragDestinationItems}
          onRowDragMove={(event: RowDragEvent) => {
            if (event.overIndex === -1) return
          }}
          noToolbar
          suppressMoveWhenRowDragging
        />
      </Box>
      <Stack spacing={2}>
        <HBIconButton
          icon="angleRight"
          sx={{
            backgroundColor: 'grey.200',
            color: 'text.primary',
          }}
          onClick={createDisplayConfig}
        />
        <HBIconButton
          icon="angleLeft"
          sx={{
            backgroundColor: 'grey.200',
            color: 'text.primary',
          }}
          onClick={deleteDisplayConfig}
        />
      </Stack>
      <Box sx={{ width: '100%' }}>
        <Typography sx={{ mb: 2 }} variant="subtitle1">
          {formatMessage(productGroupMessages.displaySettingAvailable)}
        </Typography>

        <HBGrid
          actionUrl={actionUrl}
          columnDefs={originColumnDefs}
          rowModelType={'clientSide'}
          rowData={originDataGrid}
          enableRtl
          rowSelection="multiple"
          ref={originGridRef}
          noToolbar
        />
      </Box>
    </Stack>
  )
}

export default DisplaySetting
