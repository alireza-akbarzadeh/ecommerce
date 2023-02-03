import { BreadCrumbSection } from '@hasty-bazar/admin-shared/components/BreadCrumb'
import { HBExplanation } from '@hasty-bazar/admin-shared/containers/HBExplanation'
import { HBForm, HBIcon } from '@hasty-bazar/core'
import { Box, Typography } from '@mui/material'
import { useState } from 'react'
import { useDailySaleReportPageController } from '../../hooks'
import ReportDailySaleMessages, {
  default as DailySaleReportMessage,
} from '../../ReportDailySale.messages'
import { IDailySaleReportFormModel } from '../../types/IDailySaleReportFormModel'
import { DailySaleReportFilter, ReportDetailedDailySaleGrid } from '../index'

const DailySaleReportPage = () => {
  const [saleReport, setSaleReport] = useState([])
  const {
    breadcrumbs,
    handleSubmit,
    formatMessage,
    formProvider,
    formWatch,
    listenForm,
    setListenForm,
    setValue,
    expandable,
    setIsExpandable,
    reset,
    setPagination,
    fromValues,
  } = useDailySaleReportPageController({ setSaleReport })

  return (
    <>
      <BreadCrumbSection
        title={formatMessage(DailySaleReportMessage.dailySaleReport)}
        breadItems={breadcrumbs}
      />
      <HBExplanation
        elevation={0}
        expanded={expandable}
        sx={{
          borderRadius: (theme) => theme.spacing(4),
        }}
        onChange={() => setIsExpandable(!expandable)}
        summary={
          <Box display={'flex'} alignItems="center" gap={1}>
            <HBIcon type="shoppingBasket" />
            <Typography variant="h6">
              {formatMessage(ReportDailySaleMessages.dailySaleReport)}
            </Typography>
          </Box>
        }
        detail={
          <HBForm<IDailySaleReportFormModel>
            formProviderProps={formProvider}
            onSubmit={handleSubmit}
            mode="all"
          >
            <DailySaleReportFilter {...{ setListenForm, setValue, reset }} />
          </HBForm>
        }
      />
      {listenForm && (
        <Box
          bgcolor="common.white"
          px={8}
          pt={6}
          pb={10}
          mt={2}
          sx={{
            borderRadius: (theme) => theme.spacing(4),
            border: (theme) => `1px solid ${theme.palette.grey[200]}`,
          }}
        >
          {/* @ts-ignore */}
          <ReportDetailedDailySaleGrid
            {...{ formWatch, setSaleReport, saleReport, setPagination, fromValues }}
          />
        </Box>
      )}
    </>
  )
}

export default DailySaleReportPage
