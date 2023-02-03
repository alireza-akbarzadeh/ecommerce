import { HBClassesType } from '@hasty-bazar/core'
import { Divider, Typography } from '@mui/material'
import { useState } from 'react'
import { useIntl } from 'react-intl'
import FinancialTransactionMessage from '../../financialTransaction.message'

type HBPageClassNames = 'items' | 'divider'
const classes: HBClassesType<HBPageClassNames> = {
  items: {
    p: 2,
    cursor: 'pointer',
  },
  divider: {
    color: (theme) => theme.palette.grey[200],
  },
}

interface useCreateGridToolbarProps {
  onClose: () => void
  handleShowDialog: () => void
}

const useCreateGridToolbar = ({ onClose, handleShowDialog }: useCreateGridToolbarProps) => {
  const { formatMessage } = useIntl()
  const [excelType, setExcelType] = useState<
    'generalExcel' | 'vendorsExcel' | 'shippingCompaniesExcel' | 'wallets'
  >()

  const handleClick = (
    type: 'generalExcel' | 'vendorsExcel' | 'shippingCompaniesExcel' | 'wallets',
  ) => {
    onClose()
    setExcelType(type)
    handleShowDialog()
  }

  const createPopoverItems = () => {
    return (
      <>
        <Typography sx={classes.items} onClick={() => handleClick('generalExcel')}>
          {formatMessage(FinancialTransactionMessage.generalExcelFileOfPurchaseInformation)}
        </Typography>
        <Divider sx={classes.divider} />
        <Typography sx={classes.items} onClick={() => handleClick('vendorsExcel')}>
          {formatMessage(FinancialTransactionMessage.excelFileOfVendorsInvoices)}
        </Typography>
        <Divider sx={classes.divider} />
        <Typography sx={classes.items} onClick={() => handleClick('shippingCompaniesExcel')}>
          {formatMessage(FinancialTransactionMessage.excelFileOfInvoicesOfShippingCompanies)}
        </Typography>
        <Divider sx={classes.divider} />
        <Typography sx={classes.items} onClick={() => handleClick('wallets')}>
          {formatMessage(FinancialTransactionMessage.excelFileWithdrawalFromTheWallet)}
        </Typography>
      </>
    )
  }

  return {
    createPopoverItems,
    excelType,
  }
}

export default useCreateGridToolbar
