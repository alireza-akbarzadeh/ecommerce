import { HBDialog, HBForm } from '@hasty-bazar/core'
import { Box, Grid, Typography } from '@mui/material'
import { FC } from 'react'
import { useIntl } from 'react-intl'
import attributesPageMessages from '../Attributes.messages'
import AttributeDetailForm from '../containers/AttributeDetailForm'
import { AttributeKindTypeCode } from '../containers/AttributesAddEditForm'
import { AttributeDetailDataProps } from '../containers/AttributesDetailDataGrid'

interface IAttributeDetailDialog {
  open: boolean
  onClose: () => void
  onSubmit?: (values: IAttributeDetailSubjectForm) => void
  updatedValue: AttributeDetailDataProps | null
  attributeType?: AttributeKindTypeCode
}

export interface IAttributeDetailSubjectForm {
  id?: string
  attributeValue: string
  displayOrder: string
  attributeStatus: boolean
  attributeIcon: string
  attributeColor?: string
}

const AttributeDetailDialog: FC<IAttributeDetailDialog> = ({
  onClose,
  onSubmit,
  open,
  updatedValue,
  attributeType,
}) => {
  const handleSubmit = (values: IAttributeDetailSubjectForm) => {
    onSubmit?.(values)
  }

  const { formatMessage } = useIntl()

  return (
    <HBDialog
      fullWidth
      maxWidth="sm"
      title={formatMessage(attributesPageMessages.attributesValues)}
      open={open}
      onClose={onClose}
      onReject={onClose}
      content={
        <Typography color="text.secondary" variant="body1">
          {formatMessage(attributesPageMessages.attributesEnterValues)}
        </Typography>
      }
    >
      <HBForm<IAttributeDetailSubjectForm> onSubmit={handleSubmit} mode="all">
        <Box sx={{ marginTop: 8 }}>
          <Grid container spacing={8} alignItems="flex-start">
            <AttributeDetailForm updatedValue={updatedValue} attributeType={attributeType} />
          </Grid>
        </Box>
      </HBForm>
    </HBDialog>
  )
}

export default AttributeDetailDialog
