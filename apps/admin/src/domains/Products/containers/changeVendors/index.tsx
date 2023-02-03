import {
  GetAllProductsQueryResult,
  usePutAdminCatalogProductsBulkUpdateProductVendorUpdateMutation,
} from '@hasty-bazar/admin-shared/services/catalogApi.generated'
import { HBDialog, HBForm, openToast } from '@hasty-bazar/core'
import { Box, Typography } from '@mui/material'
import { useForm, useWatch } from 'react-hook-form'
import { useIntl } from 'react-intl'
import ProductPageMessages from '../../ProductPage.messages'
import SellerDataGrid from '../productForm/addProduct/sellerDataGrid'

interface ChangeVendorDialogProps {
  open: boolean
  onClose: () => void
  selectedRows: GetAllProductsQueryResult[]
  refetch?: () => void
}
export type FormType = {
  vendorId?: string
  productIds?: string[]
}
function ChangeVendorDialog({ open, onClose, selectedRows, refetch }: ChangeVendorDialogProps) {
  const formProviderProps = useForm<FormType>({
    mode: 'onChange',
  })
  const { control, setValue } = formProviderProps
  const { vendorId = '' } = useWatch({
    control,
  })
  const { formatMessage } = useIntl()

  const [putChangeVendors] = usePutAdminCatalogProductsBulkUpdateProductVendorUpdateMutation()

  const handleChangeSellerDialog = async () => {
    const changeVendorModel = {
      vendorId,
      productIds: selectedRows?.map((row) => row?.id),
    } as FormType

    await putChangeVendors({
      'client-name': 'Swagger on HIT.Hastim.Catalog.Endpoints.AdminApi',
      'client-version': '1.0.1.100',
      bulkUpdateProductVendorModel: {
        ...(changeVendorModel as FormType),
      },
    })
      .unwrap()
      .then((res) =>
        openToast({
          message: formatMessage(ProductPageMessages.vendorChanged, {
            count: res?.data?.numberOfEdits,
          }),
          type: 'success',
        }),
      )
    onClose()
    refetch?.()
  }

  return (
    <HBDialog
      content={
        <Box sx={{ maxWidth: 500 }}>
          <Typography variant="body1" sx={{ mb: 4 }}>
            {formatMessage(ProductPageMessages.selectedProducts)} {selectedRows?.length}
          </Typography>
          <HBForm formProviderProps={formProviderProps} onSubmit={() => {}}>
            <SellerDataGrid
              required
              onSelectSeller={(value) => {
                setValue('vendorId', value?.id as unknown as string)
              }}
            />
          </HBForm>
        </Box>
      }
      title={formatMessage(ProductPageMessages.editVendors)}
      acceptBtn={formatMessage(ProductPageMessages.confirm)}
      rejectBtn={formatMessage(ProductPageMessages.cancel)}
      open={open}
      onClose={onClose}
      onReject={onClose}
      onAccept={handleChangeSellerDialog}
      onAcceptBtnProps={{
        disabled: !vendorId,
      }}
    />
  )
}

export default ChangeVendorDialog
