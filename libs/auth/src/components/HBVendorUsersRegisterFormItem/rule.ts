type isOffensiveWordType = (value: string) => Promise<'error' | 'offensive' | 'ok'>
export const isOffensiveWord: isOffensiveWordType = async (value) => {
  try {
    const res = await fetch(
      'https://api.text-mining.ir/api/Token/GetToken?apikey=293b2018-ace9-ec11-80f8-98ded002619b	',
      { method: 'GET' },
    )
    const { token } = await res.json()
    const response = await fetch('https://api.text-mining.ir/api/TextRefinement/SwearWordTagger', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(value),
    })
    const data = await response.json()
    return Object.keys(data).length > 0 ? Promise.resolve('offensive') : Promise.resolve('ok')
  } catch (error) {
    return Promise.reject('error')
  }
}

type isValidNationalCodeType = (code: string) => boolean
export const isValidNationalCode: isValidNationalCodeType = (code) => {
  if (!code) return false
  if (code.length !== 10 || /(\d)(\1){9}/.test(code)) return false
  let sum = 0,
    chars = code.split('')
  for (let i = 0; i < 9; i++) sum += +chars[i] * (10 - i)
  let lastDigit,
    remainder = sum % 11
  lastDigit = remainder < 2 ? remainder : 11 - remainder
  return +chars[9] === lastDigit
}
