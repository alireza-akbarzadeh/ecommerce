import { Box, Typography } from '@mui/material'
import { FC } from 'react'

export const enum PossibilityOfEditingProductEnum {
  // [Description("قابل اجرا")]
  Applicable = 1,
  // [Description("بدون تغییر")]
  Unchanged = 2,
  // [Description("عدم رعایت ساختار داده")]
  FailureDataStructure = 3,
  // [Description("رکورد مورد نظر یافت نشد")]
  RecordNotFound = 4,
  // [Description("مقدار موجودی نامعتبر")]
  InvalidInventory = 5,
}

export interface StatusProps {
  status: PossibilityOfEditingProductEnum
  systemMessage?: string
}
const Status: FC<StatusProps> = ({ status, systemMessage }: StatusProps) => {
  function renderColor(
    status: PossibilityOfEditingProductEnum,
  ): 'primary.main' | 'error.main' | 'warning.main' | 'success.main' | 'grey.700' {
    switch (status) {
      case PossibilityOfEditingProductEnum.Applicable:
        return 'success.main'
      case PossibilityOfEditingProductEnum.Unchanged:
        return 'warning.main'
      case PossibilityOfEditingProductEnum.FailureDataStructure:
        return 'error.main'
      case PossibilityOfEditingProductEnum.RecordNotFound:
        return 'error.main'
      case PossibilityOfEditingProductEnum.InvalidInventory:
        return 'grey.700'
      default:
        return 'grey.700'
    }
  }

  return (
    <Box
      borderRadius={2}
      padding={1}
      height={24}
      px={3}
      minWidth={'78px'}
      alignSelf="center"
      justifyContent="center"
      textAlign={'center'}
      sx={({ typography }) => ({
        fontSize: typography.caption,
      })}
      component="div"
    >
      <Typography color={renderColor(status)} variant="caption">
        {systemMessage}
      </Typography>
    </Box>
  )
}
export default Status
