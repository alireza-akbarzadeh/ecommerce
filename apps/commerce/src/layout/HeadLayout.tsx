import Head from 'next/head'
import { useRouter } from 'next/router'

export const siteTitle = ' دارتیل - بازار اینترنتی دارتیل'

interface HeadLayoutType {
  title?: string
  description?: string
  keywords?: string
  imageUrl?: string
  product?: {
    id?: string
    name?: string
    price?: string
    oldPrice?: string
    availability?: 'instock' | 'outofstock'
    imageUrl?: string
  }
}

const logo = 'https://dartil.com/icons/icon-192x192.png'

function HeadLayout({ description, imageUrl, keywords, title, product }: HeadLayoutType) {
  const router = useRouter()
  const canonicalUrl = (
    process.env.NEXT_PUBLIC_SITE_URL + (router.asPath === '/' ? '' : router.asPath)
  ).split('?')[0]
  return (
    <Head>
      <link rel="canonical" href={canonicalUrl} />
      <meta name="application-name" content="Dartil" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="apple-mobile-web-app-title" content="Dartil" />
      <meta name="format-detection" content="telephone=no" />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="msapplication-TileColor" content="#FEC601" />
      <meta name="msapplication-tap-highlight" content="no" />
      <meta name="theme-color" content="#003768" />

      <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
      <link rel="apple-touch-icon" sizes="152x152" href="/icons/icon-512x512.png" />
      <link rel="apple-touch-icon" sizes="180x180" href="/icons/icon-384x384.png" />
      <link rel="apple-touch-icon" sizes="167x167" href="/icons/icon-512x512.png" />

      <link rel="icon" type="image/png" sizes="32x32" href="/icons/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/icons/favicon-16x16.png" />
      <link rel="manifest" href="/manifest.json" />
      <link rel="shortcut icon" href="/icons/favicon.ico" />

      <meta name="twitter:creator" content="@Dartil" />
      <meta property="og:site_name" content="Dartil" />

      <link rel="icon" href="/icons/favicon.ico" />
      <meta
        name="viewport"
        content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, user-scalable=no, viewport-fit=cover"
      />

      <meta name="description" content={'دارتیل  ، ' + description} />
      <meta name="keywords" content={'دارتیل' + keywords} />
      <meta name="og:title" content={title || siteTitle} key="og:title" />
      <meta property="og:type" content="website" key="og:type" />
      <meta property="og:url" content="https://dartil.com" key="og:url" />
      <meta property="og:title" content={title || siteTitle} key="og:titlep" />
      <meta property="og:description" content={description} key="og:description" />
      <meta property="og:image" content={imageUrl || logo} key="og:image" />
      <meta property="twitter:card" content={imageUrl || logo} />

      <title>{title || siteTitle}</title>
      <meta property="twitter:url" content="https://dartil.com" key="twitter:url" />
      <meta property="twitter:title" content={title || siteTitle} key="twitter:title" />
      <meta property="twitter:description" content={description} key="twitter:description" />
      <meta property="twitter:image" content={imageUrl || logo} key="twitter:image" />
      <meta name="robots" content="noindex" />

      {!!product && (
        <>
          <meta name="product_id" content={product.id} />
          <meta name="product_name" content={product.name} />
          <meta name="product_price" content={product.price} />
          <meta name="product_old_price" content={product.oldPrice} />
          <meta name="availability" content={product.availability} />
          <meta property="og:image" content={product.imageUrl} key="og:image" />
        </>
      )}
    </Head>
  )
}

export default HeadLayout
