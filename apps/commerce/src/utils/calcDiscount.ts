const calcDiscount = (price: number, originalPrice?: number) => {
  if (!originalPrice) return null
  return Math.round(((originalPrice - price) / originalPrice) * 100)
}

export default calcDiscount
