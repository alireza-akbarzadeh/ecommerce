import { BreadCrumbSection } from '@hasty-bazar/admin-shared/components/BreadCrumb'
import phrasesMessages from '@hasty-bazar-admin/core/translations/phrases.messages'
import useToast from '@hasty-bazar/admin-shared/hooks/useToast'
import {
  CreateTransactionTypeModel,
  useGetAdminAccountingApiTransactionTypeByIdQuery,
  usePostAdminAccountingApiTransactionTypeMutation,
  usePutAdminAccountingApiTransactionTypeByIdMutation,
} from '@hasty-bazar/admin-shared/services/accountingApi.generated'
import { HBForm } from '@hasty-bazar/core'
import { Box, Typography } from '@mui/material'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useIntl } from 'react-intl'
import TypeOfFinancialEventsMessages from '../typeOfFinancialEvents.message'
import Form from './Form'

type FinancialEventsType = CreateTransactionTypeModel

const AddEditPage = () => {
  const { formatMessage } = useIntl()
  const router = useRouter()
  const { showToast } = useToast()
  const id = router.query.id?.[0]
  const financialEvents = useForm({ mode: 'all' })
  const [financialEventsAdd] = usePostAdminAccountingApiTransactionTypeMutation()
  const [financialEventsEdit] = usePutAdminAccountingApiTransactionTypeByIdMutation()

  const breadcrumbs = [
    {
      url: '/',
      title: formatMessage(phrasesMessages.dashboard),
    },
    {
      url: '/typeOfFinancialEvents/',
      title: formatMessage(TypeOfFinancialEventsMessages.typeOfFinancialEventsInfo),
    },
    {
      url: '#',
      title: id
        ? formatMessage(TypeOfFinancialEventsMessages.typeOfFinancialEventsEdit)
        : formatMessage(TypeOfFinancialEventsMessages.typeOfFinancialEventsAdd),
    },
  ]

  const { data: saleFinancialEventsData, refetch } =
    useGetAdminAccountingApiTransactionTypeByIdQuery(
      {
        'client-name': 'admin',
        'client-version': '1.0.0',
        id: id!,
      },
      { skip: !id },
    )

  useEffect(() => {
    if (id) {
      financialEvents.reset({ ...saleFinancialEventsData?.data })
    }
  }, [saleFinancialEventsData])

  const onSubmit = (data: FinancialEventsType) => {
    if (id) {
      financialEventsEdit({
        'client-name': 'cms',
        'client-version': 'v1',
        id,
        updateTransactionTypeModel: {
          ...data,
        },
      }).then((res: any) => {
        if (res?.data?.success) {
          showToast(formatMessage(TypeOfFinancialEventsMessages.updateSuccess), 'success')
        }
      })
    } else {
      financialEventsAdd({
        'client-name': 'cms',
        'client-version': 'v1',
        createTransactionTypeModel: {
          ...data,
        },
      }).then((res: any) => {
        if (res?.data?.success) {
          const currentPageId = res?.data?.data?.id
          showToast(formatMessage(TypeOfFinancialEventsMessages.addSuccess), 'success')
          router.replace(`/typeOfFinancialEvents/edit/${currentPageId}`)
        }
      })
    }
  }

  return (
    <>
      <BreadCrumbSection
        title={formatMessage(TypeOfFinancialEventsMessages.typeOfFinancialEvents)}
        breadItems={breadcrumbs || []}
      />
      <Box
        bgcolor="common.white"
        px={8}
        pt={6}
        pb={10}
        sx={{
          borderRadius: (theme) => theme.spacing(4),
          border: (theme) => `1px solid ${theme.palette.grey[200]}`,
          minHeight: 300,
        }}
      >
        <Typography variant="h5">
          {formatMessage(TypeOfFinancialEventsMessages.typeOfFinancialEventsInfo)}
        </Typography>
        <HBForm<FinancialEventsType>
          onSubmit={onSubmit}
          mode="all"
          formProviderProps={id ? financialEvents : undefined}
        >
          <Form refetch={refetch} />
        </HBForm>
      </Box>
    </>
  )
}

export default AddEditPage
