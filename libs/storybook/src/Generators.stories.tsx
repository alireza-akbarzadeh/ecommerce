import { Box, Typography } from '@mui/material'
import { Meta } from '@storybook/react'
import { Highlighter } from 'rc-highlight'

const WelcomeStory = () => (
  <Box sx={{ direction: 'rtl' }}>
    <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-end', mb: 5 }}>
      <Typography variant="h3">ساخت کامپوننت در یک کتابخانه</Typography>
    </Box>
    <Typography variant="h6">
      جهت ساخت کامپوننت جدید در مسیر root پروژه دستور زیر را وارد کنید
    </Typography>
    <Highlighter
      style={{
        height: 60,
        padding: '0 24px',
        margin: '24px 0',
        direction: 'ltr',
      }}
      code="pnpm component-generator libName ComponentPascalName"
    />
    <Typography variant="h6">
      پس از اجرای دستور بالا با استفاده از generatorی که جهت سهول کار ساخته شده است,بصورت اتوماتیک
      ,در مسیر زیر فایل هایی با نام وارد شده ساخته خواهند شد که بصورت پیشفرض موارد ابتدایی مربوط به
      ساخت کامپوننت را دارا میباشند.
    </Typography>
    <Typography variant="h6">
      کافیست به جای عبارت libName نام کتابخانه مورد نظر خود مثلا core و به جای ComponentPascalName
      نام کامپوننت مورد نظر را وارد نمایید
    </Typography>
    <Highlighter
      style={{
        height: 60,
        padding: '0 24px',
        margin: '24px 0',
        direction: 'ltr',
      }}
      code="/lib/libName/src/components/ComponentPascalName"
    />

    <Typography variant="h6">راهنمایی بیشتر لطفا مطالعه فرمایید.</Typography>
    <a href="https://mui.com/system/basics" target="blank">
      جهت استایل دهی (ما عمدتا از سه نوع Styled components و Hook API و sx استفاده خواهیم کرد.)
    </a>
  </Box>
)

export default {
  component: WelcomeStory,
  title: 'Guides/Generators',
  parameters: {
    options: {
      showPanel: false,
    },
  },
  id: '1',
} as Meta<object>

export const ComponentGenerator = WelcomeStory.bind({})
