import { GetAllSavedVendorsQueryResult } from '@hasty-bazar-commerce/services/catalogApi.generated'
import { HBButton, HBCheckBox, HBIcon } from '@hasty-bazar/core'
import { Box, Grid, Stack, styled } from '@mui/material'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { FC } from 'react'
import { FormattedMessage } from 'react-intl'
import SavedMessages from '../saved.messages'
import SavedCardInformation from './SavedCardInformation'

export const EmptySpace = styled(Box)(() => ({}))

interface IVendorCardProps {
  isSelected: boolean
  item: GetAllSavedVendorsQueryResult
  checkedCallBack: (lastSelectedValue: boolean, item: GetAllSavedVendorsQueryResult) => void
}

const VendorCard: FC<IVendorCardProps> = (props) => {
  const { isSelected, checkedCallBack, item } = props
  const router = useRouter()

  return (
    <Grid container columns={3} rowGap={6}>
      <Grid item sm={2} xs={3}>
        <Stack direction="row" spacing={{ sm: 8, xs: 1 }}>
          <Stack alignItems="flex-start" direction="row" position="relative">
            <HBCheckBox checked={isSelected} onChange={() => checkedCallBack(isSelected, item)} />
            <Box
              sx={{
                width: { sm: 144, xs: 100 },
                height: { sm: 144, xs: 100 },
                borderRadius: 4,
                position: 'relative',
                overflow: 'hidden',
                mr: { sm: 0, xs: 2 },
              }}
            >
              {!!item.imageUrl && (
                <Image src={`${process.env.NEXT_PUBLIC_CDN}${item.imageUrl}`} layout="fill" />
              )}
              {!item.imageUrl && <Image src="/assets/svg/store.svg" layout="fill" />}
            </Box>
          </Stack>

          <SavedCardInformation {...item} />
        </Stack>
      </Grid>
      <Grid item xs={3} sm={1} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <HBButton
          sx={{ gap: 2, width: { xs: '100%', sm: 'fit-content' }, boxShadow: 'none' }}
          onClick={() =>
            router.push({
              pathname: `/vendor/`,
              query: {
                baseFilter: JSON.stringify({ vendors: [item?.vendorId ?? ''] }),
              },
            })
          }
        >
          <HBIcon type="store" />
          <FormattedMessage {...SavedMessages.seeVendor} />
        </HBButton>
      </Grid>
    </Grid>
  )
}

export default VendorCard
