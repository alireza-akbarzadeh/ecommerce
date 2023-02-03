export function getProductType(pathname: string) {
  const isSimpleProduct = pathname.includes('simple')
  const productType: 'simple' | 'configurable' = isSimpleProduct ? 'simple' : 'configurable'
  return productType
}
