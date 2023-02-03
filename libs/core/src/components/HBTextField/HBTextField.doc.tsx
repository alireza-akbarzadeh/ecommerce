import { Box, Link, Stack, Typography } from '@mui/material'

const HBTextFieldDoc = () => {
  return (
    <Stack spacing={4}>
      <Typography component={'h1'} variant="h4">
        محتوای مستند
      </Typography>

      <Typography component={'p'}>
        در فایل اصلی :
        <br />
        برای نمایش دادن آیکون مناسب پسورد تنظیمات لازم صورت گرفته. به این صورت است که اگر تایپ
        اینپوت ما پسورد بود، آیکون ظاهر میشود و با کلیک روی آن آیکونش عوض میشود
      </Typography>
      <Typography>
        we need to support persian numbers in our inputs, extend masked inputs to allow ۰-۹
        characters.
        <Typography>
          numeric mode: after checking docs, found best practice for number mode ux, behind of
          scene, we mapped number type to text, and open input in numeric mode, now you can see
          numeric keyboard without top/down arrows, mouse wheel unexpected behavior, controlled
          number inputs with RegExp allow user to enter 0-9 and ۰-۹ characters not( . , - ).
        </Typography>
      </Typography>
      <Box>
        source :
        <Link href="https://mui.com/material-ui/react-text-field/" target="_blank">
          https://mui.com/material-ui/react-text-field/
        </Link>
      </Box>
    </Stack>
  )
}

export default HBTextFieldDoc
