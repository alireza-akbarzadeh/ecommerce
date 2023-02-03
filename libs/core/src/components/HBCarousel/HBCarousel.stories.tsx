import { Meta, Story } from '@storybook/react'
import ValuingCustomPagination from './CarouselCustomPagination'
import HBCarousel, { IHBCarouselProps } from './HBCarousel'
import HBCarouselDoc from './HBCarousel.doc'

export default {
  component: HBCarousel,
  parameters: {
    docs: {
      page: HBCarouselDoc,
    },
    options: {
      showPanel: true,
    },

    design: {
      type: 'figma',
      title: 'carousel design',
      url: 'https://www.figma.com/file/arMPntPbKTLx8m2W9EzhKY/Customer---Login%2C-Forgot-pass%2C-Sign-up?node-id=41%3A1667',
    },
  },
  title: 'core/HBCarousel',
} as Meta<IHBCarouselProps>

const Template: Story<IHBCarouselProps> = (args) => {
  const images = [
    'https://unsplash.com/photos/1527pjeb6jg/download?force=true&w=640',
    'https://unsplash.com/photos/9wg5jCEPBsw/download?force=true&w=640',
    'https://unsplash.com/photos/phIFdC6lA4E/download?force=true&w=640',
    'https://unsplash.com/photos/1527pjeb6jg/download?force=true&w=640',
    'https://unsplash.com/photos/9wg5jCEPBsw/download?force=true&w=640',
    'https://unsplash.com/photos/phIFdC6lA4E/download?force=true&w=640',
    'https://unsplash.com/photos/1527pjeb6jg/download?force=true&w=640',
    'https://unsplash.com/photos/9wg5jCEPBsw/download?force=true&w=640',
    'https://unsplash.com/photos/phIFdC6lA4E/download?force=true&w=640',
    'https://unsplash.com/photos/phIFdC6lA4E/download?force=true&w=640',
  ]
  return (
    <HBCarousel
      {...args}
      pagination={{
        renderBullet(index, className) {
          return ValuingCustomPagination(index, className)
        },
        clickable: true,
      }}
      children={images.map((image) => (
        <img style={{ width: '100%' }} src={image} />
      ))}
      loop
    />
  )
}

export const Primary = Template.bind({})
Primary.args = {}
