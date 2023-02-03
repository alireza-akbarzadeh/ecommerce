import { pascalCase } from '@hasty-bazar/admin-shared/utils/util'
import { HBButton, HBForm, HBIcon } from '@hasty-bazar/core'
import { Box, Typography } from '@mui/material'
import React from 'react'
import { useForm } from 'react-hook-form'
import { useIntl } from 'react-intl'
import crmMessages from '../../crm.message'
import { CrmFilterModel } from '../../types'
import CrmForm from './CrmForm'
export type CrmFilterProps = {
  changeFilter: (actionUrl?: string) => void
  partyId?: string
}

export default function CrmFilter({ changeFilter, partyId }: CrmFilterProps) {
  const { formatMessage } = useIntl()
  const formProvider = useForm<CrmFilterModel>({ mode: 'all' })

  const handleSubmit = (
    values: CrmFilterModel & {
      [key: string]: any
    },
  ) => {
    if (partyId) {
      values.partyId = partyId
    }
    let filter = ''
    Object.keys(values).forEach((key) => {
      if (key === 'partyId') {
        filter += `${pascalCase(key)}_Equal_--${pascalCase(key)} And `
      } else if (!key.includes('Date')) {
        const value =
          values[key]?.value || values[key]?.requestCategoryCode || values[key]?.caseSecondTypecode

        if (value) {
          filter += `${pascalCase(key)}_Equal_--${pascalCase(key)} And `
        }
      }
    })
    filter = filter.slice(0, -4).trim() + '&'
    Object.keys(values).forEach((key) => {
      if (key === 'partyId') {
        filter += `${pascalCase(key)}=${values[key]}&`
      } else if (!key.includes('Date')) {
        const value =
          values[key]?.value || values[key]?.requestCategoryCode || values[key]?.caseSecondTypecode
        if (value) {
          filter += `${pascalCase(key)}=${value}&`
        }
      } else {
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
      '/Admin/CRM/Tickets' +
      (filter?.length
        ? `?Filter=${filter}&ver=${new Date().getTime()}`
        : `?ver=${new Date().getTime()}`)

    changeFilter(actionUrl)
  }

  const handleReset = () => {
    formProvider.reset()
    changeFilter?.()
  }

  return (
    <Box bgcolor={'common.white'} p={6} mb={4}>
      <Typography
        sx={{ display: 'flex', alignItems: 'center', gap: 2, fontWeight: '700' }}
        variant="h6"
      >
        <HBIcon type="filter" />
        {formatMessage(crmMessages.crmFilterTitle)}
      </Typography>
      <Box my={8}>
        <HBForm formProviderProps={formProvider} onSubmit={handleSubmit}>
          <CrmForm />
          <Box mt={6} display="flex" justifyContent="space-between">
            <HBButton variant="outlined" onClick={handleReset}>
              {formatMessage(crmMessages.buttonClearSearch)}
            </HBButton>
            <HBButton type="submit">{formatMessage(crmMessages.buttonSearch)}</HBButton>
          </Box>
        </HBForm>
      </Box>
    </Box>
  )
}
