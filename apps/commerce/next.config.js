// eslint-disable-next-line @typescript-eslint/no-var-requires
const withNx = require('@nrwl/next/plugins/with-nx')

/**
 * @type {import('@nrwl/next/plugins/with-nx').WithNxOptions}
 **/
const nextConfig = {
  reactStrictMode: true,
  nx: {
    // Set this to true if you would like to to use SVGR
    // See: https://github.com/gregberge/svgr
    svgr: true,
  },
  webpack(config, options) {
    config.module.rules.push({
      test: /\.(woff(2)?|ttf|eot)(\?v=\d+\.\d+\.\d+)?$/,
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
  i18n: {
    locales: ['fa', 'en'],
    defaultLocale: 'fa',
    localeDetection: false,
  },
  trailingSlash: true,
  images: {
    domains: [
      'cdn.dartil.com',
      'gcdnb.pbrd.co',
      'dkstatics-public.digikala.com',
      'images-na.ssl-images-amazon.com',
      'picsum.photos',
      'devcdn.hasti.co',
      'democdn.hasti.co',
      'testcdn.hasti.co',
      'stagecdn.hasti.co',
      'img.freepik.com',
      'devwebgateway.hasti.co',
      'cdn-develop.hasti.co',
      'cdn-dev.hasti.co',
      'cdn-test.hasti.co',
      'cdn-stage.hasti.co',
      'dartilcdn.hasti.co',
      'gcdnb.pbrd.co',
      'dkstatics-public.digikala.com',
      'images-na.ssl-images-amazon.com',
    ],
  },
}

module.exports = withNx(nextConfig)
