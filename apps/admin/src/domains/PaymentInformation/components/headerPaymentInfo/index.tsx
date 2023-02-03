import { BreadCrumbSection } from '@hasty-bazar/admin-shared/components/BreadCrumb'
import HBDatePickerController from '@hasty-bazar/admin-shared/containers/HBDatePickerController'
import { HBExplanation } from '@hasty-bazar/admin-shared/containers/HBExplanation'
import phrasesMessages from '@hasty-bazar-admin/core/translations/phrases.messages'
import {
  GetAdminPaymentPaymentApiArg,
  useLazyGetAdminPaymentPaymentQuery,
} from '@hasty-bazar/admin-shared/services/paymentApi.generated'
import {
  GetAdminSalePaymentInformationApiArg,
  GetPaymentInformationQueryResult,
} from '@hasty-bazar/admin-shared/services/saleApi.generated'
import { HBButton, HBForm } from '@hasty-bazar/core'
import { Box, Grid, Typography } from '@mui/material'
import { RefObject, useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { useIntl } from 'react-intl'
import paymentInfoMessage from '../../paymentInfo.message'
interface IHeaderPaymentInfo {
  setPaymentInfo: (val: GetPaymentInformationQueryResult) => void
  formRef: RefObject<HTMLButtonElement>
}
const HeaderPaymentInfo = ({ setPaymentInfo, formRef }: IHeaderPaymentInfo) => {
  const { formatMessage } = useIntl()
  const [expandable, setExpandable] = useState<boolean>(false)
  const [getAdminPaymentPayment] = useLazyGetAdminPaymentPaymentQuery()

  const breadcrumbs = [
    {
      url: '/',
      title: formatMessage(phrasesMessages.home),
    },
    {
      url: '#',
      title: formatMessage(paymentInfoMessage.paymentMangeInfo),
    },
  ]
  const formProvider = useForm<GetAdminPaymentPaymentApiArg>({ mode: 'all' })

  const { isValid } = formProvider.formState

  const { fromDate, toDate } = useWatch({
    control: formProvider.control,
  })

  const handleSubmit = (value: GetAdminPaymentPaymentApiArg) => {
    const data = {
      toDate: toDate
        ? new Date(value?.toDate!)
            .toLocaleDateString('en-US', {
              month: '2-digit',
              day: '2-digit',
              year: 'numeric',
            })
            .replace(/\//g, '-')
        : undefined,
      fromDate: fromDate
        ? new Date(value?.fromDate!)
            .toLocaleDateString('en-US', {
              month: '2-digit',
              day: '2-digit',
              year: 'numeric',
            })
            .replace(/\//g, '-')
        : undefined,
    }

    getAdminPaymentPayment({
      'client-name': '',
      'client-version': '',
      ...data,
    }).then((res: any) => {
      setPaymentInfo(res?.data?.data as GetPaymentInformationQueryResult)
      setExpandable(false)
    })
  }

  return (
    <Box mb={expandable ? 2 : 0.1}>
      <BreadCrumbSection
        title={formatMessage(paymentInfoMessage.paymentMangeInfo)}
        breadItems={breadcrumbs}
      />
      <HBExplanation
        elevation={0}
        expanded={expandable}
        sx={{
          borderRadius: (theme) => theme.spacing(4),
        }}
        onChange={() => setExpandable(!expandable)}
        summary={
          <Typography variant="h5">{formatMessage(paymentInfoMessage.paymentMangeInfo)}</Typography>
        }
        detail={
          <HBForm<GetAdminSalePaymentInformationApiArg>
            formProviderProps={formProvider}
            onSubmit={handleSubmit}
            mode="all"
          >
            <Grid container spacing={7}>
              <Grid item xs={12} sm={6} md={4} lg={3}>
                <HBDatePickerController
                  defaultValue={new Date()}
                  label={`${formatMessage(paymentInfoMessage.fromDate)}*`}
                  name={'fromDate'}
                  formRules={{ required: true }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4} lg={3}>
                <HBDatePickerController
                  label={`${formatMessage(paymentInfoMessage.toDate)}`}
                  name={'toDate'}
                  formRules={{ required: false }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4} lg={6}>
                <Box display="flex" justifyContent={'flex-end'}>
                  <HBButton ref={formRef} disabled={!isValid} type="submit">
                    {formatMessage(paymentInfoMessage.filtering)}
                  </HBButton>
                </Box>
              </Grid>
            </Grid>
          </HBForm>
        }
      />
    </Box>
  )
}

export default HeaderPaymentInfo
