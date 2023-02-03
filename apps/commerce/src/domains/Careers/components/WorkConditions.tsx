import {
  BlueBox,
  YellowBox,
} from '@hasty-bazar-commerce/domains/AboutUs/components/AboutUsComponents.styles'
import { Box, Grid, Stack, styled, Typography } from '@mui/material'
import Image from 'next/image'
import { FC } from 'react'
import { useIntl } from 'react-intl'
import careersMessage from '../careers.message'
import { AdvantagesItem, WrapperStyle } from './CareersComponents.styles'

interface AdvantagesData {
  label: string
  img?: any
}

export const Boxx = styled(Grid)(({ theme }) => ({
  borderRadius: 8,
  zIndex: 1,
}))

const WorkConditions: FC = () => {
  const { formatMessage } = useIntl()

  const advantagesData: AdvantagesData[] = [
    {
      label: formatMessage(careersMessage.birthdayParty),
      img: '/assets/svg/birthdayParty.svg',
    },
    {
      label: formatMessage(careersMessage.launch),
      img: '/assets/svg/launth.svg',
    },
    {
      label: formatMessage(careersMessage.kopon),
      img: '/assets/svg/kopon.svg',
    },
    {
      label: formatMessage(careersMessage.buyNowPayLater),
      img: '/assets/svg/buyNowPayLater.svg',
    },
    {
      label: formatMessage(careersMessage.loan),
      img: '/assets/svg/loan.svg',
    },
    {
      label: formatMessage(careersMessage.snack),
      img: '/assets/svg/snack.svg',
    },
    {
      label: formatMessage(careersMessage.supplementaryInsurance),
      img: '/assets/svg/supplementaryInsurance.svg',
    },
    {
      label: formatMessage(careersMessage.parking),
      img: '/assets/svg/parking.svg',
    },
  ]

  return (
    <WrapperStyle container spacing={2}>
      <Grid item xs={12} sm={7} md={8} lg={8}>
        <Box
          width={'90%'}
          height={{ md: 355, xs: 255 }}
          position="relative"
          m={{ md: 'unset', xs: '0 auto' }}
        >
          <BlueBox />
          <Box
            component={'img'}
            sx={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              zIndex: 2,
              borderRadius: 2,
              objectPosition: 'top',
            }}
            src="/assets/careersConditionWork.png"
          />
          <YellowBox />
        </Box>

        <Stack direction="row" alignItems="center" mb={4} mt={10}>
          <Typography component="h1" variant="h4" color="primary.main">
            {formatMessage(careersMessage.workCondition)}
          </Typography>
          <Typography variant="h4" color="info.dark">
            {formatMessage(careersMessage.inHastiBazar)}
          </Typography>
        </Stack>
        <Typography variant="subtitle2" color="text.primary" align="justify" pr={9}>
          {formatMessage(careersMessage.workConditionDes)}
        </Typography>
      </Grid>

      <Grid
        item
        xs={12}
        sm={5}
        md={4}
        lg={4}
        container
        mt={{ xs: 7, sm: 'unset' }}
        mx={{ xs: 8, sm: 'unset' }}
      >
        {advantagesData.map((item) => (
          <Grid
            item
            xs={6}
            sm={6}
            md={6}
            lg={5}
            container
            spacing={2}
            justifyContent={{ xs: 'center', sm: 'flex-end' }}
            height={{ xs: 120, sm: 90 }}
          >
            <AdvantagesItem>
              <Box sx={{ mb: 2 }}>
                <Image src={item.img} alt={item.label} width={27} height={27} objectFit="contain" />
              </Box>
              <Typography variant="subtitle2" sx={{ color: 'gray.900' }}>
                {item.label}
              </Typography>
            </AdvantagesItem>
          </Grid>
        ))}
      </Grid>
    </WrapperStyle>
  )
}

export default WorkConditions
