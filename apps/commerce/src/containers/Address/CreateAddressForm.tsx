import { AddressForm, AddressMap } from '@hasty-bazar-commerce/components/map/address'
import { GetAddressModel } from '@hasty-bazar-commerce/services/idrApi.generated'
import { HBButton } from '@hasty-bazar/core'
import { Box, Grid, Stack, styled } from '@mui/material'
import { AnimatePresence, motion } from 'framer-motion'
import { FC, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { FormattedMessage } from 'react-intl'
import ContainersMessages from '../Containers.message'

const ItemWrapperStyle = styled(Box)(({ theme }) => ({
  overflow: 'auto',
}))

export interface IAddressModel extends Omit<GetAddressModel, 'unit'> {
  unit?: string
}

interface CreateAddressFormProps {
  loading: boolean
  onAddressViewChange: (value: 'map' | 'form') => void
  onClose?: () => void
}

const CreateAddressForm: FC<CreateAddressFormProps> = (props) => {
  const { loading, onAddressViewChange, onClose } = props
  const [mapLoading, setMapLoading] = useState<boolean>(false)
  const [mapFormStatus, setMapFormStatus] = useState<boolean>(true)
  const [state, setState] = useState<'map' | 'form'>('map')
  const {
    watch,
    formState: { isValid },
  } = useFormContext<IAddressModel>()
  const [localityValidationLoading, setLocalityValidationLoading] = useState<boolean>(false)

  const addressFormDisable =
    watch('postalCode')?.length !== 10 ||
    watch('recipientMobileNo')?.length !== 9 ||
    (!watch('streetLine') && !watch('prefixAddress')) ||
    !watch('cityId') ||
    !watch('district') ||
    !watch('postalCode') ||
    !watch('provinceId') ||
    !watch('title') ||
    !watch('unit') ||
    !watch('recipientName') ||
    !isValid

  const mapButtonDisable = !watch('latitude') || !watch('longitude') || !mapFormStatus

  const contents = {
    map: (
      <ItemWrapperStyle height={430}>
        <AddressMap fetchCompleted={setMapFormStatus} loadingChanged={setMapLoading} />
      </ItemWrapperStyle>
    ),
    form: (
      <AddressForm
        loadingChanged={setLocalityValidationLoading}
        changeView={() => {
          setState('map')
          onAddressViewChange('map')
        }}
      />
    ),
  }

  return (
    <Stack spacing={4}>
      <AnimatePresence exitBeforeEnter>
        <motion.div
          key={state}
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -10, opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {contents[state]}
        </motion.div>
      </AnimatePresence>
      <Grid container alignItems="center" justifyContent="space-between" sx={{ flex: 1 }}>
        <Grid item xs={4} sm={2.5} md={2}>
          <HBButton fullWidth onClick={onClose} variant="outlined">
            <FormattedMessage {...ContainersMessages.cancel} />
          </HBButton>
        </Grid>

        {state === 'map' && (
          <Grid item xs={4} sm={2.5} md={2}>
            <HBButton
              fullWidth
              loading={mapLoading}
              onClick={() => {
                setState('form')
                onAddressViewChange('form')
              }}
              variant="contained"
              disabled={mapButtonDisable || mapLoading}
            >
              <FormattedMessage {...ContainersMessages.select} />
            </HBButton>
          </Grid>
        )}

        {state === 'form' && (
          <Grid item xs={4} sm={2.5} md={2}>
            <HBButton
              fullWidth
              loading={loading || localityValidationLoading}
              disabled={addressFormDisable || loading}
              type="submit"
              color="primary"
            >
              <FormattedMessage {...ContainersMessages.saveAndContinueLabel} />
            </HBButton>
          </Grid>
        )}
      </Grid>
    </Stack>
  )
}

export default CreateAddressForm
