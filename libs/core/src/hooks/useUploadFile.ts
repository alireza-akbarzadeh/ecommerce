import { AxiosInstance } from 'axios'
import React, { useMemo } from 'react'

type useUploadFileReturnType = {
  filePath: string
  error: string | null
  isLoading: boolean
  handleChange: (promises: React.ChangeEvent<HTMLInputElement>) => Promise<void>
}
function useUploadFile(
  uploadServicePath: string,
  instance: AxiosInstance,
): useUploadFileReturnType {
  const [filePath, setFilePath] = React.useState<string>()
  const [error, setError] = React.useState<string | null>(null)
  const [isLoading, setIsLoading] = React.useState<boolean>(false)

  const handleChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = event.target
    if (files && files.length > 0) {
      setIsLoading(true)
      const formData = new FormData()
      formData.append('file', files[0])
      const res = await instance
        .post(`${uploadServicePath}`, formData)
        .then((res) => res.data)
        .catch((err) => err)
        .finally(() => {
          setIsLoading(false)
        })

      if (res?.success) {
        setFilePath(res.data.path)
        return res.data.path
      } else {
        setError(res)
        return null
      }
    }
  }

  return useMemo(() => {
    return {
      filePath,
      error,
      handleChange,
      isLoading,
    } as useUploadFileReturnType
  }, [filePath, error, isLoading])
}

export default useUploadFile
