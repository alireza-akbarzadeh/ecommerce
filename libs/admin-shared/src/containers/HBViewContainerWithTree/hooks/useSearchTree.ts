import { useTheme } from '@mui/material'
import { useRef } from 'react'
import { useIntl } from 'react-intl'
import { SearchTreeProps } from '../types/SearchTreeProps'

export const useSearchTree = (props: SearchTreeProps) => {
  const { handleSearch = () => {} } = props
  const { formatMessage } = useIntl()
  const { spacing } = useTheme()
  const delayDebounceFn = useRef<any>()

  const onChange = (e: any) => {
    const value = e?.target?.value
    clearTimeout(delayDebounceFn.current)
    delayDebounceFn.current = setTimeout(() => {
      handleSearch(value)
    }, 400)
  }
  return { onChange, formatMessage, spacing }
}
