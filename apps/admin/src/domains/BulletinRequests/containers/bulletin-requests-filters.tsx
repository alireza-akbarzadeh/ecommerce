import { GetNewsLetterQueryByIdResult } from '@hasty-bazar/admin-shared/services/socialApi.generated'
import { pascalCase } from '@hasty-bazar/admin-shared/utils/util'
import { HBButton, HBForm } from '@hasty-bazar/core'
import { Box } from '@mui/material'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useIntl } from 'react-intl'
import bulletinRequestsMessages from '../bulletinRequests.messages'
import BulletinRequestsFiltersFormItems from './bulletin-requests-filters-form-items'

type BulletinRequestsFiltersProps = {
  changeFilter: (actionUrl?: string) => void
}

type NewsLetterType = Omit<GetNewsLetterQueryByIdResult, 'newsLetterEnum'> & {
  newsLetterEnum?: {
    fullCode?: string | null
  } | null
}

const BulletinRequestsFilters = (props: BulletinRequestsFiltersProps) => {
  const { changeFilter } = props
  const { formatMessage } = useIntl()

  const formProviderProps = useForm<NewsLetterType>({
    mode: 'all',
    defaultValues: {
      emailAddress: '',
      partyFullName: '',
      newsLetterEnum: null,
      newsLetterEnumTitle: null,
      registerDate: '',
      cancelRegisterDate: '',
    },
  })

  const handleSubmit = (values: NewsLetterType) => {
    let filter = ''
    Object.keys(values).forEach((key) => {
      if (key === 'newsLetterEnum') {
        if (values[key]?.fullCode) {
          filter += `${pascalCase(key)}_Equal_--${pascalCase(key)} And `
        }
      } else if (!key.includes('Date')) {
        //@ts-ignore
        const value = values[key]
        if (value) {
          filter += `${pascalCase(key)}.Contains(--${pascalCase(key)}) And `
        }
      }
    })
    filter = filter.slice(0, -4).trim() + '&'
    Object.keys(values).forEach((key) => {
      if (key === 'newsLetterEnum') {
        const value = values[key]?.fullCode
        if (value) {
          filter += `${pascalCase(key)}=${value}&`
        }
      } else if (!key.includes('Date')) {
        //@ts-ignore
        const value = values[key]
        if (value) {
          filter += `${pascalCase(key)}=${value}&`
        }
      } else {
        //@ts-ignore
        const value = values[key]
        if (value) {
          filter += `${pascalCase(key)}=${new Date(value)?.toLocaleDateString('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
          })}&`
        }
      }
    })
    filter = filter.slice(0, -1)
    const actionUrl =
      process.env.NEXT_PUBLIC_GATEWAY +
      '/Admin/Social/newsLetters/GetAll' +
      (filter?.length
        ? `?Filter=${filter}&ver=${new Date().getTime()}`
        : `?ver=${new Date().getTime()}`)
    changeFilter(actionUrl)
  }

  const handleReset = () => {
    formProviderProps.reset()
    changeFilter?.(process.env.NEXT_PUBLIC_GATEWAY + '/Admin/Social/newsLetters/GetAll')
  }

  useEffect(() => {
    handleSubmit(formProviderProps.control._defaultValues)
  }, [])

  return (
    <Box mt={6}>
      <HBForm formProviderProps={formProviderProps} onSubmit={handleSubmit}>
        <BulletinRequestsFiltersFormItems />
        <Box mt={4} display="flex" justifyContent="space-between">
          <HBButton variant="outlined" onClick={handleReset}>
            {formatMessage(bulletinRequestsMessages.removeFilter)}
          </HBButton>
          <HBButton type="submit">{formatMessage(bulletinRequestsMessages.submitFilter)}</HBButton>
        </Box>
      </HBForm>
    </Box>
  )
}
export default BulletinRequestsFilters
