import instance from '@hasty-bazar/admin-shared/core/handler'
import { AxiosRequestConfig } from 'axios'
import { useState } from 'react'

let controller = new AbortController()
export function useUploader<TDataType, ResponseType>(
  {
    url,
    onError,
    onSuccess,
  }: {
    url: string
    onSuccess?: (data: ResponseType) => void
    onError?: (error: any) => void
  },
  options: AxiosRequestConfig = {
    headers: {
      'Content-Type': 'multipart/form-data',
      Accept: '*/*',
    },
  },
) {
  type uploadProgressType = {
    loaded?: number
    total?: number
    percentage?: number
  }
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [uploadProgress, setUploadProgress] = useState<uploadProgressType>({
    loaded: 0,
    percentage: 0,
    total: 0,
  })

  const [data, setData] = useState<ResponseType>()
  const [error, setError] = useState<any>(null)
  const onUploadProgress = ({ total, loaded }: any) => {
    const percentage = Math.floor((loaded / total) * 100)
    setUploadProgress({
      percentage,
      total,
      loaded,
    })
  }

  async function submitFormData(data: FormData) {
    setData(undefined)
    setError(null)

    try {
      const result = await instance
        .post<ResponseType>(url, data, {
          onUploadProgress,
          ...options,
          signal: controller.signal,
          headers: {
            'Content-Type': 'multipart/form-data',
            Accept: '*/*',
          },
          withCredentials: false,
        })
        .then((res) => {
          setData(res.data)
          return res.data
        })
      onSuccess?.(result)
      setData(result)
    } catch (error: any) {
      onError?.(error)
      setError((error?.response && error?.response) || error)
    } finally {
      setUploadProgress({
        loaded: 0,
        percentage: 0,
        total: 0,
      })
      setIsLoading(false)
      controller = new AbortController()
    }
  }

  function createFormData(data: any = {}) {
    const formData = new FormData()
    Object.keys(data).forEach((key) => {
      formData.append(key, data[key])
    })
    return formData
  }

  function submitForm(data: TDataType) {
    setIsLoading(true)
    const formData = createFormData(data)
    submitFormData(formData)
  }
  function cancelRequest() {
    controller.abort()
    controller = new AbortController()
  }

  return { isLoading, data, error, submitForm, uploadProgress, cancelRequest }
}

export default useUploader
