const baseComponentsStorybookConfig = {
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
    var _a, _b
    ;(_b =
      (_a = config === null || config === void 0 ? void 0 : config.module) === null || _a === void 0
        ? void 0
        : _a.rules) === null || _b === void 0
      ? void 0
      : _b.push({
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
export {}
//# sourceMappingURL=main.js.map
