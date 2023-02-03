import { Dispatch, SetStateAction } from 'react'
import { useIntl } from 'react-intl'
import { Box, CardContent, Grid, Stack, Typography } from '@mui/material'
import { HBCircularProgressBtn, HBDialog } from '@hasty-bazar/core'
import { HBLink } from '@hasty-bazar/admin-shared/components'
import ordersManagementMessage from '@hasty-bazar-admin/domains/OrdersManagement/ordersManagement.message'
import { useGetAdminIdrVendorsQuery } from '@hasty-bazar/admin-shared/services/idrApi.generated'
import { CardWrapper } from './ModalShoppingCart.Style'
import VendorAvatar from './VendorAvatar'

interface IModalShoppingCart {
  openDialog: boolean
  setOpenDialog: Dispatch<SetStateAction<boolean>>
  id: string
  vendorIds: number[]
}

const VendorInfo = ({ openDialog, setOpenDialog, id, vendorIds }: IModalShoppingCart) => {
  const { formatMessage } = useIntl()
  const { data, isLoading } = useGetAdminIdrVendorsQuery(
    {
      'client-name': 'Swagger on HIT.Hastim.Catalog.Endpoints.WebApi',
      'client-version': '1.0.1.100',
      filter: `(new long[]{${vendorIds?.join(',')}}).Contains(@Id)`,
    },
    {
      skip: !id,
    },
  )
  return (
    <HBDialog
      open={openDialog}
      onClose={() => setOpenDialog(false)}
      onReject={() => setOpenDialog(false)}
    >
      <Box width={601} display="flex" justifyContent="center" alignItems="center">
        {isLoading ? (
          <HBCircularProgressBtn size={24} />
        ) : (
          <Grid container spacing={5}>
            {data?.data?.items?.length === 0 ? (
              <Typography mt={4} mx={8} variant={'subtitle1'} color={'grey.300'}>
                {formatMessage(ordersManagementMessage.recordAlert)}
              </Typography>
            ) : (
              data?.data?.items?.map((ship) => (
                <Grid item xs={12} md={6} key={ship.id}>
                  <CardWrapper variant={'outlined'}>
                    <CardContent>
                      <Stack spacing={2.5}>
                        <VendorAvatar partyId={String(ship?.partyId)} />
                        <Typography variant={'h6'} color={'grey.700'}>
                          {ship?.firstName + ' ' + ship?.lastName}
                        </Typography>
                        <Typography variant={'subtitle2'} color={'text.secondary'}>
                          {formatMessage(ordersManagementMessage.seller)} {ship.fullName}
                        </Typography>
                        <Typography variant={'subtitle2'} color={'text.secondary'}>
                          {formatMessage(ordersManagementMessage.address)}{' '}
                          {`${ship?.cityName} ${ship?.streetLine} ${ship?.plaque}`}
                        </Typography>
                        <Typography
                          variant={'subtitle2'}
                          sx={{ display: 'inline-flex', gap: 0.7, justifyContent: 'center' }}
                          color={'info.main'}
                        >
                          {formatMessage(ordersManagementMessage.store)}
                          <HBLink
                            underline={'none'}
                            variant={'subtitle2'}
                            href={'#'}
                            color={'info.main'}
                          >
                            {ship?.storeName}
                          </HBLink>
                        </Typography>
                      </Stack>
                    </CardContent>
                  </CardWrapper>
                </Grid>
              ))
            )}
          </Grid>
        )}
      </Box>
    </HBDialog>
  )
}

export default VendorInfo
