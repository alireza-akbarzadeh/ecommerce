import type { StorybookConfig } from '@storybook/react/types'

const baseComponentsStorybookConfig: StorybookConfig = {
  core: { builder: 'webpack5' },
  stories: ['../../**/*.stories.mdx', '../../**/*.stories.@(js|jsx|ts|tsx)'],
  staticDirs: [],
  addons: [
    'storybook-dark-mode',
    {
      name: '@storybook/addon-essentials',
      options: {
        backgrounds: false,
        outline: false,
        links: false,
      },
    },
    '@brightlayer-ui/storybook-rtl-addon/register',
    '@nrwl/react/plugins/storybook',
    'storybook-addon-designs',
  ],
  framework: '@storybook/react',
  features: {
    emotionAlias: false,
  },
  webpackFinal(config, options) {
    config?.module?.rules?.push({
      test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
      use: [
        {
          loader: 'file-loader',
          options: {
            name: '[name].[ext]',
            outputPath: 'fonts/',
          },
        },
      ],
    })

    return config
  },
}

module.exports = baseComponentsStorybookConfig
