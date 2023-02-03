const Sitemap = () => {
  return null
}

export const getServerSideProps = async ({ res }: any) => {
  const products = await fetch(process.env.NEXT_PUBLIC_GATEWAY + '/Web/Catalog/sitemap').then(
    (res) => res.json(),
  )

  const BASE_URL = 'https://dartil.com'

  const staticPaths = [
    { url: `${BASE_URL}/about-us`, changeFreq: 'monthly', priority: '0.8' },
    { url: `${BASE_URL}/best-sellers`, changeFreq: 'monthly', priority: '0.8' },
    { url: `${BASE_URL}/careers`, changeFreq: 'monthly', priority: '0.8' },
    { url: `${BASE_URL}/cotact-us`, changeFreq: 'monthly', priority: '0.8' },
    { url: `${BASE_URL}/discountDay`, changeFreq: 'monthly', priority: '0.8' },
    { url: `${BASE_URL}/faq`, changeFreq: 'monthly', priority: '0.8' },
    { url: `${BASE_URL}/privacy`, changeFreq: 'monthly', priority: '0.8' },
    { url: `${BASE_URL}/seller-landing`, changeFreq: 'monthly', priority: '0.8' },
  ]

  const dynamicPaths = products?.data?.items?.map((product: any) => {
    return {
      url: `${BASE_URL}/product/${product?.hsin}/${product?.slug}`,
    }
  })

  const allPaths = [...staticPaths, ...dynamicPaths]

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${allPaths
        .map((path) => {
          return `
            <url>
              <loc>${path.url}</loc>
              <lastmod>${new Date().toISOString()}</lastmod>
              <changefreq>${path.changeFreq || 'daily'}</changefreq>
              <priority>${path.priority || '1'}</priority>
            </url>
          `
        })
        .join('')}
    </urlset>
`
  res.setHeader('Content-Type', 'text/xml')
  res.write(sitemap)
  res.end()

  return {
    props: {},
  }
}

export default Sitemap
