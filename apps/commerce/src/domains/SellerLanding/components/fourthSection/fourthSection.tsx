import { HBCarousel, ValuingCustomPagination } from '@hasty-bazar/core'
import { Stack, Typography } from '@mui/material'
import Image from 'next/image'

function ForthSection() {
  // const { formatMessage } = useIntl()
  // const sliderItems = [
  //   {
  //     title: formatMessage(sellerLandingMessages.slider1Title),
  //     description: formatMessage(sellerLandingMessages.slider1Description)
  //   },
  //   {
  //     title: formatMessage(sellerLandingMessages.slider2Title),
  //     description: formatMessage(sellerLandingMessages.slider2Description)
  //   },
  //   {
  //     title: formatMessage(sellerLandingMessages.slider3Title),
  //     description: formatMessage(sellerLandingMessages.slider3Description)
  //   },
  //   {
  //     title: formatMessage(sellerLandingMessages.slider4Title),
  //     description: formatMessage(sellerLandingMessages.slider4Description)
  //   },
  //   {
  //     title: formatMessage(sellerLandingMessages.slider5Title),
  //     description: formatMessage(sellerLandingMessages.slider5Description)
  //   },
  // ]

  const sliderItems = [
    {
      title: 'آنچه فروشندگان درباره ما می‌گویند',
      description:
        '«همکاری با دارتیل، نقطه عطفی در عمر تجاری شرکت ما بود. سهولت در استفاده، تعداد مخاطبان، پشتیبانی فوق‌العاده و امکان ارسال متنوع از جمله مزایای همکاری با دارتیل است که سبب افزایش فروش محصولات ما شده است.»',
      name: 'علیرضا محمدی',
      job: 'مدیر فروش شرکت آونگ تلکام',
    },
    {
      title: 'آنچه فروشندگان درباره ما می‌گویند',
      description:
        'ستد هستی (هلدینگ گلرنگ ) و شرکت گلدیران با سینرژی و هم افزایی حاصل از آن ارزش آفرینی همراه با خوشنودی بیشتری برای مشتریان و ذینفعان این دو گروه معظم و خوشنام اقتصاد کشور ایجاد گردد.        ',
      name: 'رضا آرمندپیشه',
      job: 'معاونت فروش جی‌پلاس',
    },
  ]
  return (
    <Stack
      sx={{
        width: '100%',
        pt: 12,
      }}
    >
      <Stack
        flexDirection={{
          xs: 'column',
          md: 'row',
        }}
        position={'relative'}
        display="flex"
      >
        <Stack
          display="flex"
          sx={{
            overflow: 'visible',
            borderRadius: 2,
            height: 272,
            alignSelf: 'center',
            position: 'absolute',
            marginTop: (theme) => theme.spacing(-16),
            width: {
              xs: '100%',
              md: '60%',
            },
            bgcolor: 'info.dark',
          }}
        ></Stack>
        <Stack
          width="40%"
          pt={12.5}
          display="flex"
          flexDirection="column"
          gap={2}
          sx={{
            zIndex: 1,
            '.swiper-pagination': {
              textAlign: 'left',
              paddingLeft: '20px',
            },
          }}
        >
          <HBCarousel
            pagination={{
              renderBullet(index, className) {
                return ValuingCustomPagination(index, className)
              },
              clickable: true,
            }}
            navigation={false}
            loop
          >
            {sliderItems.map((item, index) => (
              <Stack p={6} key={index} pb={10} pt={8} display="flex" flexDirection="column">
                <Typography mb={6} color="common.white" variant="h6">
                  {item.title}
                </Typography>
                <Typography
                  color="common.white"
                  variant="subtitle2"
                  sx={{ lineHeight: 1.43, marginBottom: 2 }}
                >
                  {item.description}
                </Typography>
                <Typography
                  color="common.white"
                  variant="subtitle2"
                  sx={{ lineHeight: 1.43, marginBottom: 2 }}
                >
                  {item.name} - {item.job}
                </Typography>
              </Stack>
            ))}
          </HBCarousel>
        </Stack>
        <Stack
          sx={{
            position: 'relative',
            zIndex: 1,
          }}
          width={583}
          height={432}
        >
          <Image src="/assets/seller.png" layout="fill" alt="sellerLandingStep1" />
        </Stack>
      </Stack>
    </Stack>
  )
}

export default ForthSection
