import { Link, Typography } from '@mui/material'
import { Meta, Story } from '@storybook/react'
import HBBreadcrumbs, { HBBreadcrumbsProps } from './HBBreadcrumbs'
import HBBreadcrumbsDoc from './HBBreadcrumbs.doc'

export default {
  component: HBBreadcrumbs,
  parameters: {
    docs: {
      page: HBBreadcrumbsDoc,
    },
    options: {
      showPanel: true,
    },
  },
  title: 'core/HBBreadcrumbs',
  argTypes: {
    separator: {
      type: 'string',
      name: 'separator',
      defaultValue: '/',
    },
    maxItems: {
      type: 'number',
      name: 'max Items',
    },
  },
} as Meta<HBBreadcrumbsProps>

const Template: Story<HBBreadcrumbsProps> = (args) => (
  <HBBreadcrumbs {...args}>
    <Link underline="hover" color="inherit" href="#">
      خانه
    </Link>
    <Link underline="hover" color="inherit" href="#">
      کاتالوگ
    </Link>
    <Link underline="hover" color="inherit" href="#">
      اکسسوری ها
    </Link>
    <Link underline="hover" color="inherit" href="#">
      کالکشن جدید
    </Link>
    <Typography color="text.primary">بلتز</Typography>
  </HBBreadcrumbs>
)

export const Primary = Template.bind({})
Primary.args = {}
