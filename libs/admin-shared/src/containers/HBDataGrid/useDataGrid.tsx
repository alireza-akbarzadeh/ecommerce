import { downloadExcelUrl, getGridOptions } from '@hasty-bazar/admin-shared/utils/downloadUrl'
import { ColDef } from 'ag-grid-community'
import { AgGridReact } from 'ag-grid-react'
import { MutableRefObject, useMemo } from 'react'
import Crypto from 'crypto-js'

const PASSWORD = 'dartilDB@123'

export type UseDataGridType = {
  gridRef: MutableRefObject<AgGridReact | null>
}

type Header = {
  nativeName?: string | null | undefined
  faName?: string | null | undefined
}

export type DownloadMethodType = {
  ordering?: string | null
  pageNumber?: number
  pageSize?: number
  filter?: string | null
  headers?: Header[] | null
  filterFields: object
}

export type DownloadType = {
  downloadFileMethod: (props: DownloadMethodType) => Promise<any>
  downloadAll?: boolean
  pageNumber?: number
}

function useDataGrid({ gridRef }: UseDataGridType) {
  const defaultColDefInner = useMemo<ColDef>(() => {
    return {
      filter: true,
      flex: 1,
      floatingFilterComponentParams: {
        suppressFilterButton: true,
      },
    }
  }, [])

  function serialize(obj: { [key: string]: any }, prefix: any) {
    const str = []
    for (const p in obj)
      if (obj.hasOwnProperty(p) && obj[p]) {
        str.push(encodeURIComponent(p) + '=' + encodeURIComponent(obj[p]))
      }
    return str.join('&')
  }

  const gridLoading = (show: boolean) => {
    if (show) {
      gridRef?.current!.api?.showLoadingOverlay()
    } else {
      gridRef?.current!.api?.hideOverlay()
    }
  }

  function downloadGrid({ downloadFileMethod, downloadAll, pageNumber }: DownloadType) {
    const { filter, filterFields, headers, pageSize, sortFields } = getGridOptions(
      gridRef,
      downloadAll,
    )

    downloadFileMethod({
      filter: filter ? filter : undefined,
      ordering: sortFields ? sortFields : undefined,
      headers,
      pageNumber,
      pageSize,
      filterFields,
    }).then((res: any) => {
      if (res?.data?.success) {
        const url = res?.data?.data?.excelFile
        downloadExcelUrl(url)
      }
    })
  }

  function encryptData(data: object | string) {
    return Crypto.AES.encrypt(JSON.stringify(data), PASSWORD).toString()
  }

  function decryptData(data: string) {
    return JSON.parse(Crypto.AES.decrypt(data, PASSWORD)?.toString(Crypto.enc.Utf8))
  }

  return { defaultColDefInner, serialize, gridLoading, downloadGrid, encryptData, decryptData }
}

export default useDataGrid
