import { ICellRendererParams } from 'ag-grid-community'

const CategoryAddress = (props: ICellRendererParams) => {
  const { categoryAddress } = props?.data
  return (
    <div>
      {categoryAddress?.map((Category: string[], index: number) => (
        <div key={index}>{Category}</div>
      ))}
    </div>
  )
}

export default CategoryAddress
