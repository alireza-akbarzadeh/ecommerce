import { ChangeEvent } from 'react'

export const checkPositiveNumber = (e: ChangeEvent<HTMLInputElement>) => {
  const target = e.target as HTMLInputElement
  let str = target.value
  const regExp = /^(\d+(\.\d+)?)$/
  if (Number(str) < 0 || !regExp.test(str)) {
    target.value = ''
    return
  }
}

export const checkPositiveIntgerNumber = (e: ChangeEvent<HTMLInputElement>) => {
  const target = e.target as HTMLInputElement
  let str = target.value
  const regExp = /^\d+$/
  if (Number(str) < 0 || !regExp.test(str)) {
    target.value = ''
    return
  }
}
