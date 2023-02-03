import { HBIcon, HBIconButton } from '@hasty-bazar/core'
import { Stack, styled, Typography } from '@mui/material'
import { FC, useState } from 'react'

const HBIconButtonStyle = styled(HBIconButton)(({ theme }) => ({
  minWidth: 'auto',
  padding: 0,
  border: 'none',
}))

interface IReduseOfProductProps {
  countOfProduct: number
  countChanged: (value: number) => void
}

const ReduseOfProduct: FC<IReduseOfProductProps> = (props) => {
  const { countOfProduct, countChanged } = props
  const [count, setCount] = useState<number>(countOfProduct)

  const handlePlus = () => {
    countChanged(count + 1)
    setCount(count + 1)
  }

  const handleMinus = () => {
    countChanged(count - 1)
    setCount(count - 1)
  }

  return (
    <Stack alignItems="center" direction="row" spacing={6}>
      <Stack
        direction="row"
        sx={{ width: 168, height: 55, backgroundColor: 'grey.100', borderRadius: 2 }}
        justifyContent="center"
        spacing={7}
        alignItems="center"
      >
        <HBIconButtonStyle
          disabled={countOfProduct === count}
          onClick={handlePlus}
          sx={{ backgroundColor: 'inherit!important' }}
          icon={
            <HBIcon
              type="plus"
              sx={{ color: countOfProduct !== count ? 'primary.main' : 'grey.300' }}
            />
          }
        />
        <Stack alignItems="center">
          <Typography variant="subtitle1" color="primary.main">
            {count}
          </Typography>
        </Stack>

        <HBIconButtonStyle
          disabled={count <= 1}
          onClick={handleMinus}
          sx={{ backgroundColor: 'inherit!important' }}
          icon={<HBIcon type={'minus'} sx={{ color: count <= 1 ? 'grey.300' : 'primary.main' }} />}
        />
      </Stack>
    </Stack>
  )
}

export default ReduseOfProduct
