import { DownloadMethodType } from '@hasty-bazar/admin-shared/containers/HBDataGrid/useDataGrid'
import phrasesMessages from '@hasty-bazar-admin/core/translations/phrases.messages'
import {
  CreateGeoModel,
  usePostAdminLocalityGeosDownloadExcelFileMutation,
} from '@hasty-bazar/admin-shared/services/localityApi.generated'
import { errorsToString } from '@hasty-bazar/admin-shared/utils'
import { downloadExcelUrl } from '@hasty-bazar/admin-shared/utils/downloadUrl'
import { openToast } from '@hasty-bazar/core'
import { useRouter } from 'next/router'
import { isEmpty } from 'ramda'
import { Dispatch, SetStateAction, useEffect } from 'react'
import { useIntl } from 'react-intl'
import DataGrigToolbar, { DataGrigToolbarCallbackProps } from '../components/DataGrigToolbar'
import { FORM_ID } from '../Geographical'
import geographicalMessages from '../Geographical.messages'
import { useDeleteAdminLocalityGeosByIdMutation } from '../localityApi.enhanced'
export type ShowTostType = {
  open: boolean
  message: string
  type?: 'error' | 'success'
}

export type GeoForm = CreateGeoModel

interface PageTitleProps {
  onDeleteSuccess: () => void
  refetch: () => void
  onCreate: () => void
  setSelectedNodeId: Dispatch<SetStateAction<string>>
}

export default function PageTitleBar({
  onDeleteSuccess,
  refetch,
  onCreate,
  setSelectedNodeId,
}: PageTitleProps) {
  const { formatMessage } = useIntl()
  const router = useRouter()
  const action = router.query.action as string
  const id = router.query?.id as string

  const [deleteGeo, { error: deleteError, isSuccess: deleteIsSuccess, reset: deleteReset }] =
    useDeleteAdminLocalityGeosByIdMutation()

  const handleClick: (props: DataGrigToolbarCallbackProps) => void = async ({ type }) => {
    deleteReset()

    if (type === 'delete') {
      deleteGeo({
        'client-name': 'deleteGeoModel',
        'client-version': '1.0.0',
        id: id! as unknown as string,
      })
    }

    if (type === 'refresh') {
      refetch()
    }
  }
  useEffect(() => {
    if (deleteError) {
      if (!isEmpty(deleteError)) {
        openToast({ type: 'error', message: errorsToString(deleteError) })
      }
    }
  }, [deleteError])

  useEffect(() => {
    if (deleteIsSuccess) {
      onDeleteSuccess()
      router.push('/geographical', undefined, { shallow: true })
    }
  }, [deleteIsSuccess])

  const [downloadFile] = usePostAdminLocalityGeosDownloadExcelFileMutation()
  const handleDownload = async (props: DownloadMethodType) => {
    const { filterFields, ...res } = props
    return await downloadFile({
      'client-name': 'hasty-bazar-admin',
      'client-version': '1.0.0',
      getGeosExcelQueryFilter: {
        ...res,
        ...filterFields,
      },
    })
  }

  const handleDownloadPage = () => {
    handleDownload({
      filter: undefined,
      ordering: undefined,
      headers: [
        {
          faName: formatMessage(geographicalMessages.countryName),
          nativeName: 'countryName',
        },
        {
          faName: formatMessage(geographicalMessages.provinceName),
          nativeName: 'provinceName',
        },
        {
          faName: formatMessage(geographicalMessages.cityName),
          nativeName: 'cityName ',
        },
        {
          faName: formatMessage(geographicalMessages.areaName),
          nativeName: 'areaName',
        },
        {
          faName: 'GeoTypeTypeCode',
          nativeName: 'geoTypeTypeCode ',
        },
        {
          faName: 'GeoTypeValueCode',
          nativeName: 'GeoTypeValueCode ',
        },
        { faName: 'GeoTypeValueName', nativeName: 'GeoTypeValueName' },
        {
          faName: 'ParentId',
          nativeName: 'ParentId ',
        },
        { faName: 'ParentTitle', nativeName: 'ParentTitle' },
        {
          faName: 'LatinTitle',
          nativeName: 'LatinTitle',
        },
        {
          faName: 'Code',
          nativeName: 'Code',
        },
        { faName: 'AreaCode', nativeName: 'AreaCode' },
        {
          faName: 'Path',
          nativeName: 'Path',
        },
        {
          faName: 'Depth',
          nativeName: 'Depth',
        },
        { faName: 'Lat', nativeName: 'Lat' },
        {
          faName: 'Lng',
          nativeName: 'Lng',
        },
        {
          faName: 'PolygonJson',
          nativeName: 'PolygonJson',
        },
        { faName: 'IconUrl', nativeName: 'IconUrl' },
        {
          faName: 'NumberOfChildren',
          nativeName: 'NumberOfChildren',
        },
      ],
      pageNumber: 1,
      pageSize: 100000,
      filterFields: {},
    }).then((res: any) => {
      if (res?.data?.success) {
        const url = res?.data?.data?.excelFile
        downloadExcelUrl(url)
      }
    })
  }

  const handleRefresh = () => {
    setSelectedNodeId('')
    router.push({ pathname: '/geographical' })
  }

  return (
    <DataGrigToolbar
      searchProps={{ show: false }}
      deleteProps={{
        disabled: action !== 'edit',
      }}
      addProps={{
        form: FORM_ID,
        type: 'submit',
        tooltip: formatMessage(phrasesMessages.save),
      }}
      createProps={{
        tooltip: formatMessage(phrasesMessages.create),
        onClick: onCreate,
        disabled: !!action,
      }}
      refreshProps={{ onClick: handleRefresh }}
      items={[
        {
          label: formatMessage(phrasesMessages.downloadAll),
          icon: 'fileDownloadAlt',
          onClick: () => handleDownloadPage(),
        },
      ]}
      editProps={{ show: false }}
      onClick={handleClick}
    />
  )
}
