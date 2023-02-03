import { HBIcon, HBIconButton } from '@hasty-bazar/core'
import { Stack, styled } from '@mui/material'
import Image from 'next/image'
import { FC } from 'react'

const ButtonStyle = styled(HBIconButton)(({ theme }) => ({
  border: 'none',
  backgroundColor: 'inherit!important',
  color: `${theme.palette.grey[500]}!important`,
}))

const SelfFunctionalitiesRow: FC = () => {
  return (
    <Stack direction="row" spacing={5}>
      <Stack spacing={4} direction="row" alignItems="center">
        <ButtonStyle
          onClick={() => {}}
          icon={<Image width={24} height={24} src="/assets/svg/Share.svg" />}
        />

        <ButtonStyle icon={<HBIcon sx={{ color: 'grey.500' }} type="heartSign" />} />
      </Stack>
    </Stack>
  )
}

export default SelfFunctionalitiesRow
