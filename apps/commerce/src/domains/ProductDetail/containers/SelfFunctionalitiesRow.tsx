import { ShareModal } from '@hasty-bazar-commerce/components'
import { AddOrRemoveFavorite } from '@hasty-bazar-commerce/containers'
import { isServer } from '@hasty-bazar-commerce/utils'
import { HBIconButton } from '@hasty-bazar/core'
import { Stack, styled } from '@mui/material'
import Image from 'next/image'
import { FC, useState } from 'react'

const ButtonStyle = styled(HBIconButton)(({ theme }) => ({
  border: 'none',
  backgroundColor: 'inherit!important',
  color: `${theme.palette.grey[500]}!important`,
}))

interface ISelfFunctionalitiesRowProps {
  productId: string
}

const SelfFunctionalitiesRow: FC<ISelfFunctionalitiesRowProps> = (props) => {
  const { productId } = props
  const [openShareModal, setOpenShareModal] = useState(false)

  return (
    <Stack direction="row" spacing={5}>
      <Stack spacing={4} direction="row" alignItems="center">
        <ButtonStyle
          onClick={() => {
            setOpenShareModal(true)
          }}
          icon={<Image width={24} height={24} src="/assets/svg/Share.svg" />}
        />

        <AddOrRemoveFavorite productId={productId} />
      </Stack>
      {/* <HBButton variant="outlined" fullWidth>
        <FormattedMessage {...ProductionDetailMessages.iHave} />
      </HBButton> */}

      <ShareModal
        open={openShareModal}
        title=""
        shareUrl={!isServer() ? window.location.href : ''}
        onClose={() => {
          setOpenShareModal(false)
        }}
      />
    </Stack>
  )
}

export default SelfFunctionalitiesRow
