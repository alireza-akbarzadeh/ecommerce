import { CircularProgressWithLabel } from '@hasty-bazar/admin-shared/components'
import useUploader from '@hasty-bazar/admin-shared/hooks/useUploadFile'
import { PostAdminCatalogProductsBulkUpdateLoadListApiResponse } from '@hasty-bazar/admin-shared/services/catalogApi.generated'
import { errorsToString } from '@hasty-bazar/admin-shared/utils'

import { HBButton, HBIcon } from '@hasty-bazar/core'
import { Stack, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import { useIntl } from 'react-intl'
import ProductBulkEditMessages from '../../ProductBulkEdit.messages'

interface UploadComponentProps {
  onUpload: (data: { data: PostAdminCatalogProductsBulkUpdateLoadListApiResponse }) => void
  disabled?: boolean
  setLoading?: (value: boolean) => void
}

type UploadDataType = {
  'client-name': string
  'client-version': string
  FormFile: File | undefined
}
function UploadComponent({ onUpload, disabled, setLoading }: UploadComponentProps) {
  const { formatMessage } = useIntl()
  const [errorMessage, setErrorMessage] = useState<string>()
  const [file, setFile] = useState<File>()
  const url = `${process.env.NEXT_PUBLIC_GATEWAY}/Admin/Catalog/products/bulk-update/load-list`
  const {
    data,
    error,
    cancelRequest,
    isLoading,
    submitForm,
    uploadProgress: { percentage },
  } = useUploader<UploadDataType, PostAdminCatalogProductsBulkUpdateLoadListApiResponse>({
    url,
  })

  const onChooseFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMessage(undefined)
    const _file = event.target.files?.[0]

    const formData = {
      'client-name': 'hasty-bazar-admin',
      'client-version': '1.0.0',
      FormFile: _file,
    }
    setFile(_file)

    if (_file) {
      submitForm(formData)
    }
  }

  useEffect(() => {
    if (data && file) {
      onUpload({
        data,
      })
    }
    setLoading?.(isLoading)
  }, [isLoading, data])

  return (
    <Stack
      component="label"
      htmlFor="file"
      sx={{
        width: '120px',
        minWidth: '120px',
        minHeight: '120px',
        overflow: 'hidden',
        borderRadius: 2,
        height: '120px',
        border: ({ palette }) => '1px dashed ' + palette.grey[500],
      }}
      display="flex"
      flexDirection="column"
      alignItems="center"
      gap={error ? 2 : 4.5}
      justifyContent="center"
    >
      {isLoading ? (
        <>
          <CircularProgressWithLabel value={percentage! || 0} color="info" showTick />
          <HBButton
            onClick={(event) => {
              event.preventDefault()
              event.stopPropagation()
              cancelRequest()
            }}
            size="small"
            variant="text"
          >
            <Typography variant="caption" color="info.main">
              {formatMessage(ProductBulkEditMessages.cancel)}
            </Typography>
          </HBButton>
        </>
      ) : (
        <>
          <HBIcon
            type="upload"
            sx={{
              color: 'grey.500',
            }}
          />
          <Typography variant="subtitle2" color="grey.500">
            {formatMessage(ProductBulkEditMessages.uploadFile)}
          </Typography>
          {error && error?.message !== 'canceled' && (
            <Typography textAlign={'center'} variant="caption" color="error.main">
              {errorsToString(error)}
            </Typography>
          )}

          {errorMessage && (
            <Typography textAlign={'center'} variant="caption" color="error.main">
              {errorMessage}
            </Typography>
          )}
        </>
      )}
      <input
        disabled={disabled}
        accept=".xlsx, .xls, .csv"
        onChange={onChooseFile}
        type="file"
        id="file"
        hidden
      />
    </Stack>
  )
}

export default UploadComponent
