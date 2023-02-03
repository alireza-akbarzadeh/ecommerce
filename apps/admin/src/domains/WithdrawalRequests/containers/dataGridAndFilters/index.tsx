import { HBDataGridClient } from '@hasty-bazar/admin-shared/containers/HBDataGrid'
import useDataGrid from '../../hooks/useDataGrid'
import useColumns from '../../hooks/useColumns'
import { ACTION_URL } from '../../variables'
import FiltersForm from '../filters'

function DataGridAndFilters() {
  const { columns } = useColumns()
  const {
    gridRef,
    classes,
    walletList,
    gridToolbar,
    handleFilters,
    handleResetFilters,
    handleChangedSelectedRows,
  } = useDataGrid()

  return (
    <>
      <FiltersForm onFilter={handleFilters} onResetFilter={handleResetFilters} />

      <HBDataGridClient
        sideBar
        enableRtl
        animateRows
        ref={gridRef}
        classes={classes}
        detailRowAutoHeight
        columnDefs={columns}
        editType={'fullRow'}
        actionUrl={ACTION_URL}
        rowSelection="multiple"
        GridToolbar={gridToolbar}
        onSelectedChanged={handleChangedSelectedRows}
        rowData={[...walletList.map((item) => ({ ...item }))]}
      />
    </>
  )
}

export default DataGridAndFilters
